import { useEffect, useState } from 'react';
import {
  Autocomplete,
  AutocompleteInputChangeReason,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  ListItem,
  Stack,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { debounce } from 'debounce';
import dayjs from 'dayjs';

import {
  CreateOrUpdateTokenType,
  TokenType,
  TokenFormModalType,
  LiquidityPoolDropdownType,
  LiquidityPoolType,
} from '../../../../types';

import {
  useCreateToken,
  useUpdateToken,
  useGetToken,
  useRefreshTokens,
  useGetLiquidityPoolDropdown,
} from '../../../../queries';

import {
  DatePicker,
  DateTimePicker,
  ModalWithTitle,
  TimePicker,
} from '../../../ui';

import { LiquidityPoolFormModal } from '../..';
import { useUpdateEffect } from '../../../../hook';

export interface TokenFormModalProps {
  open: boolean;
  onClose: (token?: TokenType) => void;
  id?: number;
}

const TokenSchema = yup
  .object<TokenFormModalType>()
  .shape({
    name: yup.string().required('Name is required'),
            tickerSymbol: yup.string(),
            decimalPlace: yup.number().required('Decimal Place is required'),
        totalSupply: yup.number().required('Total Supply is required'),
        circulatingSupply: yup.number().required('Circulating Supply is required'),
        price: yup.number(),
        liquidityPool: yup
      .object()
      .shape({
        id: yup
        .number()
        .test(
          'not-equal-to-negative-one',
          'Please select a Liquidity Pool',
          (value) => value !== -1,
        )
        .required('Liquidity Pool is required'),
        name: yup.string().required(),
      })
      .required(),
      })
  .required();

const TokenFormModal: React.FC<TokenFormModalProps> = ({
  open,
  onClose,
  id,
}) => {

  const isEdit = !!id;

  const { enqueueSnackbar } = useSnackbar();

  const createTokenMutation = useCreateToken();
  const updateTokenMutation = useUpdateToken(id);
  const refreshTokens = useRefreshTokens();

  const [liquidityPoolSearchText, setLiquidityPoolSearchText] = useState('');
  const [liquidityPoolFormModal, setLiquidityPoolModal] = useState(false);


  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm<TokenFormModalType>({
    resolver: yupResolver(TokenSchema),
  });

  const { data: tokenData, isFetching: isTokenDataFetching, remove } = useGetToken(id);

    const {
      data: liquidityPoolList,
      refetch: liquidityPoolRefetch,
      isFetching: isLiquidityPoolFetching,
    } = useGetLiquidityPoolDropdown(liquidityPoolSearchText);


  useEffect(() => {
    if (tokenData) {
      setValue('name', tokenData.name);
            setValue('tickerSymbol', tokenData.tickerSymbol);
            setValue('decimalPlace', tokenData.decimalPlace);
            setValue('totalSupply', tokenData.totalSupply);
            setValue('circulatingSupply', tokenData.circulatingSupply);
            setValue('price', tokenData.price);
            setValue('liquidityPool', {
        id: tokenData.liquidityPool.id,
        name: tokenData.liquidityPool.name
      });
          }
  }, [tokenData]);

  const handleCreateOrUpdateToken = (data: TokenFormModalType) => {

    const formData: CreateOrUpdateTokenType = {
      name: data.name,
            tickerSymbol: data.tickerSymbol,
            decimalPlace: data.decimalPlace,
            totalSupply: data.totalSupply,
            circulatingSupply: data.circulatingSupply,
            price: data.price,
            liquidityPoolId: data.liquidityPool.id,
          }

    if (isEdit) {
      updateTokenMutation.mutate(formData, {
        onSuccess: (updatedData) => {
          enqueueSnackbar('Token updated successfully', {
            variant: 'success',
          });
          refreshTokens();
          remove();
          onClose(updatedData);
        },
        onError: (error) => {
          enqueueSnackbar(error.message || 'Something went wrong', {
            variant: 'error',
          });
          onClose();
        },
      });
    } else {
      createTokenMutation.mutate(formData, {
        onSuccess: (newData) => {
          enqueueSnackbar('Token created successfully', {
            variant: 'success',
          });
          refreshTokens();
          onClose(newData);
        },
        onError: (error) => {
          enqueueSnackbar(error.message || 'Something went wrong', {
            variant: 'error',
          });
          onClose();
        },
      });
    }
  };

  const handleCancel = () => {
    if(isEdit) {
      remove()
    }
    onClose();
  };

  // Liquidity Pool MODAL
  const debounceLiquidityPoolSearchText = debounce((value: string) => {
    setLiquidityPoolSearchText(value);
  }, 300);

  const handleLiquidityPoolSearchText = (
    _: any,
    text: string,
    reason: AutocompleteInputChangeReason,
  ) => {
    if (reason === 'input') {
      debounceLiquidityPoolSearchText(text);
    }
  };

  useUpdateEffect(() => {
    liquidityPoolRefetch();
  }, [liquidityPoolSearchText]);

  const handleLiquidityPoolModalOpen = () => {
    setLiquidityPoolModal(true);
  };

  const handleLiquidityPoolModalClose = (liquidityPool?: LiquidityPoolType) => {
    if (liquidityPool) {
      setValue('liquidityPool', {
        id: liquidityPool.id,
        name: liquidityPool.name
      });
    }

    setLiquidityPoolModal(false);
  };

  const handleLiquidityPoolChange = (
    _: any,
    newValue: string | LiquidityPoolDropdownType | null,
  ) => {
    if (!newValue) {
      // Handle the case where no option is selected
      setValue('liquidityPool', {
        id: -1,
        name: ''
      });
    } else if (typeof newValue === 'object') {
      // Check if the selected option exists in the liquidityPoolList
      setValue('liquidityPool', newValue);
    }
    trigger('liquidityPool');
  };


  return (
    <>
      <ModalWithTitle
        open={open}
        title="New Token"
        subTitle="Create new Token"
        renderAction={() => (
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </Stack>
        )}
        form={{
          onSubmit: handleSubmit(handleCreateOrUpdateToken),
        }}
        loading={isTokenDataFetching}
      >
      <Grid container spacing={2}>
        <Grid xs={12} md={12} item>
          <Controller
            control={control}
            name="name"
            defaultValue={''}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                error={!!errors.name?.message}
                helperText={errors.name?.message}
                size="small"
                autoFocus
                fullWidth
              />
            )}
          />
        </Grid>
                <Grid xs={12} md={12} item>
          <Controller
            control={control}
            name="tickerSymbol"
            defaultValue={''}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ticker Symbol"
                error={!!errors.tickerSymbol?.message}
                helperText={errors.tickerSymbol?.message}
                size="small"
                autoFocus
                fullWidth
              />
            )}
          />
        </Grid>
                <Grid xs={12} md={12} item>
          <Controller
            name="decimalPlace"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Decimal Places"
                error={!!errors.decimalPlace?.message}
                helperText={errors.decimalPlace?.message}
                size="small"
                fullWidth
              />
            )}
          />
        </Grid>
                <Grid xs={12} md={12} item>
          <Controller
            name="totalSupply"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Total Supply"
                error={!!errors.totalSupply?.message}
                helperText={errors.totalSupply?.message}
                size="small"
                fullWidth
              />
            )}
          />
        </Grid>
                        <Grid xs={12} md={12} item>
          <Controller
            name="circulatingSupply"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Circulating Supply"
                error={!!errors.circulatingSupply?.message}
                helperText={errors.circulatingSupply?.message}
                size="small"
                fullWidth
              />
            )}
          />
        </Grid>
                        <Grid xs={12} md={12} item>
          <Controller
            name="price"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Price"
                error={!!errors.price?.message}
                helperText={errors.price?.message}
                size="small"
                fullWidth
              />
            )}
          />
        </Grid>
                        <Grid xs={12} md={12} item>
          <Stack direction={'row'} alignItems={'flex-start'} spacing={2}>
            <Autocomplete
              value={
                getValues('liquidityPool') || null
              }
              options={liquidityPoolList || []}
              getOptionLabel={(option) =>
                typeof option === 'object' ? option.name : option
              }
              onChange={handleLiquidityPoolChange}
              onInputChange={handleLiquidityPoolSearchText}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Liquidity Pool"
                  size="small"
                  error={!!errors.liquidityPool?.id?.message}
                  helperText={errors.liquidityPool?.id?.message}
                />
              )}
              renderOption={(props, option) => (
                <ListItem {...props} key={option.id}>
                  {option.name}
                </ListItem>
              )}
              loading={isLiquidityPoolFetching}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              freeSolo
              forcePopupIcon
              fullWidth
            />
            <IconButton onClick={handleLiquidityPoolModalOpen}>
              <AddIcon />
            </IconButton>
          </Stack>
        </Grid>
              </Grid>
      </ModalWithTitle>
      {liquidityPoolFormModal && (
        <LiquidityPoolFormModal open={liquidityPoolFormModal} onClose={handleLiquidityPoolModalClose} />
      )}
    </>
  )
}

export default TokenFormModal;