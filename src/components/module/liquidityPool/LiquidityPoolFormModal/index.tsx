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
  CreateOrUpdateLiquidityPoolType,
  LiquidityPoolType,
  LiquidityPoolFormModalType,
  TokenDropdownType,
  TokenType,
} from '../../../../types';

import {
  useCreateLiquidityPool,
  useUpdateLiquidityPool,
  useGetLiquidityPool,
  useRefreshLiquidityPools,
  useGetTokenDropdown,
} from '../../../../queries';

import {
  DatePicker,
  DateTimePicker,
  ModalWithTitle,
  TimePicker,
} from '../../../ui';

import { TokenFormModal } from '../..';
import { useUpdateEffect } from '../../../../hook';

export interface LiquidityPoolFormModalProps {
  open: boolean;
  onClose: (liquidityPool?: LiquidityPoolType) => void;
  id?: number;
}

const LiquidityPoolSchema = yup
  .object<LiquidityPoolFormModalType>()
  .shape({
    token1: yup
      .object()
      .shape({
        id: yup
        .number()
        .test(
          'not-equal-to-negative-one',
          'Please select a Token1',
          (value) => value !== -1,
        )
        .required('Token1 is required'),
        tickerSymbol: yup.string().required(),
      })
      .required(),
        token2: yup
      .object()
      .shape({
        id: yup
        .number()
        .test(
          'not-equal-to-negative-one',
          'Please select a Token2',
          (value) => value !== -1,
        )
        .required('Token2 is required'),
        tickerSymbol: yup.string().required(),
      })
      .required(),
        reserve1: yup.number().required('Reserve1 is required'),
        reserve2: yup.number().required('Reserve2 is required'),
        feeRate: yup.number(),
      })
  .required();

const LiquidityPoolFormModal: React.FC<LiquidityPoolFormModalProps> = ({
  open,
  onClose,
  id,
}) => {

  const isEdit = !!id;

  const { enqueueSnackbar } = useSnackbar();

  const createLiquidityPoolMutation = useCreateLiquidityPool();
  const updateLiquidityPoolMutation = useUpdateLiquidityPool(id);
  const refreshLiquidityPools = useRefreshLiquidityPools();

  const [token1SearchText, setToken1SearchText] = useState('');
  const [token1FormModal, setToken1Modal] = useState(false);

  const [token2SearchText, setToken2SearchText] = useState('');
  const [token2FormModal, setToken2Modal] = useState(false);


  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm<LiquidityPoolFormModalType>({
    resolver: yupResolver(LiquidityPoolSchema),
  });

  const { data: liquidityPoolData, isFetching: isLiquidityPoolDataFetching, remove } = useGetLiquidityPool(id);

    const {
      data: token1List,
      refetch: token1Refetch,
      isFetching: isToken1Fetching,
    } = useGetTokenDropdown(token1SearchText);

    const {
      data: token2List,
      refetch: token2Refetch,
      isFetching: isToken2Fetching,
    } = useGetTokenDropdown(token2SearchText);


  useEffect(() => {
    if (liquidityPoolData) {
      setValue('token1', {
        id: liquidityPoolData.token1.id,
        tickerSymbol: liquidityPoolData.token1.tickerSymbol
      });
            setValue('token2', {
        id: liquidityPoolData.token2.id,
        tickerSymbol: liquidityPoolData.token2.tickerSymbol
      });
            setValue('reserve1', liquidityPoolData.reserve1);
            setValue('reserve2', liquidityPoolData.reserve2);
            setValue('feeRate', liquidityPoolData.feeRate);
          }
  }, [liquidityPoolData]);

  const handleCreateOrUpdateLiquidityPool = (data: LiquidityPoolFormModalType) => {

    const formData: CreateOrUpdateLiquidityPoolType = {
      token1Id: data.token1.id,
            token2Id: data.token2.id,
            reserve1: data.reserve1,
            reserve2: data.reserve2,
            feeRate: data.feeRate,
          }

    if (isEdit) {
      updateLiquidityPoolMutation.mutate(formData, {
        onSuccess: (updatedData) => {
          enqueueSnackbar('LiquidityPool updated successfully', {
            variant: 'success',
          });
          refreshLiquidityPools();
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
      createLiquidityPoolMutation.mutate(formData, {
        onSuccess: (newData) => {
          enqueueSnackbar('LiquidityPool created successfully', {
            variant: 'success',
          });
          refreshLiquidityPools();
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

  // Token1 MODAL
  const debounceToken1SearchText = debounce((value: string) => {
    setToken1SearchText(value);
  }, 300);

  const handleToken1SearchText = (
    _: any,
    text: string,
    reason: AutocompleteInputChangeReason,
  ) => {
    if (reason === 'input') {
      debounceToken1SearchText(text);
    }
  };

  useUpdateEffect(() => {
    token1Refetch();
  }, [token1SearchText]);

  const handleToken1ModalOpen = () => {
    setToken1Modal(true);
  };

  const handleToken1ModalClose = (token1?: TokenType) => {
    if (token1) {
      setValue('token1', {
        id: token1.id,
        tickerSymbol: token1.tickerSymbol
      });
    }

    setToken1Modal(false);
  };

  const handleToken1Change = (
    _: any,
    newValue: string | TokenDropdownType | null,
  ) => {
    if (!newValue) {
      // Handle the case where no option is selected
      setValue('token1', {
        id: -1,
        tickerSymbol: ''
      });
    } else if (typeof newValue === 'object') {
      // Check if the selected option exists in the token1List
      setValue('token1', newValue);
    }
    trigger('token1');
  };

  // Token2 MODAL
  const debounceToken2SearchText = debounce((value: string) => {
    setToken2SearchText(value);
  }, 300);

  const handleToken2SearchText = (
    _: any,
    text: string,
    reason: AutocompleteInputChangeReason,
  ) => {
    if (reason === 'input') {
      debounceToken2SearchText(text);
    }
  };

  useUpdateEffect(() => {
    token2Refetch();
  }, [token2SearchText]);

  const handleToken2ModalOpen = () => {
    setToken2Modal(true);
  };

  const handleToken2ModalClose = (token2?: TokenType) => {
    if (token2) {
      setValue('token2', {
        id: token2.id,
        tickerSymbol: token2.tickerSymbol
      });
    }

    setToken2Modal(false);
  };

  const handleToken2Change = (
    _: any,
    newValue: string | TokenDropdownType | null,
  ) => {
    if (!newValue) {
      // Handle the case where no option is selected
      setValue('token2', {
        id: -1,
        tickerSymbol: ''
      });
    } else if (typeof newValue === 'object') {
      // Check if the selected option exists in the token2List
      setValue('token2', newValue);
    }
    trigger('token2');
  };


  return (
    <>
      <ModalWithTitle
        open={open}
        title="New LiquidityPool"
        subTitle="Create new LiquidityPool"
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
          onSubmit: handleSubmit(handleCreateOrUpdateLiquidityPool),
        }}
        loading={isLiquidityPoolDataFetching}
      >
      <Grid container spacing={2}>
        <Grid xs={12} md={12} item>
          <Stack direction={'row'} alignItems={'flex-start'} spacing={2}>
            <Autocomplete
              value={
                getValues('token1') || null
              }
              options={token1List || []}
              getOptionLabel={(option) =>
                typeof option === 'object' ? option.tickerSymbol : option
              }
              onChange={handleToken1Change}
              onInputChange={handleToken1SearchText}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Token1"
                  size="small"
                  error={!!errors.token1?.id?.message}
                  helperText={errors.token1?.id?.message}
                />
              )}
              renderOption={(props, option) => (
                <ListItem {...props} key={option.id}>
                  {option.tickerSymbol}
                </ListItem>
              )}
              loading={isToken1Fetching}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              freeSolo
              forcePopupIcon
              fullWidth
            />
            <IconButton onClick={handleToken1ModalOpen}>
              <AddIcon />
            </IconButton>
          </Stack>
        </Grid>
                <Grid xs={12} md={12} item>
          <Stack direction={'row'} alignItems={'flex-start'} spacing={2}>
            <Autocomplete
              value={
                getValues('token2') || null
              }
              options={token2List || []}
              getOptionLabel={(option) =>
                typeof option === 'object' ? option.tickerSymbol : option
              }
              onChange={handleToken2Change}
              onInputChange={handleToken2SearchText}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Token2"
                  size="small"
                  error={!!errors.token2?.id?.message}
                  helperText={errors.token2?.id?.message}
                />
              )}
              renderOption={(props, option) => (
                <ListItem {...props} key={option.id}>
                  {option.tickerSymbol}
                </ListItem>
              )}
              loading={isToken2Fetching}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              freeSolo
              forcePopupIcon
              fullWidth
            />
            <IconButton onClick={handleToken2ModalOpen}>
              <AddIcon />
            </IconButton>
          </Stack>
        </Grid>
                <Grid xs={12} md={12} item>
          <Controller
            name="reserve1"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Reserve1"
                error={!!errors.reserve1?.message}
                helperText={errors.reserve1?.message}
                size="small"
                fullWidth
              />
            )}
          />
        </Grid>
                        <Grid xs={12} md={12} item>
          <Controller
            name="reserve2"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Reserve2"
                error={!!errors.reserve2?.message}
                helperText={errors.reserve2?.message}
                size="small"
                fullWidth
              />
            )}
          />
        </Grid>
                        <Grid xs={12} md={12} item>
          <Controller
            name="feeRate"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Fee Rate"
                error={!!errors.feeRate?.message}
                helperText={errors.feeRate?.message}
                size="small"
                fullWidth
              />
            )}
          />
        </Grid>
                      </Grid>
      </ModalWithTitle>
      {token1FormModal && (
        <TokenFormModal open={token1FormModal} onClose={handleToken1ModalClose} />
      )}
      {token2FormModal && (
        <TokenFormModal open={token2FormModal} onClose={handleToken2ModalClose} />
      )}
    </>
  )
}

export default LiquidityPoolFormModal;