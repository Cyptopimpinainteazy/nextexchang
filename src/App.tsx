import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AppRoutes from './routes/AppRoutes';
import { SnackbarProvider } from 'notistack';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme();

const App = (): React.ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={1500}
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          >
            <BrowserRouter>
              <CssBaseline />
              <AppRoutes />
            </BrowserRouter>
          </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
