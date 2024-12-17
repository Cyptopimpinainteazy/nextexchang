import { 
  TokenType,
  TokenDropdownType,
} from '.';

export interface TradeType {
  id: number;
  timestamp: string;
    token1: TokenType;
    token2: TokenType;
    amount1: number;
    amount2: number;
    fee: number;
  }

export interface TradeFormModalType {
  timestamp: string;
    token1: TokenDropdownType;
    token2: TokenDropdownType;
    amount1: number;
    amount2: number;
    fee: number;
  }

export interface TradeListItemType {
  id: number;
  timestamp: string;
    token1: TokenDropdownType;
    token2: TokenDropdownType;
    amount1: number;
    amount2: number;
    fee: number;
  }

export interface TradeListType {
  result: TradeListItemType[];
  total: number;
}

export interface TradeDropdownType {
  id: number;
}

export interface CreateOrUpdateTradeType {
  timestamp: string;
    token1Id: number;
    token2Id: number;
    amount1: number;
    amount2: number;
    fee: number;
  }
