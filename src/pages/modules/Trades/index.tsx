import { useState } from 'react';
import debounce from 'debounce';
import { enqueueSnackbar } from 'notistack';

import { TradeFormModal, TradeListView } from '../../../components/module';
import { useDeleteTrade, useRefreshTrades, } from '../../../queries';
import { PageContainer } from '../../../components/ui';
import { DeleteDialog } from '../../../components/action';

const Trades = () => {
  const [openNewFormModal, setOpenNewFormModal] = useState(false);
  const [deleteTradeId, setDeleteTradeId] = useState<
    number | undefined
  >();
  const [editTradeId, setEditTradeId] = useState<number | undefined>();

  const [searchText, setSearchText] = useState<string | undefined>();

  const deleteTradeMutation = useDeleteTrade();
  const refreshTrades = useRefreshTrades();

  const handleOpenNewFormModal = () => {
    setOpenNewFormModal(true);
  };

  const handleCloseFormModal = () => {
    setOpenNewFormModal(false);
    setEditTradeId(undefined);
  };

  const onEdit = (id: number) => {
    setEditTradeId(id);
  };

  const onDelete = (id: number) => {
    setDeleteTradeId(id);
  };

  const debounceSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);

  const handleSearch = (text: string) => {
    debounceSearch(text);
  };

  const handleDelete = () => {
    deleteTradeMutation.mutate(
      { id: deleteTradeId },
      {
        onSuccess: () => {
          enqueueSnackbar('Trade deleted successfully', { variant: 'success' });
          refreshTrades();
        },
        onError: (error) => {
          enqueueSnackbar(
            error.errorMessage || 'Something went wrong while delete',
            {
              variant: 'error',
            },
          );
        },
      },
    );
    setDeleteTradeId(undefined);
  };

  const handleDeleteCancel = () => {
    setDeleteTradeId(undefined);
  };

  return (
    <PageContainer
      title="Trades"
      newButtonText="Add New Trades"
      onNewButtonClick={handleOpenNewFormModal}
      onSearch={handleSearch}
    >
      <TradeListView onEdit={onEdit} onDelete={onDelete} search={searchText} />
      {(openNewFormModal || !!editTradeId) && (
        <TradeFormModal
          open={openNewFormModal || !!editTradeId}
          onClose={handleCloseFormModal}
          id={editTradeId}
        />
      )}
      {deleteTradeId && (
        <DeleteDialog
          open={!!deleteTradeId}
          onDelete={handleDelete}
          onCancel={handleDeleteCancel}
        />
      )}
    </PageContainer>
  );
};

export default Trades;
