/**
 * API Route: /api/media/crop
 * Crop an image and create a new asset from the cropped version
 */

import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import {
  getAsset,
  createAsset,
  getFilePath,
  getStoragePath,
  getThumbnailPath,
  getFilesDir,
} from "../../../modules/media/utils/mediaStorage";
import {
  cropImage,
  generateThumbnail,
  supportsThumbnail,
} from "../../../modules/media/utils/imageProcessing";
import { sanitizeFilename } from "../../../modules/media/types";

interface CropRequestBody {
  assetId: string;
  crop: {
    x: number; // percentage 0-100
    y: number;
    width: number;
    height: number;
  };
  format?: "jpeg" | "png" | "webp";
  quality?: number;
  /** If true, append suffix to original name. If string, use as new name */
  outputName?: boolean | string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { assetId, crop, format = "webp", quality = 85, outputName } =
      req.body as CropRequestBody;

    // Validate required fields
    if (!assetId || !crop) {
      return res.status(400).json({ error: "Missing assetId or crop data" });
    }

    if (
      typeof crop.x !== "number" ||
      typeof crop.y !== "number" ||
      typeof crop.width !== "number" ||
      typeof crop.height !== "number"
    ) {
      return res.status(400).json({ error: "Invalid crop coordinates" });
    }

    // Validate crop bounds
    if (
      crop.x < 0 ||
      crop.y < 0 ||
      crop.width <= 0 ||
      crop.height <= 0 ||
      crop.x + crop.width > 100 ||
      crop.y + crop.height > 100
    ) {
      return res.status(400).json({ error: "Crop coordinates out of bounds" });
    }

    // Get the source asset
    const sourceAsset = await getAsset(assetId);
    if (!sourceAsset) {
      return res.status(404).json({ error: "Source asset not found" });
    }

    // Check if it's an image
    if (!sourceAsset.mimeType.startsWith("image/")) {
      return res.status(400).json({ error: "Asset is not an image" });
    }

    // Determine output filename
    const ext = format === "jpeg" ? ".jpg" : `.${format}`;
    let newOriginalName: string;

    if (typeof outputName === "string") {
      newOriginalName = sanitizeFilename(outputName);
      if (!newOriginalName.endsWith(ext)) {
        newOriginalName += ext;
      }
    } else {
      const baseName = sourceAsset.originalName.replace(/\.[^.]+$/, "");
      newOriginalName = `${baseName}_cropped${ext}`;
    }

    // Generate storage path for new file
    const storagePath = getStoragePath(newOriginalName);
    const destPath = path.join(getFilesDir(), storagePath);

    // Get source file path
    const sourcePath = getFilePath(sourceAsset.filename);

    // Perform the crop
    const cropResult = await cropImage(sourcePath, destPath, {
      x: crop.x,
      y: crop.y,
      width: crop.width,
      height: crop.height,
      format,
      quality,
    });

    if (!cropResult) {
      return res.status(500).json({ error: "Failed to crop image" });
    }

    // Determine mime type
    const mimeTypes: Record<string, string> = {
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };

    // Create new asset record
    const newAsset = await createAsset({
      filename: storagePath,
      originalName: newOriginalName,
      mimeType: mimeTypes[format] || "image/webp",
      size: cropResult.size,
      dimensions: {
        width: cropResult.width,
        height: cropResult.height,
      },
      altText: sourceAsset.altText,
      title: `${sourceAsset.title} (cropped)`,
      description: sourceAsset.description,
      tags: [...sourceAsset.tags],
      folderId: sourceAsset.folderId,
      usageLocations: [],
      uploadedBy: sourceAsset.uploadedBy,
    });

    // Generate thumbnail for the cropped image
    if (supportsThumbnail(newAsset.mimeType)) {
      const thumbPath = getThumbnailPath(newAsset.id);
      await generateThumbnail(destPath, thumbPath);
    }

    return res.status(201).json({
      success: true,
      asset: newAsset,
      cropInfo: {
        sourceId: assetId,
        crop,
        format,
        quality,
      },
    });
  } catch (error) {
    console.error("Crop error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Crop failed",
    });
  }
}
