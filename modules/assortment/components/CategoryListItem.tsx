import Image from "next/legacy/image";
import Link from "next/link";
import defaultNextImageLoader from "../../common/utils/defaultNextImageLoader";

import getMediaUrl from "../../common/utils/getMediaUrl";

const CategoryListItem = ({ category }) => {
  const mediaUrl = getMediaUrl(category);
  
  return (
    <Link href={`shop/${category.texts.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-slate-800">
        {mediaUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-slate-800">
            <Image
              src={mediaUrl}
              alt={category?.texts.title}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              className="transition-transform duration-300 group-hover:scale-105"
              loader={defaultNextImageLoader}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-lg font-semibold text-white">
                {category.texts?.title}
              </h3>
              {category.texts?.subtitle && (
                <p className="mt-1 text-sm text-gray-200">
                  {category.texts.subtitle}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex aspect-[4/3] flex-col items-center justify-center bg-gray-50 p-6 dark:bg-slate-800">
            <div className="mb-4 rounded-full bg-gray-200 p-3 dark:bg-slate-700">
              <svg
                className="h-8 w-8 text-gray-400 dark:text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white">
              {category.texts?.title}
            </h3>
            {category.texts?.subtitle && (
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                {category.texts.subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default CategoryListItem;
