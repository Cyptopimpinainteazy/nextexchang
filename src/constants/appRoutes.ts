// Auth Routes
const LOGIN = '/login';
const SIGN_UP = '/register';
const FORGOT_PASSWORD = '/forgot-password';
const RESET_PASSWORD = '/reset-password';
const EMAIL_VERIFY = '/verify-email';

// Authorized Routes
const HOME = '/';
const MY_ACCOUNT = '/my-account';

// Modules
const TOKENS = '/tokens';
const LIQUIDITY_POOLS = '/liquidityPools';
const TRADES = '/trades';

const NOT_FOUND_PAGE = '*';

export default {
  // Auth
  LOGIN,
  SIGN_UP,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  EMAIL_VERIFY,

  // Dashboard
  HOME,
  MY_ACCOUNT,

  // Modules
  TOKENS,
  LIQUIDITY_POOLS,
  TRADES,

  NOT_FOUND_PAGE,
};
