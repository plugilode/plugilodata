import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';

export function useRecordSearch(searchTerm: string) {
  return useQuery({
    queryKey: ['records', searchTerm],
    queryFn: async () => {
      const response = await fetch(`/api/records/search?q=${searchTerm}`);
      return response.json();
    },
    enabled: searchTerm.length > 2, // Only search when term is meaningful
  });
} 