import type {
  AuthProviderInfo,
  AuthResponse,
  BrandResponse,
  CategoryNodeResponse,
  DeletionRequestResponse,
  FeedbackResponse,
  IngestionStatusResponse,
  MeasurementSetResponse,
  PrivacySettingsResponse,
  ProductResponse,
  ProfileResponse,
  RecommendationResponse,
  ReferenceSizeResponse,
  SizeChartResponse,
  SizeOptionDto,
  UserDataExportResponse,
  UserResponse,
} from './types'

const API_BASE =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL || '/api/v1'
const TOKEN_KEY = 'sizeok_access_token'
const EMAIL_KEY = 'sizeok_user_email'

export class ApiError extends Error {
  status: number
  errorCode?: string
  fieldErrors?: Record<string, string>

  constructor(message: string, status: number, errorCode?: string, fieldErrors?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errorCode = errorCode
    this.fieldErrors = fieldErrors
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY)
}

export function setStoredAuth(token: string | null, email?: string) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    if (email) localStorage.setItem(EMAIL_KEY, email)
  } else {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken()
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    const errObj = (typeof data === 'object' && data !== null ? data : {}) as Record<string, unknown>
    const fieldErrors = errObj.fieldErrors as Record<string, string> | undefined
    const firstFieldErr = fieldErrors ? Object.values(fieldErrors)[0] : undefined
    const msg =
      firstFieldErr ||
      (typeof errObj.message === 'string' ? errObj.message : null) ||
      `Request failed (${response.status})`
    throw new ApiError(msg, response.status, errObj.errorCode as string | undefined, fieldErrors)
  }

  return data as T
}

export const api = {
  getAuthProviders() {
    return request<AuthProviderInfo[]>('/auth/providers')
  },
  register(payload: { email: string; password: string; name?: string; preferredUnit?: string; region?: string }) {
    return request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
  },
  login(payload: { email: string; password: string }) {
    return request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
  },
  oauthLogin(payload: {
    provider: 'GOOGLE' | 'APPLE' | 'GITHUB'
    email: string
    name?: string
    idToken?: string
    preferredUnit?: string
    region?: string
  }) {
    return request<AuthResponse>('/auth/oauth', { method: 'POST', body: JSON.stringify(payload) })
  },
  logout() {
    return request<void>('/auth/logout', { method: 'POST' })
  },
  getMe() {
    return request<UserResponse>('/users/me')
  },
  updateMe(payload: { email?: string }) {
    return request<UserResponse>('/users/me', { method: 'PATCH', body: JSON.stringify(payload) })
  },
  getPrivacy() {
    return request<PrivacySettingsResponse>('/users/me/privacy')
  },
  updatePrivacy(payload: Partial<{
    analyticsConsent: boolean
    personalizedRecommendationsConsent: boolean
    imageMeasurementConsent: boolean
    marketingConsent: boolean
  }>) {
    return request<PrivacySettingsResponse>('/users/me/privacy', { method: 'PATCH', body: JSON.stringify(payload) })
  },
  exportUserData() {
    return request<UserDataExportResponse>('/users/me/export')
  },
  requestDeletion() {
    return request<DeletionRequestResponse>('/users/me/deletion-request', { method: 'POST' })
  },
  listProfiles() {
    return request<ProfileResponse[]>('/profiles')
  },
  createProfile(payload: {
    name: string
    relationship?: string
    genderCategory?: string
    preferredUnit?: string
    region?: string
    defaultFitPreference?: string
    primary?: boolean
  }) {
    return request<ProfileResponse>('/profiles', { method: 'POST', body: JSON.stringify(payload) })
  },
  updateProfile(profileId: string, payload: {
    name?: string
    relationship?: string
    genderCategory?: string
    preferredUnit?: string
    region?: string
    defaultFitPreference?: string
  }) {
    return request<ProfileResponse>(`/profiles/${profileId}`, { method: 'PATCH', body: JSON.stringify(payload) })
  },
  deleteProfile(profileId: string) {
    return request<void>(`/profiles/${profileId}`, { method: 'DELETE' })
  },
  saveMeasurements(profileId: string, payload: {
    unit: 'CM' | 'IN'
    source?: string
    notes?: string
    measurements: { dimension: string; value: number; source?: string }[]
  }) {
    return request<MeasurementSetResponse>(`/profiles/${profileId}/measurement-sets`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  getMeasurementHistory(profileId: string) {
    return request<MeasurementSetResponse[]>(`/profiles/${profileId}/measurement-sets`)
  },
  addReferenceSize(profileId: string, payload: {
    brandId: string
    categoryId: string
    sizeLabel: string
    region?: string
    fitPreference?: string
    productId?: string
  }) {
    return request<ReferenceSizeResponse>(`/profiles/${profileId}/reference-sizes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  getReferenceSizes(profileId: string) {
    return request<ReferenceSizeResponse[]>(`/profiles/${profileId}/reference-sizes`)
  },
  deleteReferenceSize(referenceSizeId: string) {
    return request<void>(`/reference-sizes/${referenceSizeId}`, { method: 'DELETE' })
  },
  getBrands(query?: string) {
    const qs = query ? `?q=${encodeURIComponent(query)}` : ''
    return request<BrandResponse[]>(`/brands${qs}`)
  },
  getBrandSizeCharts(brandId: string) {
    return request<SizeChartResponse[]>(`/brands/${brandId}/size-charts`)
  },
  getCategories() {
    return request<CategoryNodeResponse[]>('/categories')
  },
  getProducts(params?: { brandId?: string; categoryId?: string }) {
    const search = new URLSearchParams()
    if (params?.brandId) search.set('brandId', params.brandId)
    if (params?.categoryId) search.set('categoryId', params.categoryId)
    const qs = search.toString()
    return request<ProductResponse[]>(`/products${qs ? `?${qs}` : ''}`)
  },
  getProduct(productId: string) {
    return request<ProductResponse>(`/products/${productId}`)
  },
  generateRecommendation(payload: { profileId: string; productId: string; fitPreference?: string }) {
    return request<RecommendationResponse>('/recommendations', { method: 'POST', body: JSON.stringify(payload) })
  },
  generateRecommendationByUrl(payload: { profileId: string; productUrl: string; fitPreference?: string }) {
    return request<RecommendationResponse | IngestionStatusResponse>('/recommendations/by-url', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  getRecommendation(recommendationId: string) {
    return request<RecommendationResponse>(`/recommendations/${recommendationId}`)
  },
  getProfileRecommendations(profileId: string) {
    return request<RecommendationResponse[]>(`/profiles/${profileId}/recommendations`)
  },
  submitFeedback(recommendationId: string, payload: {
    purchased: boolean
    actualSize: string
    keptSize?: string
    fitResult: string
    returnedDueToSize?: boolean
    problemDimensions?: string[]
    userComment?: string
  }) {
    return request<FeedbackResponse>(`/recommendations/${recommendationId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  submitManualChart(ingestionId: string, payload: {
    brandId?: string
    categoryId?: string
    region?: string
    chartName?: string
    measurementBasis: 'BODY' | 'GARMENT'
    unit?: 'CM' | 'IN'
    sizeOptions: SizeOptionDto[]
  }) {
    return request<IngestionStatusResponse>(`/product-ingestions/${ingestionId}/size-chart`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  confirmExtractedChart(ingestionId: string) {
    return request<IngestionStatusResponse>(`/product-ingestions/${ingestionId}/confirm-chart`, {
      method: 'POST',
    })
  },
}
