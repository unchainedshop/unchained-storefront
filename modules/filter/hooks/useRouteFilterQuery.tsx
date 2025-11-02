import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export interface FilterQueryInput {
  key: string;
  value?: string;
}

export default function useRouteFilterQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterQuery: FilterQueryInput[] = useMemo(() => {
    const arr: FilterQueryInput[] = [];
    searchParams.forEach((value, key) => {
      if (key !== 'query') {
        const values = value.split(',');
        values.forEach((v) => arr.push({ key, value: v }));
      }
    });
    return arr;
  }, [searchParams]);

  const setFilterValues = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      if (values.length) {
        params.set(key, values.join(','));
      } else {
        params.delete(key);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return { filterQuery, setFilterValues, resetFilters };
}
