import React, { useState } from "react";
import Link from "next/link";
import getConfig from "next/config";
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

const {
  publicRuntimeConfig: { theme },
} = getConfig();

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

  const levelClassMap = [
    "text-xl p-3",
    "pl-8 text-base py-3",
    "pl-12 text-base py-3",
    "pl-16 text-base py-3",
  ];

  return Object.keys(children).length ? (
    <div key={pageId} className="border-t border-color-slate-300">
      <button
        aria-label="Expand"
        type="button"
        className="flex w-full cursor-pointer appearance-none items-center justify-between border-0 bg-transparent p-0 text-left uppercase text-inherit hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={() => setShowSubtree(!showSubtree)}
      >
        <div className={`${levelClassMap[level]}`}>
          <Thumbnail media={media} />
          {navigationTitle}
        </div>
        {showSubtree ? (
          <ArrowUpIcon className="justify-canter items-align mr-3 inline-flex h-4 w-5 select-none align-middle" />
        ) : (
          <ArrowDownIcon className="justify-canter items-align mr-3 inline-flex h-4 w-5 select-none align-middle" />
        )}
      </button>
      {showSubtree ? (
        <div>
          <Link
            href={createPathFromArray(path)}
            className={`link block border-t border-color-slate-300 uppercase text-slate-600 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-500 ${
              levelClassMap[level + 1]
            }`}
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
      ) : (
        ""
      )}
    </div>
  ) : (
    <Link
      href={createPathFromArray(path)}
      className={`block border-t border-color-slate-300 uppercase hover:bg-slate-100 dark:hover:bg-slate-800 ${levelClassMap[level]}`}
    >
      <Thumbnail media={media} />
      {navigationTitle}
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
        className="mobile-menu bg-white dark:bg-slate-900 dark:text-white"
      >
        <div className="relative">
          <button
            aria-label="close"
            type="button"
            className="hover:bg-red-60 absolute top-0 -right-0 flex cursor-pointer appearance-none items-center rounded-full border-0 bg-transparent p-1 hover:bg-red-200 hover:text-red-400 active:text-red-600"
            onClick={doClose}
          >
            <XMarkIcon className="h-5 w-5 select-none" />
            <small className="sr-only">
              {intl.formatMessage({ id: "close", defaultMessage: "Close" })}
            </small>
          </button>
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

        <div className="my-3 border-t border-color-slate-300 pl-3 pt-3">
          {Object.entries(theme.locales)?.map(([lang]) => (
            <button
              key={lang}
              aria-label={intl.formatMessage({
                id: `language_${lang}`,
                defaultMessage: "Language X",
              })}
              type="button"
              className="mb-3 block cursor-pointer appearance-none border-0 bg-transparent p-0 text-left text-inherit"
              onClick={() => changeLanguage(lang)}
            >
              {intl.formatMessage({
                id: `language_${lang}`,
                defaultMessage: "Language X",
              })}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileNavigation;
