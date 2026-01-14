/**
 * New Page
 * Create a new page with the page builder
 */

import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { usePageEditor } from "../../../modules/page-builder/hooks/usePageEditor";
import type { Page } from "../../../modules/page-builder/types";

// Dynamic import to avoid SSR issues with drag-and-drop
const PageBuilder = dynamic(
  () => import("../../../modules/page-builder/components/PageBuilder"),
  { ssr: false },
);

const createNewPage = (): Page => {
  const timestamp = Date.now();
  return {
    id: `page_${timestamp}`,
    title: "Untitled Page",
    slug: `page-${timestamp}`,
    status: "draft",
    blocks: [],
    seo: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versions: [],
  };
};

const NewPagePage: React.FC = () => {
  const router = useRouter();
  const [newPage] = useState<Page>(createNewPage);

  const { handleSave, handlePublish, handleBack } = usePageEditor({
    onSlugChange: (newSlug) => router.replace(`/admin/pages/${newSlug}`),
  });

  return (
    <PageBuilder
      initialPage={newPage}
      onSave={handleSave}
      onPublish={handlePublish}
      onBack={handleBack}
    />
  );
};

export default NewPagePage;
