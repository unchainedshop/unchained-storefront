/**
 * Edit Menu
 * Admin page to edit an existing navigation menu
 */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import MetaTags from "../../../modules/common/components/MetaTags";
import type { Menu } from "../../../modules/menu-builder/types";

// Dynamic import to avoid SSR issues with the editor
const MenuEditor = dynamic(
  () => import("../../../modules/menu-builder/components/MenuEditor"),
  { ssr: false }
);

const EditMenuPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [menu, setMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || typeof slug !== "string") return;

    const fetchMenu = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/menus/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Menu not found");
            return;
          }
          throw new Error("Failed to load menu");
        }
        const data = await res.json();
        setMenu(data.menu);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load menu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [slug]);

  const handleSave = async (updatedMenu: Menu): Promise<Menu> => {
    const res = await fetch(`/api/menus/${updatedMenu.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMenu),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to save menu");
    }
    const data = await res.json();
    setMenu(data.menu);
    return data.menu;
  };

  const handlePublish = async (menuToPublish: Menu): Promise<Menu> => {
    const res = await fetch(`/api/menus/${menuToPublish.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...menuToPublish, status: "published" }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to publish menu");
    }
    const data = await res.json();
    setMenu(data.menu);
    return data.menu;
  };

  const handleBack = () => {
    router.push("/admin/menus");
  };

  if (isLoading) {
    return (
      <>
        <MetaTags title="Loading Menu - Admin" />
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <ArrowPathIcon className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading menu...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !menu) {
    return (
      <>
        <MetaTags title="Error - Admin" />
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error || "Menu not found"}</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Back to Menus
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags title={`Edit ${Object.values(menu.name)[0] || menu.slug} - Admin`} />
      <MenuEditor
        menu={menu}
        onSave={handleSave}
        onPublish={handlePublish}
        onBack={handleBack}
      />
    </>
  );
};

export default EditMenuPage;
