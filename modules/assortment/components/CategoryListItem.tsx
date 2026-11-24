import Image from 'next/legacy/image';
import Link from 'next/link';
import { ArrowRightIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import defaultNextImageLoader from '../../common/utils/defaultNextImageLoader';
import getMediaUrl from '../../common/utils/getMediaUrl';

const CategoryListItem = ({ category }) => {
  const mediaUrl = getMediaUrl(category);

  return (
    <Link
      href={`/shop/${category?.texts?.slug}`}
      className="group relative block aspect-[4/3] overflow-hidden rounded-xl bg-muted"
    >
      {mediaUrl ? (
        <Image
          src={mediaUrl}
          alt=""
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
          loader={defaultNextImageLoader}
        />
      ) : (
        <span className="flex size-full items-center justify-center">
          <Squares2X2Icon className="size-12 text-subtle-foreground" />
        </span>
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white">
        <span>
          <span className="block text-lg font-semibold leading-tight">
            {category?.texts?.title}
          </span>
          {category?.texts?.subtitle && (
            <span className="mt-0.5 block text-sm text-white/80">
              {category.texts.subtitle}
            </span>
          )}
        </span>
        <ArrowRightIcon className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
};

export default CategoryListItem;
