import axios, { AxiosInstance } from 'axios';
import { Agent } from 'https';
import {
  ISigner,
  TContent,
  TMethod,
  TResponse,
  TErrorResponse,
  TCreateOrderRequest,
  TCreateOrderResponse,
  TGetOrderResponse,
} from './types';

export class CryptumPayClient {
  #baseUrl: string;
  #axios: AxiosInstance;
  #signer: ISigner;

  constructor (signer: ISigner, baseUrl?: string) {
    if (!signer || typeof signer.signRequest !== 'function') {
      throw new Error('CryptumPayClient requires a valid signer');
    }

    baseUrl = baseUrl || 'https://papi.cryptumpay.com';

    this.#baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.#signer = signer;

    this.#axios = axios.create({
      httpsAgent: new Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  private async makeRequest<T> (path: string, method: TMethod, params?: TContent): Promise<TResponse<T>> {
    try {
      const { headers, body } = this.#signer.signRequest(path, method, params);

      const response = await this.#axios({
        url: `${this.#baseUrl}${path}`,
        method,
        headers,
        data: body,
      });

      response.data = response.data || {};

      const { data, errorObject } = response.data;

      if (errorObject) {
        return {
          data: null,
          errorObject,
        };
      }

      if (typeof data === 'object') {
        return {
          data,
          errorObject: null,
        };
      }

      throw new Error('Invalid response format from API');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorResponse: TErrorResponse = err.response?.data || {};
        const errorObject = errorResponse.errorObject || {};

        return {
          data: null,
          errorObject: {
            httpCode: err.response?.status || 400,
            appCode: errorObject.appCode || -1,
            data: errorObject.data,
            message: errorObject.message,
          },
        };
      } else {
        return {
          data: null,
          errorObject: {
            httpCode: 400,
            appCode: -1,
            message: err instanceof Error ? err.message : 'An unexpected error occurred',
          },
        };
      }
    }
  }

  public async createOrder (params: TCreateOrderRequest): Promise<TResponse<TCreateOrderResponse>> {
    return await this.makeRequest<TCreateOrderResponse>('/v1/orders', 'POST', params);
  }

  public async getOrder (orderId: string): Promise<TResponse<TGetOrderResponse>> {
    return await this.makeRequest<TGetOrderResponse>(`/v1/orders/${orderId}`, 'GET');
  }
}
