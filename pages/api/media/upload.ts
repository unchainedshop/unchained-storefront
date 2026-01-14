/**
 * API Route: /api/media/upload
 * Handle file uploads via multipart/form-data
 */

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import formidable from "formidable";
import {
  createAsset,
  getStoragePath,
  getFilesDir,
  getThumbnailPath,
} from "../../../modules/media/utils/mediaStorage";
import {
  getImageMetadata,
  generateThumbnail,
  supportsThumbnail,
} from "../../../modules/media/utils/imageProcessing";
import type { MediaAsset, UploadResult } from "../../../modules/media/types";
import { sanitizeFilename } from "../../../modules/media/types";
import { withCMSAuth } from "../../../lib/adminAuth";

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface ParsedForm {
  fields: formidable.Fields;
  files: formidable.Files;
}

async function parseForm(req: NextApiRequest): Promise<ParsedForm> {
  const uploadDir = getFilesDir();
  await fs.mkdir(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: MAX_FILE_SIZE,
    maxFiles: 20,
    filename: (name, ext, part) => {
      const storagePath = getStoragePath(part.originalFilename || "file");
      // Create subdirectories synchronously before formidable writes the file
      const fullPath = path.join(uploadDir, storagePath);
      fsSync.mkdirSync(path.dirname(fullPath), { recursive: true });
      return storagePath;
    },
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}

async function processUploadedFile(
  file: formidable.File,
  folderId: string | null,
  tags: string[],
  uploadedBy: string,
): Promise<UploadResult> {
  try {
    const filename = file.newFilename;
    const filePath = path.join(getFilesDir(), filename);

    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Move file if needed (formidable might put it in wrong place)
    if (file.filepath !== filePath) {
      await fs.rename(file.filepath, filePath);
    }

    // Get image metadata if applicable
    let dimensions: { width: number; height: number } | undefined;
    if (file.mimetype && supportsThumbnail(file.mimetype)) {
      const metadata = await getImageMetadata(filePath);
      if (metadata) {
        dimensions = { width: metadata.width, height: metadata.height };
      }
    }

    // Create asset record
    const asset = await createAsset({
      filename,
      originalName: file.originalFilename || "file",
      mimeType: file.mimetype || "application/octet-stream",
      size: file.size,
      dimensions,
      altText: "",
      title: sanitizeFilename(file.originalFilename || "file").replace(
        /\.[^.]+$/,
        "",
      ),
      description: "",
      tags,
      folderId,
      usageLocations: [],
      uploadedBy,
    });

    // Generate thumbnail if it's an image
    if (file.mimetype && supportsThumbnail(file.mimetype)) {
      const thumbPath = getThumbnailPath(asset.id);
      await generateThumbnail(filePath, thumbPath);
    }

    return { success: true, asset };
  } catch (error) {
    console.error("Error processing uploaded file:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Require CMS access for uploads
  const { authorized, user } = await withCMSAuth(req, res);
  if (!authorized) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { fields, files } = await parseForm(req);

    // Get folder and tags from form fields
    const folderId = fields.folderId
      ? Array.isArray(fields.folderId)
        ? fields.folderId[0]
        : fields.folderId
      : null;

    const tagsField = fields.tags
      ? Array.isArray(fields.tags)
        ? fields.tags[0]
        : fields.tags
      : "";

    const tags = tagsField
      ? tagsField
          .toString()
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    // Get uploaded files
    const uploadedFiles = files.file || files.files;
    if (!uploadedFiles) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const fileArray = Array.isArray(uploadedFiles)
      ? uploadedFiles
      : [uploadedFiles];

    // Process each file
    const uploadedBy = user?.name || user?.username || "admin";
    const results: UploadResult[] = [];
    for (const file of fileArray) {
      const result = await processUploadedFile(
        file,
        folderId === "null" || folderId === "" ? null : folderId,
        tags,
        uploadedBy,
      );
      results.push(result);
    }

    // Return results
    if (results.length === 1) {
      const result = results[0];
      if (result.success) {
        return res.status(201).json({ asset: result.asset });
      } else {
        return res.status(400).json({ error: result.error });
      }
    }

    // Multiple files
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    return res.status(201).json({
      assets: successful.map((r) => r.asset),
      processed: successful.length,
      failed: failed.length,
      errors: failed.map((r) => r.error),
    });
  } catch (error) {
    console.error("Upload error:", error);

    if (error instanceof Error && error.message.includes("maxFileSize")) {
      return res.status(413).json({ error: "File too large (max 50MB)" });
    }

    return res.status(500).json({ error: "Upload failed" });
  }
}
