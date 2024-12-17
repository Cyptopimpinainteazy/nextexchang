import { 
  LiquidityPoolType,
  LiquidityPoolDropdownType,
} from '.';

export interface TokenType {
  id: number;
  name: string;
    tickerSymbol?: string;
    decimalPlace: number;
    totalSupply: number;
    circulatingSupply: number;
    price?: number;
    liquidityPool: LiquidityPoolType;
  }

export interface TokenFormModalType {
  name: string;
    tickerSymbol?: string;
    decimalPlace: number;
    totalSupply: number;
    circulatingSupply: number;
    price?: number;
    liquidityPool: LiquidityPoolDropdownType;
  }

export interface TokenListItemType {
  id: number;
  name: string;
    tickerSymbol?: string;
    decimalPlace: number;
    totalSupply: number;
    circulatingSupply: number;
    price?: number;
    liquidityPool: LiquidityPoolDropdownType;
  }

export interface TokenListType {
  result: TokenListItemType[];
  total: number;
}

export interface TokenDropdownType {
  id: number;
  tickerSymbol: string;
}

export interface CreateOrUpdateTokenType {
  name: string;
    tickerSymbol?: string;
    decimalPlace: number;
    totalSupply: number;
    circulatingSupply: number;
    price?: number;
    liquidityPoolId: number;
  }
