import { generateToken, type AuthCredentials } from '../auth.js';

const BASE_URL = 'https://api.appstoreconnect.apple.com';
const MAX_RETRIES = 3;
const RATE_LIMIT_DELAY = 1100; // ms between requests to stay under 60/min

interface APIResponse<T> {
  data: T;
  links?: {
    self: string;
    next?: string;
  };
  meta?: {
    paging?: {
      total: number;
      limit: number;
    };
  };
  included?: unknown[];
}

interface APIError {
  status: string;
  code: string;
  title: string;
  detail: string;
}

export class ASCAPIError extends Error {
  constructor(
    public status: number,
    public errors: APIError[],
  ) {
    const message = errors.map((e) => `[${e.status}] ${e.title}: ${e.detail}`).join('\n');
    super(message);
    this.name = 'ASCAPIError';
  }
}

let lastRequestTime = 0;

async function throttle(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < RATE_LIMIT_DELAY && lastRequestTime > 0) {
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY - elapsed));
  }
  lastRequestTime = Date.now();
}

export class APIClient {
  private credentials: AuthCredentials;

  constructor(credentials: AuthCredentials) {
    this.credentials = credentials;
  }

  async request<T>(path: string, params?: Record<string, string>): Promise<APIResponse<T>> {
    await throttle();

    const token = await generateToken(this.credentials);
    const url = new URL(path, BASE_URL);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 429) {
          // Rate limited — wait and retry
          const retryAfter = parseInt(response.headers.get('Retry-After') || '5', 10);
          await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
          continue;
        }

        if (!response.ok) {
          const body = (await response.json()) as { errors: APIError[] };
          throw new ASCAPIError(response.status, body.errors || []);
        }

        return (await response.json()) as APIResponse<T>;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (error instanceof ASCAPIError && error.status !== 429 && error.status !== 500) {
          throw error; // Don't retry client errors
        }
        if (attempt < MAX_RETRIES - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  async paginate<T>(path: string, params?: Record<string, string>): Promise<T[]> {
    const allData: T[] = [];
    let nextUrl: string | undefined = undefined;
    const limit = '200';

    const initialParams = { ...params, 'limit': limit };
    const firstResponse = await this.request<T[]>(path, initialParams);
    allData.push(...(Array.isArray(firstResponse.data) ? firstResponse.data : [firstResponse.data]));
    nextUrl = firstResponse.links?.next;

    while (nextUrl) {
      await throttle();
      const token = await generateToken(this.credentials);

      const response = await fetch(nextUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        break;
      }

      const body = (await response.json()) as APIResponse<T[]>;
      if (Array.isArray(body.data)) {
        allData.push(...body.data);
      }
      nextUrl = body.links?.next;
    }

    return allData;
  }
}
