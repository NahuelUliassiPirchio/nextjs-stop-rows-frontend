export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function parseResponse<T = any>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const rawBody = await response.text();
  const hasBody = rawBody.trim().length > 0;
  let data: any = null;

  if (hasBody && contentType.includes('application/json')) {
    try {
      data = JSON.parse(rawBody);
    } catch {
      throw new ApiError('Invalid JSON response from server', response.status, rawBody);
    }
  } else if (hasBody) {
    data = rawBody;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      (typeof data === 'string' ? data : null) ||
      response.statusText ||
      'Request failed';

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
