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
  fiatAmount: string;
  fiatCurrency: string;
  projectDataMeta?: string;
  projectDataOrderId?: string;
  projectDataUserEmail?: string;
  projectDataUserId?: string;
  url?: string;
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
  financeSummary?: {
    status: number;
    accrued: boolean;
    income?: {
      amount: string;
      currency: string;
    } | undefined;
  } | undefined;
};
