import { ApiClientError, type ApiClient } from './client'
import type { AuthContext, LoginRequest, RegisterRequest } from './types'

export const getCurrentUser = (api: ApiClient) =>
  api.get<AuthContext>('/api/v1/auth/me', { protected: true, unauthorized: 'ignore' })

export const login = (api: ApiClient, body: LoginRequest) =>
  api.post<AuthContext>('/api/v1/auth/login', { body, unauthorized: 'ignore' })

export const register = (api: ApiClient, body: RegisterRequest) =>
  api.post<AuthContext>('/api/v1/auth/register', { body, unauthorized: 'ignore' })

export const logout = (api: ApiClient) =>
  api.post<void>('/api/v1/auth/logout', { protected: true, unauthorized: 'ignore' })

export const isAnonymousResponse = (error: unknown) =>
  error instanceof ApiClientError && error.detail.kind === 'api' && error.detail.status === 401
