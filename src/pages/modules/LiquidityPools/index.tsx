import { useState } from 'react';
import debounce from 'debounce';
import { enqueueSnackbar } from 'notistack';

import { LiquidityPoolFormModal, LiquidityPoolListView } from '../../../components/module';
import { useDeleteLiquidityPool, useRefreshLiquidityPools, } from '../../../queries';
import { PageContainer } from '../../../components/ui';
import { DeleteDialog } from '../../../components/action';

const LiquidityPools = () => {
  const [openNewFormModal, setOpenNewFormModal] = useState(false);
  const [deleteLiquidityPoolId, setDeleteLiquidityPoolId] = useState<
    number | undefined
  >();
  const [editLiquidityPoolId, setEditLiquidityPoolId] = useState<number | undefined>();

  const [searchText, setSearchText] = useState<string | undefined>();

  const deleteLiquidityPoolMutation = useDeleteLiquidityPool();
  const refreshLiquidityPools = useRefreshLiquidityPools();

  const handleOpenNewFormModal = () => {
    setOpenNewFormModal(true);
  };

  const handleCloseFormModal = () => {
    setOpenNewFormModal(false);
    setEditLiquidityPoolId(undefined);
  };

  const onEdit = (id: number) => {
    setEditLiquidityPoolId(id);
  };

  const onDelete = (id: number) => {
    setDeleteLiquidityPoolId(id);
  };

  const debounceSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);

  const handleSearch = (text: string) => {
    debounceSearch(text);
  };

  const handleDelete = () => {
    deleteLiquidityPoolMutation.mutate(
      { id: deleteLiquidityPoolId },
      {
        onSuccess: () => {
          enqueueSnackbar('LiquidityPool deleted successfully', { variant: 'success' });
          refreshLiquidityPools();
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
    setDeleteLiquidityPoolId(undefined);
  };

  const handleDeleteCancel = () => {
    setDeleteLiquidityPoolId(undefined);
  };

  return (
    <PageContainer
      title="Liquidity Pools"
      newButtonText="Add New Liquidity Pools"
      onNewButtonClick={handleOpenNewFormModal}
      onSearch={handleSearch}
    >
      <LiquidityPoolListView onEdit={onEdit} onDelete={onDelete} search={searchText} />
      {(openNewFormModal || !!editLiquidityPoolId) && (
        <LiquidityPoolFormModal
          open={openNewFormModal || !!editLiquidityPoolId}
          onClose={handleCloseFormModal}
          id={editLiquidityPoolId}
        />
      )}
      {deleteLiquidityPoolId && (
        <DeleteDialog
          open={!!deleteLiquidityPoolId}
          onDelete={handleDelete}
          onCancel={handleDeleteCancel}
        />
      )}
    </PageContainer>
  );
};

export default LiquidityPools;
