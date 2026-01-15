/**
 * Edit Page
 * Edit an existing page with the page builder
 */

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { usePageEditor } from "../../../modules/page-builder/hooks/usePageEditor";
import { createInitialTranslations } from "../../../modules/page-builder/utils/localization";
import { cmsConfig } from "../../../lib/cms.config";
import type { Page } from "../../../modules/page-builder/types";

// Dynamic import to avoid SSR issues with drag-and-drop
const PageBuilder = dynamic(
  () => import("../../../modules/page-builder/components/PageBuilder"),
  { ssr: false },
);

// Get collaboration WebSocket URL from environment or default
const getCollaborationWsUrl = (): string | null => {
  if (typeof window === "undefined") return null;

  // Check if collaboration is enabled
  if (process.env.NEXT_PUBLIC_ENABLE_COLLABORATION === "false") {
    return null;
  }

  // Use configured URL or default to same host with /collaboration path
  if (process.env.NEXT_PUBLIC_COLLABORATION_WS_URL) {
    return process.env.NEXT_PUBLIC_COLLABORATION_WS_URL;
  }

  // Default: use same host with WebSocket protocol
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/collaboration`;
};

// Helper to create a new page (used when slug is "new")
const createNewPage = (): Page => {
  const timestamp = Date.now();
  return {
    id: `page_${timestamp}`,
    title: { [cmsConfig.defaultLocale]: "Untitled Page" },
    slug: `page-${timestamp}`,
    status: "draft",
    blocks: [],
    seo: {},
    translations: createInitialTranslations(cmsConfig.defaultLocale),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versions: [],
  };
};

const EditPagePage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const isNewPage = slug === "new";
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use shared hook for save/publish/back
  const { handleSave, handlePublish, handleBack } = usePageEditor({
    slug: isNewPage ? undefined : (slug as string),
    onSlugChange: (newSlug) => router.replace(`/admin/pages/${newSlug}`),
  });

  // Collaboration config
  const collaborationConfig = useMemo(() => {
    const wsUrl = getCollaborationWsUrl();
    if (!wsUrl) return undefined;

    // Generate a simple user ID for this session
    const userId =
      typeof window !== "undefined"
        ? localStorage.getItem("pb_user_id") ||
          (() => {
            const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
            localStorage.setItem("pb_user_id", id);
            return id;
          })()
        : "anonymous";

    return {
      wsUrl,
      user: {
        id: userId,
        name: "Page Editor",
        avatar: undefined,
      },
    };
  }, []);

  useEffect(() => {
    if (!slug || typeof slug !== "string") return;

    // Handle "new" case - create a new page directly
    if (slug === "new") {
      setPage(createNewPage());
      setIsLoading(false);
      return;
    }

    const fetchPage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/pages/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Page not found");
          } else {
            throw new Error("Failed to load page");
          }
          return;
        }
        const data = await res.json();
        setPage(data.page);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load page");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Pages
          </button>
        </div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <PageBuilder
      initialPage={page}
      onSave={handleSave}
      onPublish={handlePublish}
      onBack={handleBack}
      collaborationConfig={collaborationConfig}
    />
  );
};

export default EditPagePage;
