export type THeaders = {
  'Content-Type': string;
  'x-api-key': string;
  'x-signature': string;
  'x-timestamp': string;
};

export type TSignResult = {
  headers: THeaders;
  body: string;
};

export type TContent = Record<string, any> | string | undefined | null;

export type TMethod = 'POST' | 'PUT' | 'GET' | 'DELETE' | 'PATCH';

export interface ISigner {
  signRequest (path: string, method: TMethod, content: TContent): {
    headers: THeaders;
    body: string;
  };
}

export type TCreateOrderRequest = {
  title: string;
  description: string;
  fiatAmount?: string;
  fiatCurrency?: string;
  cryptoCurrency?: string;
  cryptoBlockchain?: string;
  cryptoAmount?: string;
  clientEmail?: string;
  projectDataMeta?: string;
  projectDataOrderId?: string;
  projectDataUserEmail?: string;
  projectDataUserId?: string;
  url?: string;
};

export type TCustomerOrderInfo = {
  id: string;
  status: string;
  cryptoTicker: string;
  cryptoBlockchainId: number;
  cryptoAmount: string;
  depositAddress?: string;
  expiresAt?: number;
  depositsList: Record<string, any>[];
  summary: Record<string, any>;
};

export type TCurrencyEntry = {
  cryptoCurrency: string;
  cryptoBlockchain: string;
  cryptoMinAmount: string;
  cryptoMaxAmount: string;
  transferFee?: string;
  serviceFeePercent?: string;
};

export type TGetCurrenciesResponse = TCurrencyEntry[];

export type TWithdrawRequest = {
  currency: string;
  blockchain: string;
  address: string;
  extra?: string | null;
  amount: string;
};

export type TWithdrawResponse = {
  id: string;
};

export type TGetWithdrawalRequest = {
  id: string;
};

export type TGetWithdrawalResponse = {
  status: string;
  hash?: string;
};

export type TSuccessResponse<T> = {
  data: T;
  errorObject: null;
};

export type TErrorResponse = {
  data: null;
  errorObject: {
    httpCode: number;
    appCode: number;
    data?: any;
    message?: string;
  };
};

export type TResponse<T> = TSuccessResponse<T> | TErrorResponse;

export type TCreateOrderResponse = {
  id: string;
  project: {
    id: string;
    feePercent: number;
    logoUrl: string;
    title: string;
    url: string;
  };
  expiresAt: number;
  customerOrderRequest: {
    fiatTicker: string;
    fiatAmount: string;
    title: string;
    description: string;
    url: string;
    projectData: Record<string, any>;
  };
  customerOrder?: TCustomerOrderInfo | null;
};

export type TGetOrderResponse = {
  id: string;
  project: {
    id: string;
    feePercent: number;
    logoUrl: string;
    title: string;
    url: string;
  };
  expiresAt: number;
  customerOrderRequest: {
    fiatTicker: string;
    fiatAmount: string;
    title: string;
    description: string;
    url: string;
    projectData: Record<string, any>;
  };
  hasCustomerOrder: boolean;
  customerOrder?: TCustomerOrderInfo | null;
  financeSummary?: {
    status: number;
    accrued: boolean;
    income?: {
      amount: string;
      currency: string;
    } | undefined;
  } | undefined;
};
