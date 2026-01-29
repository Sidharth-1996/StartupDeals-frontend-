const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ApiError {
  message: string;
  verificationStatus?: string;
}

export class FetchError extends Error {
  status: number;
  data: ApiError;

  constructor(message: string, status: number, data: ApiError) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new FetchError(
      data.message || "Request failed",
      response.status,
      data
    );
  }

  return data;
}

export const api = {
  get: async <T>(endpoint: string, token?: string): Promise<T> => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    return handleResponse<T>(response);
  },

  post: async <T>(
    endpoint: string,
    body?: unknown,
    token?: string
  ): Promise<T> => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    return handleResponse<T>(response);
  },
};

export default API_BASE_URL;
