import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

interface RecordsParams {
  search?: string;
  industry?: string;
  country?: string;
  pageSize?: number;
}

export function useRecords(params: RecordsParams) {
  const debouncedSearch = useDebouncedCallback(
    (search: string) => params.search = search,
    500
  );

  return useInfiniteQuery({
    queryKey: ['records', params],
    queryFn: async ({ pageParam = 0 }) => {
      const searchParams = new URLSearchParams({
        cursor: pageParam,
        pageSize: params.pageSize?.toString() || '20',
        ...(params.search && { search: params.search }),
        ...(params.industry && { industry: params.industry }),
        ...(params.country && { country: params.country }),
      });

      const response = await fetch(`/api/records?${searchParams}`);
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor,
  });
} 