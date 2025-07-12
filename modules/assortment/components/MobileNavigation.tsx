import React, { useState } from "react";
import Link from "next/link";
import { useIntl } from "react-intl";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import useCategoriesTree from "../hooks/useCategoriesTree";
import Thumbnail from "../../common/components/thumbnail";
import changeLanguage from "../../common/utils/changeLanguage";

const createPathFromArray = (path = []) => {
  return `/${(path || []).join("/")}`;
};

const Subtree = ({
  pageId,
  children = {},
  navigationTitle,
  path,
  subtree,
  media = [],
}) => {
  const intl = useIntl();
  const [showSubtree, setShowSubtree] = useState(false);

  const level = path.length - 2;

  const levelPadding = {
    0: "pl-4",
    1: "pl-8",
    2: "pl-12",
    3: "pl-16",
  };

  return Object.keys(children).length ? (
    <div key={pageId} className="border-b border-slate-200 dark:border-0">
      <button
        aria-label="Expand"
        type="button"
        className="flex w-full items-center justify-between p-4 text-left transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        onClick={() => setShowSubtree(!showSubtree)}
      >
        <div
          className={`flex items-center gap-3 ${levelPadding[level] || "pl-4"}`}
        >
          {media?.length > 0 && (
            <div className="flex-shrink-0">
              <Thumbnail media={media} className="w-8 h-8 rounded-lg" />
            </div>
          )}
          <span className="font-medium text-slate-900 dark:text-white">
            {navigationTitle}
          </span>
        </div>
        <div className="flex-shrink-0 pr-2">
          {showSubtree ? (
            <ArrowUpIcon className="h-5 w-5 text-slate-400" />
          ) : (
            <ArrowDownIcon className="h-5 w-5 text-slate-400" />
          )}
        </div>
      </button>
      {showSubtree && (
        <div className="bg-slate-50 dark:bg-slate-900/50">
          <Link
            href={createPathFromArray(path)}
            className={`block p-3 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200 ${levelPadding[level + 1] || "pl-8"}`}
          >
            {intl.formatMessage({
              id: "show_all",
              defaultMessage: "Show all",
            })}
          </Link>

          {Object.entries(children)
            .sort(([, aNode]: any, [, bNode]: any) => {
              return Number(aNode?.index) - bNode.index;
            })
            .map(([subPageId, node]: any) => (
              <Subtree
                path={node?.path}
                navigationTitle={node?.navigationTitle}
                subtree={subtree}
                key={subPageId}
                pageId={subPageId}
                {...node}
              />
            ))}
        </div>
      )}
    </div>
  ) : (
    <Link
      href={createPathFromArray(path)}
      className={`flex items-center gap-3 p-4 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-200 dark:border-0 ${levelPadding[level] || "pl-4"}`}
    >
      {media?.length > 0 && (
        <div className="flex-shrink-0">
          <Thumbnail media={media} className="w-8 h-8 rounded-lg" />
        </div>
      )}
      <span className="font-medium text-slate-900 dark:text-white">
        {navigationTitle}
      </span>
    </Link>
  );
};

const MobileNavigation = ({ doClose, isNavOpen }) => {
  const intl = useIntl();
  const { assortmentTree } = useCategoriesTree({ includeLeaves: false });
  return (
    <div className="mobile-menu-holder " data-is-open={isNavOpen}>
      <button
        aria-label="close"
        type="button"
        className="mobile-menu-close cursor-pointer appearance-none border-0 bg-transparent p-0 text-left text-inherit"
        onClick={doClose}
      >
        <span className="hidden">
          {intl.formatMessage({ id: "close", defaultMessage: "Close" })}
        </span>
      </button>
      <nav
        id="menu"
        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-0 overflow-hidden"
      >
        <div className="relative">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-0 bg-slate-50 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Categories
            </h2>
            <button
              aria-label="close"
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
              onClick={doClose}
            >
              <XMarkIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <span className="sr-only">
                {intl.formatMessage({ id: "close", defaultMessage: "Close" })}
              </span>
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {Object.entries(assortmentTree.children).map(
              ([pageId, node]: any) => (
                <Subtree
                  path={node?.path}
                  navigationTitle={node?.navigationTitle}
                  subtree={node?.children}
                  key={pageId}
                  pageId={pageId}
                  {...node}
                />
              ),
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-0 bg-slate-50 dark:bg-slate-900">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Languages
          </h3>
          <div className="space-y-2">
            {["en", "de"].map((lang) => (
              <button
                key={lang}
                aria-label={intl.formatMessage({
                  id: `language_${lang}`,
                  defaultMessage: "Language X",
                })}
                type="button"
                className="block w-full text-left px-3 py-2 text-sm rounded-md text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                onClick={() => changeLanguage(lang)}
              >
                {intl.formatMessage({
                  id: `language_${lang}`,
                  defaultMessage: "Language X",
                })}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MobileNavigation;
