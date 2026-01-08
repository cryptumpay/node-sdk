import crypto from 'crypto';
import { ISigner, TContent, THeaders, TMethod, TSignResult } from './types';

export class CryptumPaySigner implements ISigner {
  #key: string;
  #secret: string;

  public constructor (key: string | undefined, secret: string | undefined) {
    if (!key) {
      throw new Error('SignatureService requires a key');
    }

    if (!secret) {
      throw new Error('SignatureService requires a secret');
    }

    this.#key = key;
    this.#secret = secret;
  }

  public formatBody (content: TContent): string {
    return typeof content === 'string' ? content : JSON.stringify(content || {});
  }

  public signRequest (path: string, method: TMethod, content: TContent): TSignResult {
    const body = this.formatBody(content);
    const timestamp = Date.now().toString();
    const bodyHash = crypto.createHash('sha256').update(body).digest('hex');

    if (typeof path === 'string' && path.length > 0) {
      if (!path.startsWith('/')) {
        path = '/' + path;
      }

      if (path.endsWith('/')) {
        path = path.slice(0, -1);
      }
    } else {
      path = '/';
    }

    const prehash = [bodyHash, method?.toUpperCase(), path, timestamp, this.#key].join('|');
    const signature = crypto.createHmac('sha256', this.#secret).update(prehash).digest('hex');

    const headers: THeaders = {
      'Content-Type': 'application/json',
      'x-api-key': this.#key,
      'x-signature': signature,
      'x-timestamp': timestamp,
    };

    return {
      headers,
      body,
    };
  }

  public verifyCallback (signature: string, content: TContent): boolean {
    const rawBody = typeof content === 'string' ? content : JSON.stringify(content ?? {});
    const bodyHash = crypto.createHash('sha256').update(rawBody).digest('hex');
    const prehash = [bodyHash, this.#key].join('|');
    const expectedSignature = crypto.createHmac('sha256', this.#secret).update(prehash).digest('hex');

    return signature === expectedSignature;
  }
}
