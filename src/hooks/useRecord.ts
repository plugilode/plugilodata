import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useRecord(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['record', id],
    queryFn: async () => {
      const response = await fetch(`/api/records/${id}`);
      return response.json();
    },
    // Pre-fetch related records
    onSuccess: (data) => {
      // Pre-fetch related records based on industry, etc.
      queryClient.prefetchQuery({
        queryKey: ['records', { industry: data.companyInformation.industryGroup }],
        queryFn: () => fetch(`/api/records?industry=${data.companyInformation.industryGroup}`).then(r => r.json())
      });
    }
  });
} 