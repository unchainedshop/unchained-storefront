import React from "react";

import MegaDropdownColumn from "./MegaDropdownColumn";
import { useDesktopNavigationContext } from "./DesktopNavigationContext";

const findChildBySlug = (node, slug) => {
  return (
    node.children &&
    Object.entries(node.children).find(
      ([, childNode]: any) => childNode.slug === slug,
    )
  );
};

const getColumn = (node, hoverPath, columnIndex) => {
  if (hoverPath?.length <= columnIndex || !node) {
    return [null, null];
  }
  if (hoverPath?.includes(node.slug)) {
    return findChildBySlug(node, hoverPath[columnIndex]) || [null, null];
  }
  return [null, null];
};

const MegaDropdown = ({ dataInHoverPath, ...rest }) => {
  const { setHoverPath, isTouching, hoverPath } = useDesktopNavigationContext();

  const [, secondColumnNode] = getColumn(rest, hoverPath, 1);

  const [, thirdColumnNode] = getColumn(
    secondColumnNode,
    hoverPath,

    2,
  );

  return (
    <div
      className="absolute top-full left-0 z-50 mt-2 w-full rounded-xl bg-white shadow-xl border border-gray-200 dark:bg-slate-800 dark:border-slate-700"
      onMouseEnter={() => {
        if (!isTouching) setHoverPath(rest?.path);
      }}
      onMouseLeave={() => {
        if (!isTouching) setHoverPath([]);
      }}
      onBlur={() => {
        if (!isTouching) setHoverPath([]);
      }}
    >
      <div className="grid grid-cols-3 gap-8 p-8">
        <MegaDropdownColumn
          columnIndex={0}
          {...rest}
          key="mega-dropdown-column-1"
        />
        {secondColumnNode?.children ? (
          <MegaDropdownColumn
            {...secondColumnNode}
            key="mega-dropdown-column-2"
          />
        ) : (
          <div className="hidden" />
        )}
        {thirdColumnNode?.children ? (
          <MegaDropdownColumn {...thirdColumnNode} key="mega-dropdown-column-3" />
        ) : (
          <div className="hidden" />
        )}
      </div>
    </div>
  );
};

export default MegaDropdown;
