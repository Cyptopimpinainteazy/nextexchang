import { useState } from 'react';
import { SelectCellFormatter } from 'react-data-grid';

import { useTokens } from '../../../../queries';
import { TokenType, TokenListItemType } from '../../../../types';
import { DataGrid, DataGridProps } from '../../../ui';
import { GridAction } from '../../../action';
import { useUpdateEffect } from '../../../../hook';

export interface TokenListViewType {
  search?: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const TokenListView: React.FC<TokenListViewType> = ({
  search,
  onEdit,
  onDelete,
}) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const { data, refetch, isFetching, isError, error } = useTokens(
    page,
    pageSize,
    search,
  );

  const columns: DataGridProps<TokenListItemType>['columns'] = [
    {
      key: 'id',
      name: 'Id',
      width: 80,
    },
    {
      key: 'name',
      name: 'Name',
    },
        {
      key: 'tickerSymbol',
      name: 'Ticker Symbol',
    },
        {
      key: 'decimalPlace',
      name: 'Decimal Place',
    },
        {
      key: 'totalSupply',
      name: 'Total Supply',
    },
        {
      key: 'circulatingSupply',
      name: 'Circulating Supply',
    },
        {
      key: 'price',
      name: 'Price',
    },
        {
      key: 'liquidityPool',
      name: 'Liquidity Pool',
      renderCell: ({ row }) => {
        return(
          <div>{row.liquidityPool.name}</div>
        )
      },
    },
        {
      key: 'actions',
      name: 'Actions',
      width: 80,
      renderCell: ({ row }) => {
        return (
          <GridAction
            onEdit={() => onEdit(row.id)}
            onDelete={() => onDelete(row.id)}
          />
        );
      },
    },
  ];

  useUpdateEffect(() => {
    refetch();
  }, [page, pageSize]);

  useUpdateEffect(() => {
    setPage(0);
    if (page === 0) {
      refetch();
    }
  }, [search]);

  return (
    <DataGrid
      columns={columns}
      data={data}
      pageState={{
        page,
        setPage,
      }}
      pageSizeState={{
        pageSize,
        setPageSize,
      }}
      isLoading={isFetching}
      isError={isError}
      error={error}
      onReload={refetch}
    />
  );
};

export default TokenListView;
