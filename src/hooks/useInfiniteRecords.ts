import { useInfiniteQuery } from '@tanstack/react-query';

export function useInfiniteRecords() {
  return useInfiniteQuery({
    queryKey: ['records'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`/api/records?cursor=${pageParam}`);
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
} 