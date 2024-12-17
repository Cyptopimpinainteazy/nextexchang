import { useQueryClient } from '@tanstack/react-query';
import {useAuthenticatedMutation, useAuthenticatedQuery} from '../hook';
import queryAsync from '../network/apiClient';
import { TradeDropdownType, TradeListType, TradeType } from '../types';

export const useTrades = (page: number, limit: number = 10, search?: string) => {
  return useAuthenticatedQuery(['trades', `${page}`], (token) => {
    return queryAsync<TradeListType>({
      path: `/trades`,
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

export const useCreateTrade = () => {
  return useAuthenticatedMutation(
    ['create-trade'],
    (token: string, params: any) => {
      return queryAsync<TradeType>({
        path: `/trades`,
        type: 'POST',
        data: { ...params },
        token,
      });
    },
  );
};

export const useDeleteTrade = () => {
  return useAuthenticatedMutation(
    ['delete-trade'],
    (token: string, params: any) => {
      return queryAsync<void>({
        path: `/trades/${params.id}`,
        type: 'DELETE',
        token,
      });
    },
  );
};

export const useUpdateTrade = (id?: number | string) => {
  return useAuthenticatedMutation(
    ['update-trade'],
    (token: string, params: any) => {
      return queryAsync<TradeType>({
        path: `/trades/${id}`,
        type: 'PUT',
        token,
        data: { ...params },
      });
    },
  );
};

export const useGetTrade = (id?: number) => {
  return useAuthenticatedQuery(
    ['get-trade'],
    (token: string) => {
      return queryAsync<TradeType>({
        path: `/trades/${id}`,
        type: 'GET',
        token,
      });
    },
    {
      enabled: !!id,
    },
  );
};

export const useGetTradeDropdown = (keyword?: string) => {
  return useAuthenticatedQuery(['trade-dropdown'], (token: string) => {
    return queryAsync<TradeDropdownType[]>({
      path: `/trades/dropdown`,
      type: 'GET',
      queryParams: {
        ...(keyword && { keyword }),
      },
      token,
    });
  });
};

export const useRefreshTrades = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['trades'] });
  };
  return refresh;
};