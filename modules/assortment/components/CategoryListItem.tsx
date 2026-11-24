import Image from 'next/legacy/image';
import Link from 'next/link';
import defaultNextImageLoader from '../../common/utils/defaultNextImageLoader';

import getMediaUrl from '../../common/utils/getMediaUrl';

const CategoryListItem = ({ category }) => {
  const mediaUrl = getMediaUrl(category);

  return (
    <Link href={`shop/${category?.texts?.slug}`} className="group block">
      <div className="bg-surface transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-[5/3.2] overflow-hidden bg-muted rounded-md mb-4">
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
            <div className="flex items-center justify-center h-full bg-muted rounded-md">
              <svg
                className="h-18 w-18 text-subtle-foreground"
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
          <h3 className="text-lg font-semibold text-foreground leading-tight transition-colors duration-200 group-hover:text-muted-foreground">
            {category.texts?.title}
          </h3>
          {category.texts?.subtitle && (
            <p className="text-sm text-muted-foreground">
              {category.texts.subtitle}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CategoryListItem;
