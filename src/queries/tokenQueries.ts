import { useQueryClient } from '@tanstack/react-query';
import {useAuthenticatedMutation, useAuthenticatedQuery} from '../hook';
import queryAsync from '../network/apiClient';
import { TokenDropdownType, TokenListType, TokenType } from '../types';

export const useTokens = (page: number, limit: number = 10, search?: string) => {
  return useAuthenticatedQuery(['tokens', `${page}`], (token) => {
    return queryAsync<TokenListType>({
      path: `/tokens`,
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

export const useCreateToken = () => {
  return useAuthenticatedMutation(
    ['create-token'],
    (token: string, params: any) => {
      return queryAsync<TokenType>({
        path: `/tokens`,
        type: 'POST',
        data: { ...params },
        token,
      });
    },
  );
};

export const useDeleteToken = () => {
  return useAuthenticatedMutation(
    ['delete-token'],
    (token: string, params: any) => {
      return queryAsync<void>({
        path: `/tokens/${params.id}`,
        type: 'DELETE',
        token,
      });
    },
  );
};

export const useUpdateToken = (id?: number | string) => {
  return useAuthenticatedMutation(
    ['update-token'],
    (token: string, params: any) => {
      return queryAsync<TokenType>({
        path: `/tokens/${id}`,
        type: 'PUT',
        token,
        data: { ...params },
      });
    },
  );
};

export const useGetToken = (id?: number) => {
  return useAuthenticatedQuery(
    ['get-token'],
    (token: string) => {
      return queryAsync<TokenType>({
        path: `/tokens/${id}`,
        type: 'GET',
        token,
      });
    },
    {
      enabled: !!id,
    },
  );
};

export const useGetTokenDropdown = (keyword?: string) => {
  return useAuthenticatedQuery(['token-dropdown'], (token: string) => {
    return queryAsync<TokenDropdownType[]>({
      path: `/tokens/dropdown`,
      type: 'GET',
      queryParams: {
        ...(keyword && { keyword }),
      },
      token,
    });
  });
};

export const useRefreshTokens = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['tokens'] });
  };
  return refresh;
};