import { useQueryClient } from '@tanstack/react-query';
import {useAuthenticatedMutation, useAuthenticatedQuery} from '../hook';
import queryAsync from '../network/apiClient';
import { LiquidityPoolDropdownType, LiquidityPoolListType, LiquidityPoolType } from '../types';

export const useLiquidityPools = (page: number, limit: number = 10, search?: string) => {
  return useAuthenticatedQuery(['liquidityPools', `${page}`], (token) => {
    return queryAsync<LiquidityPoolListType>({
      path: `/liquidityPools`,
      type: 'GET',
      queryParams: {
        page: page + 1,
        limit,
        ...(search && {
          search,
        }),
      },
      token,
    });
  });
};

export const useCreateLiquidityPool = () => {
  return useAuthenticatedMutation(
    ['create-liquidityPool'],
    (token: string, params: any) => {
      return queryAsync<LiquidityPoolType>({
        path: `/liquidityPools`,
        type: 'POST',
        data: { ...params },
        token,
      });
    },
  );
};

export const useDeleteLiquidityPool = () => {
  return useAuthenticatedMutation(
    ['delete-liquidityPool'],
    (token: string, params: any) => {
      return queryAsync<void>({
        path: `/liquidityPools/${params.id}`,
        type: 'DELETE',
        token,
      });
    },
  );
};

export const useUpdateLiquidityPool = (id?: number | string) => {
  return useAuthenticatedMutation(
    ['update-liquidityPool'],
    (token: string, params: any) => {
      return queryAsync<LiquidityPoolType>({
        path: `/liquidityPools/${id}`,
        type: 'PUT',
        token,
        data: { ...params },
      });
    },
  );
};

export const useGetLiquidityPool = (id?: number) => {
  return useAuthenticatedQuery(
    ['get-liquidityPool'],
    (token: string) => {
      return queryAsync<LiquidityPoolType>({
        path: `/liquidityPools/${id}`,
        type: 'GET',
        token,
      });
    },
    {
      enabled: !!id,
    },
  );
};

export const useGetLiquidityPoolDropdown = (keyword?: string) => {
  return useAuthenticatedQuery(['liquidityPool-dropdown'], (token: string) => {
    return queryAsync<LiquidityPoolDropdownType[]>({
      path: `/liquidityPools/dropdown`,
      type: 'GET',
      queryParams: {
        ...(keyword && { keyword }),
      },
      token,
    });
  });
};

export const useRefreshLiquidityPools = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['liquidityPools'] });
  };
  return refresh;
};