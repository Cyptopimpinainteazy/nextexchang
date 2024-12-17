import { 
  TokenType,
  TokenDropdownType,
} from '.';

export interface LiquidityPoolType {
  id: number;
  token1: TokenType;
    token2: TokenType;
    reserve1: number;
    reserve2: number;
    feeRate?: number;
  }

export interface LiquidityPoolFormModalType {
  token1: TokenDropdownType;
    token2: TokenDropdownType;
    reserve1: number;
    reserve2: number;
    feeRate?: number;
  }

export interface LiquidityPoolListItemType {
  id: number;
  token1: TokenDropdownType;
    token2: TokenDropdownType;
    reserve1: number;
    reserve2: number;
    feeRate?: number;
  }

export interface LiquidityPoolListType {
  result: LiquidityPoolListItemType[];
  total: number;
}

export interface LiquidityPoolDropdownType {
  id: number;
  name: string;
}

export interface CreateOrUpdateLiquidityPoolType {
  token1Id: number;
    token2Id: number;
    reserve1: number;
    reserve2: number;
    feeRate?: number;
  }
