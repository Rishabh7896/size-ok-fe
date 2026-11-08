export interface AuthResponse {
  userId: string
  email: string
  role: string
  accessToken: string
  refreshToken: string
  defaultProfileId: string
}

export interface AuthProviderInfo {
  id: 'GOOGLE' | 'APPLE' | 'GITHUB' | 'LOCAL' | string
  name: string
  enabled: boolean
}

export interface UserResponse {
  id: string
  email: string
  authProvider: string
  role: string
  status: string
  createdAt: string
}

export interface PrivacySettingsResponse {
  userId: string
  analyticsConsent: boolean
  personalizedRecommendationsConsent: boolean
  imageMeasurementConsent: boolean
  marketingConsent: boolean
  updatedAt: string
}

export interface DeletionRequestResponse {
  userId: string
  status: string
  message: string
  requestedAt: string
}

export interface UserDataExportResponse {
  user: UserResponse
  privacy: PrivacySettingsResponse
  profiles: Record<string, unknown>[]
  exportedAt: string
}

export interface ProfileResponse {
  id: string
  userId: string
  name: string
  relationship: string
  genderCategory: string
  preferredUnit: 'CM' | 'IN'
  region: string
  defaultFitPreference: string
  primary: boolean
  createdAt: string
  updatedAt: string
}

export interface MeasurementValueDto {
  dimension: string
  valueCm: number
  originalValue: number
  originalUnit: string
  source: string
  confidence: number
}

export interface MeasurementSetResponse {
  measurementSetId: string
  profileId: string
  version: number
  unit: string
  source: string
  status: string
  measuredAt: string
  createdAt: string
  measurementsCm: Record<string, number>
  detailedMeasurements: MeasurementValueDto[]
}

export interface InferredDimensionRange {
  minCm: number
  maxCm: number
  basis: string
}

export interface ReferenceSizeResponse {
  id: string
  profileId: string
  brandId: string
  categoryId: string
  productId?: string
  sizeChartId?: string
  sizeLabel: string
  region: string
  fitPreference: string
  inferredRanges: Record<string, InferredDimensionRange>
  conflictDetected: boolean
  conflictWarnings: string[]
  createdAt: string
}

export interface BrandResponse {
  id: string
  name: string
  slug: string
  country: string
  applicableSizeSystems: string[]
  officialChartUrl?: string
  verificationStatus: string
  active: boolean
  aliases: string[]
}

export interface CategoryNodeResponse {
  id: string
  parentId?: string
  name: string
  slug: string
  garmentGroup: string
  genderAudience: string
  children: CategoryNodeResponse[]
}

export interface ProductVariantDto {
  sizeLabel: string
  available: boolean
  sortOrder: number
}

export interface ProductResponse {
  id: string
  brandId: string
  brandName: string
  categoryId: string
  categoryName: string
  retailer: string
  name: string
  canonicalUrl?: string
  productType?: string
  fitType: string
  stretchLevel: string
  materialComposition?: string
  genderAudience: string
  region: string
  availableSizes: ProductVariantDto[]
  createdAt: string
}

export interface ChartDimensionRangeDto {
  dimension: string
  minValue: number
  maxValue: number
  measurementBasis?: string
}

export interface SizeOptionDto {
  sizeLabel: string
  sortOrder?: number
  measurements: ChartDimensionRangeDto[]
}

export interface SizeChartResponse {
  id: string
  brandId: string
  productId?: string
  categoryId: string
  region: string
  chartName: string
  measurementBasis: 'BODY' | 'GARMENT'
  version: number
  status: string
  sourceType: string
  sourceUrl?: string
  extractionMethod?: string
  confidence?: number
  verifiedAt?: string
  verifiedBy?: string
  createdAt: string
  sizeOptions: SizeOptionDto[]
}

export interface DimensionFitDetail {
  status: string
  contribution: string
  userValueCm: number
  targetMinCm: number
  targetMaxCm: number
  penalty: number
}

export interface CandidateSizeSummary {
  sizeLabel: string
  fitScore: number
  rank: number
}

export interface RecommendationResponse {
  recommendationId: string
  profileId: string
  productId: string
  measurementSetVersion?: number
  sizeChartId: string
  chartVersion: number
  fitPreference: string
  recommendedSize: string
  alternativeSize?: string
  fitScore: number
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  fitSummary: string
  dimensionAnalysis: Record<string, DimensionFitDetail>
  explanation: string[]
  candidates: CandidateSizeSummary[]
  algorithmVersion: string
  createdAt: string
}

export interface IngestionStatusResponse {
  ingestionId: string
  status: 'COMPLETED' | 'NEEDS_USER_INPUT' | 'CHART_FOUND' | 'PROCESSING' | 'FAILED'
  message: string
  requiredAction?: string
  product?: {
    productId: string
    brand: string
    category: string
    name: string
  }
  recommendation?: {
    recommendationId: string
  }
  extractedSizeChartId?: string
  createdAt: string
  updatedAt: string
}

export interface FeedbackResponse {
  id: string
  recommendationId: string
  profileMeasurementVersion?: number
  chartVersion: number
  purchased: boolean
  actualSize: string
  keptSize?: string
  fitResult: string
  returnedDueToSize: boolean
  problemDimensions?: string[]
  userComment?: string
  createdAt: string
}
