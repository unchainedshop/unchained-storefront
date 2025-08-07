import Image from 'next/legacy/image';
import Link from 'next/link';
import defaultNextImageLoader from '../../common/utils/defaultNextImageLoader';

import getMediaUrl from '../../common/utils/getMediaUrl';

const CategoryListItem = ({ category }) => {
  const mediaUrl = getMediaUrl(category);

  return (
    <Link href={`shop/${category?.texts?.slug}`} className="group block">
      <div className="bg-white dark:bg-slate-950 transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-[5/3.2] overflow-hidden bg-slate-50 dark:bg-slate-900 rounded-md mb-4">
          {mediaUrl ? (
            <Image
              src={mediaUrl}
              alt={category?.texts.title}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              className="transition-all duration-300 rounded-md group-hover:opacity-75"
              loader={defaultNextImageLoader}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-100 dark:bg-slate-700 rounded-md">
              <svg
                className="h-18 w-18 text-slate-400 dark:text-slate-500"
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
          )}
        </div>

        {/* Content Below Image */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight transition-colors duration-200 group-hover:text-slate-700 dark:group-hover:text-slate-200">
            {category.texts?.title}
          </h3>
          {category.texts?.subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {category.texts.subtitle}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CategoryListItem;
