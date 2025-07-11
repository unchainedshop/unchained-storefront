import React from "react";
import Link from "next/link";
import { useIntl } from "react-intl";
import classNames from "classnames";
import { useDesktopNavigationContext } from "./DesktopNavigationContext";
import Thumbnail from "../../common/components/thumbnail";

export type Node = {
  slug: string;
  children: any[];
  path: string[];
  navigationTitle: string;
  type: "default" | "show_all";
  media: any[];
};

const MegaDropdownItem = ({
  slug,
  children,
  navigationTitle,
  type,
  path,
  media = [],
}: Partial<Node>) => {
  const intl = useIntl();
  const { setHoverPath, hoverPath, isTouching } = useDesktopNavigationContext();
  const handleClick = () => {
    if (type === "default" && isTouching && children) {
      setHoverPath(path);
    } else {
      setHoverPath([]);
    }
  };

  const handleMouseEnter = () => {
    setHoverPath(path);
  };

  const handleTouchStart = () => {
    setHoverPath(path);
  };
  return (
    <Link
      href={`/${path.join("/")}`}
      className={classNames(
        "group flex items-center rounded-lg p-3 transition-colors duration-200",
        {
          "bg-slate-50 dark:bg-slate-700": type === "show_all",
          "hover:bg-slate-50 dark:hover:bg-slate-700": type === "default",
          "font-semibold text-slate-900 dark:text-white": type === "show_all",
          "text-slate-700 dark:text-slate-300": type === "default",
        },
      )}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      data-in-hover-path={type === "default" && hoverPath?.includes(slug)}
    >
      <div className="flex items-center gap-3 w-full">
        {type === "default" && media?.length > 0 && (
          <div className="flex-shrink-0">
            <Thumbnail media={media} className="w-8 h-8 rounded" />
          </div>
        )}
        <div className="flex-1">
          <div
            className={classNames("text-sm", {
              "font-semibold": type === "show_all",
              "font-medium": type === "default",
            })}
          >
            {navigationTitle}
          </div>
          {type === "show_all" && (
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {intl.formatMessage({
                id: "show_all",
                defaultMessage: "Show all",
              })}
            </div>
          )}
        </div>
        {type === "default" && Object.keys(children || {}).length > 0 && (
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </div>
    </Link>
  );
};

const MegaDropdownColumn = ({
  ...rest
}: Partial<Node> & { columnIndex?: number }) => {
  return (
    <div className="space-y-2">
      <MegaDropdownItem {...rest} type="show_all" />

      <div className="space-y-1">
        {rest.children &&
          Object.entries(rest.children)
            .sort(([, aNode], [, bNode]) => {
              return aNode.index - bNode.index;
            })
            .map(([, subnode]) => (
              <MegaDropdownItem key={subnode._id} {...subnode} type="default" />
            ))}
      </div>
    </div>
  );
};

MegaDropdownColumn.defaultProps = {
  columnIndex: null,
};

export default MegaDropdownColumn;
