import { useState } from 'react';
import debounce from 'debounce';
import { enqueueSnackbar } from 'notistack';

import { TokenFormModal, TokenListView } from '../../../components/module';
import { useDeleteToken, useRefreshTokens, } from '../../../queries';
import { PageContainer } from '../../../components/ui';
import { DeleteDialog } from '../../../components/action';

const Tokens = () => {
  const [openNewFormModal, setOpenNewFormModal] = useState(false);
  const [deleteTokenId, setDeleteTokenId] = useState<
    number | undefined
  >();
  const [editTokenId, setEditTokenId] = useState<number | undefined>();

  const [searchText, setSearchText] = useState<string | undefined>();

  const deleteTokenMutation = useDeleteToken();
  const refreshTokens = useRefreshTokens();

  const handleOpenNewFormModal = () => {
    setOpenNewFormModal(true);
  };

  const handleCloseFormModal = () => {
    setOpenNewFormModal(false);
    setEditTokenId(undefined);
  };

  const onEdit = (id: number) => {
    setEditTokenId(id);
  };

  const onDelete = (id: number) => {
    setDeleteTokenId(id);
  };

  const debounceSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);

  const handleSearch = (text: string) => {
    debounceSearch(text);
  };

  const handleDelete = () => {
    deleteTokenMutation.mutate(
      { id: deleteTokenId },
      {
        onSuccess: () => {
          enqueueSnackbar('Token deleted successfully', { variant: 'success' });
          refreshTokens();
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
    setDeleteTokenId(undefined);
  };

  const handleDeleteCancel = () => {
    setDeleteTokenId(undefined);
  };

  return (
    <PageContainer
      title="Tokens"
      newButtonText="Add New Tokens"
      onNewButtonClick={handleOpenNewFormModal}
      onSearch={handleSearch}
    >
      <TokenListView onEdit={onEdit} onDelete={onDelete} search={searchText} />
      {(openNewFormModal || !!editTokenId) && (
        <TokenFormModal
          open={openNewFormModal || !!editTokenId}
          onClose={handleCloseFormModal}
          id={editTokenId}
        />
      )}
      {deleteTokenId && (
        <DeleteDialog
          open={!!deleteTokenId}
          onDelete={handleDelete}
          onCancel={handleDeleteCancel}
        />
      )}
    </PageContainer>
  );
};

export default Tokens;
