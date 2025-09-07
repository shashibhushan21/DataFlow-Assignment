import { useInfiniteQuery } from '@tanstack/react-query';

interface LeadsParams {
  search?: string;
  status?: string;
  limit?: number;
}

export function useLeads(params: LeadsParams = {}) {
  return useInfiniteQuery({
    queryKey: ['leads', params],
    queryFn: async ({ pageParam = 1 }) => {
      const searchParams = new URLSearchParams({
        page: pageParam.toString(),
        limit: (params.limit || 10).toString(),
        ...(params.search && { search: params.search }),
        ...(params.status && { status: params.status }),
      });

      const response = await fetch(`/api/leads?${searchParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      return response.json();
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.pagination?.hasMore 
        ? lastPage.pagination.page + 1 
        : undefined;
    },
    initialPageParam: 1,
  });
}