import { useState } from 'react';
import { SelectCellFormatter } from 'react-data-grid';

import { useTrades } from '../../../../queries';
import { TradeType, TradeListItemType } from '../../../../types';
import { DataGrid, DataGridProps } from '../../../ui';
import { GridAction } from '../../../action';
import { useUpdateEffect } from '../../../../hook';

export interface TradeListViewType {
  search?: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const TradeListView: React.FC<TradeListViewType> = ({
  search,
  onEdit,
  onDelete,
}) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const { data, refetch, isFetching, isError, error } = useTrades(
    page,
    pageSize,
    search,
  );

  const columns: DataGridProps<TradeListItemType>['columns'] = [
    {
      key: 'id',
      name: 'Id',
      width: 80,
    },
    {
      key: 'timestamp',
      name: 'Timestamp',
    },
        {
      key: 'token1',
      name: 'Token1',
      renderCell: ({ row }) => {
        return(
          <div>{row.token1.tickerSymbol}</div>
        )
      },
    },
        {
      key: 'token2',
      name: 'Token2',
      renderCell: ({ row }) => {
        return(
          <div>{row.token2.tickerSymbol}</div>
        )
      },
    },
        {
      key: 'amount1',
      name: 'Amount1',
    },
        {
      key: 'amount2',
      name: 'Amount2',
    },
        {
      key: 'fee',
      name: 'Fee',
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

export default TradeListView;
