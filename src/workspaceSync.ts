import { api, getStoredToken, setStoredAuth } from './api'
import type {
  BrandResponse,
  CategoryNodeResponse,
  MeasurementSetResponse,
  ProductResponse,
  ProfileResponse,
  RecommendationResponse,
  ReferenceSizeResponse,
  UserResponse,
} from './types'

export type UIProfile = {
  id: string
  name: string
  relation: string
  initials: string
  color: string
  height: string
  chest: string
  waist: string
  hips: string
  shoulder: string
  reference: string
  referenceBrandId?: string
  referenceSize: string
  referenceSizeId?: string
  referenceCategoryId?: string
  conflictDetected?: boolean
  conflictWarnings?: string[]
  measurementVersion?: number
  fit: string
  preferredUnit: 'cm' | 'in'
  genderCategory: string
  region: string
}

const PROFILE_COLORS = ['lavender', 'peach', 'mint', 'blue']

export function computeInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map(part => part[0] || '')
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'
  )
}

export function relationFromBackend(rel?: string): string {
  switch ((rel || '').toUpperCase()) {
    case 'SELF':
      return 'You'
    case 'PARTNER':
      return 'Partner'
    case 'CHILD':
      return 'Child'
    case 'PARENT':
      return 'Parent'
    case 'FRIEND':
      return 'Friend'
    case 'FAMILY':
    default:
      return 'Family member'
  }
}

export function relationToBackend(rel: string): string {
  switch (rel) {
    case 'You':
      return 'SELF'
    case 'Partner':
      return 'PARTNER'
    case 'Child':
      return 'CHILD'
    case 'Parent':
      return 'PARENT'
    case 'Friend':
      return 'FRIEND'
    default:
      return 'FAMILY'
  }
}

export function fitFromBackend(fit?: string): string {
  switch ((fit || '').toUpperCase()) {
    case 'SLIM':
      return 'Fitted'
    case 'RELAXED':
      return 'Relaxed'
    case 'OVERSIZED':
      return 'Oversized'
    case 'REGULAR':
    default:
      return 'Regular'
  }
}

export function fitToBackend(fit: string): string {
  switch (fit) {
    case 'Fitted':
      return 'SLIM'
    case 'Relaxed':
    case 'Comfortable':
      return 'RELAXED'
    case 'Oversized':
      return 'OVERSIZED'
    case 'Regular':
    default:
      return 'REGULAR'
  }
}

function fmtNum(val?: number): string {
  if (val === undefined || val === null || Number.isNaN(Number(val))) return ''
  const num = Number(val)
  return Number.isInteger(num) ? String(num) : String(Math.round(num * 10) / 10)
}

export function buildUIProfile(
  prof: ProfileResponse,
  index: number,
  measurementSets: MeasurementSetResponse[],
  referenceSizes: ReferenceSizeResponse[],
  brands: BrandResponse[]
): UIProfile {
  const activeSet = measurementSets.find(m => m.status === 'ACTIVE') ?? measurementSets[0]
  const cm = activeSet?.measurementsCm ?? {}
  const latestRef = referenceSizes[0]
  const refBrand = latestRef
    ? brands.find(b => b.id === latestRef.brandId)?.name ?? latestRef.brandId.replace(/^brand_/, '')
    : ''

  return {
    id: prof.id,
    name: prof.name,
    relation: prof.primary && prof.relationship === 'SELF' ? 'You' : relationFromBackend(prof.relationship),
    initials: computeInitials(prof.name),
    color: PROFILE_COLORS[index % PROFILE_COLORS.length],
    height: fmtNum(cm.HEIGHT),
    chest: fmtNum(cm.CHEST),
    waist: fmtNum(cm.WAIST),
    hips: fmtNum(cm.HIP),
    shoulder: fmtNum(cm.SHOULDER),
    reference: refBrand,
    referenceBrandId: latestRef?.brandId,
    referenceSize: latestRef?.sizeLabel ?? '',
    referenceSizeId: latestRef?.id,
    referenceCategoryId: latestRef?.categoryId,
    conflictDetected: latestRef?.conflictDetected ?? false,
    conflictWarnings: latestRef?.conflictWarnings ?? [],
    measurementVersion: activeSet?.version,
    fit: fitFromBackend(prof.defaultFitPreference),
    preferredUnit: (prof.preferredUnit || 'CM').toLowerCase() === 'in' ? 'in' : 'cm',
    genderCategory: prof.genderCategory || 'MENS',
    region: prof.region || 'IN',
  }
}

export async function loadHydratedProfiles(brands: BrandResponse[]): Promise<UIProfile[]> {
  const rawProfiles = await api.listProfiles()
  const hydrated = await Promise.all(
    rawProfiles.map(async (prof, idx) => {
      const [mSets, refSizes] = await Promise.all([
        api.getMeasurementHistory(prof.id).catch(() => []),
        api.getReferenceSizes(prof.id).catch(() => []),
      ])
      return buildUIProfile(prof, idx, mSets, refSizes, brands)
    })
  )
  return hydrated
}

export function resolveReferenceBrandAndCategory(
  brandQuery: string,
  sizeLabel: string,
  brands: BrandResponse[]
): { brandId: string; categoryId: string; region: string; sizeLabel: string } | null {
  const q = brandQuery.trim().toLowerCase()
  if (!q || !sizeLabel.trim()) return null

  const matched =
    brands.find(b => b.name.toLowerCase() === q || b.slug.toLowerCase() === q) ||
    brands.find(b => b.name.toLowerCase().includes(q) || q.includes(b.name.toLowerCase())) ||
    brands.find(b => b.aliases?.some(a => a.toLowerCase().includes(q)))

  const brandId = matched?.id ?? 'brand_zara'
  const cleanSize = sizeLabel.trim().toUpperCase()
  const isNumericJeans = /^(30|32|34|36)$/.test(cleanSize)

  if (brandId === 'brand_levis' || isNumericJeans) {
    return {
      brandId: brandId === 'brand_levis' ? 'brand_levis' : 'brand_zara',
      categoryId: 'mens_jeans',
      region: brandId === 'brand_levis' ? 'IN' : 'EU',
      sizeLabel: isNumericJeans ? cleanSize : '32',
    }
  }

  if (brandId === 'brand_hm') {
    return {
      brandId: 'brand_hm',
      categoryId: 'mens_shirts',
      region: 'IN',
      sizeLabel: /^(S|M|L|XL)$/.test(cleanSize) ? cleanSize : 'M',
    }
  }

  if (brandId === 'brand_nike') {
    return {
      brandId: 'brand_nike',
      categoryId: 'mens_tshirts',
      region: 'IN',
      sizeLabel: /^(S|M|L|XL)$/.test(cleanSize) ? cleanSize : 'L',
    }
  }

  return {
    brandId: 'brand_zara',
    categoryId: 'mens_tshirts',
    region: 'EU',
    sizeLabel: /^(S|M|L|XL)$/.test(cleanSize) ? cleanSize : 'L',
  }
}
export interface BootstrappedWorkspace {
  user: UserResponse | null
  brands: BrandResponse[]
  categories: CategoryNodeResponse[]
  products: ProductResponse[]
  profiles: UIProfile[]
  recommendationsByProfile: Record<string, RecommendationResponse[]>
}

export async function bootstrapWorkspace(): Promise<BootstrappedWorkspace> {
  const [brands, categories, products] = await Promise.all([
    api.getBrands(),
    api.getCategories(),
    api.getProducts(),
  ])

  let user: UserResponse | null = null
  if (getStoredToken()) {
    try {
      user = await api.getMe()
    } catch {
      setStoredAuth(null)
    }
  }

  if (!user) {
    return {
      user: null,
      brands,
      categories,
      products,
      profiles: [],
      recommendationsByProfile: {},
    }
  }

  const profiles = await loadHydratedProfiles(brands)
  const recommendationsByProfile: Record<string, RecommendationResponse[]> = {}
  await Promise.all(
    profiles.map(async p => {
      recommendationsByProfile[p.id] = await api.getProfileRecommendations(p.id).catch(() => [])
    })
  )

  return {
    user,
    brands,
    categories,
    products,
    profiles,
    recommendationsByProfile,
  }
}
