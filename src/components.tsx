import type React from 'react'
import type {
  PrivacySettingsResponse,
  ProductResponse,
  RecommendationResponse,
} from './types'
import type { UIProfile } from './workspaceSync'

export type IconName = 'grid' | 'users' | 'scan' | 'ruler' | 'clock' | 'settings' | 'chevron' | 'external' | 'plus' | 'arrow' | 'shirt' | 'check' | 'link' | 'spark' | 'edit' | 'trash' | 'close' | 'upload' | 'search' | 'heart' | 'help' | 'menu' | 'info' | 'refresh' | 'sun' | 'moon' | 'logout'

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const paths: Record<IconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 12h10M12 7v10"/></>,
    ruler: <><path d="m3 7 4-4 14 14-4 4L3 7Z"/><path d="m8 8 2-2M11 11l2-2M14 14l2-2M17 17l2-2"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.9l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.9Z" transform="translate(-1 -1) scale(1.08)"/></>,
    chevron: <path d="m7 10 5 5 5-5"/>, external: <><path d="M14 3h7v7M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>, arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    shirt: <><path d="m16 4 5 3-3 5-2-1v9H8v-9l-2 1-3-5 5-3c1 2 2 3 4 3s3-1 4-3Z"/></>,
    check: <path d="m5 12 4 4L19 6"/>, link: <><path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7"/></>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z"/></>,
    edit: <><path d="m16 4 4 4M4 20l4-.8L19.2 8a2.8 2.8 0 0 0-4-4L4 15.2 4 20Z"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>, upload: <><path d="M12 16V4m-4 4 4-4 4 4"/><path d="M4 16v4h16v-4"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>, heart: <path d="M20.8 8.7c0 5.1-8.8 10.3-8.8 10.3S3.2 13.8 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.6 1.4c-1 1.2-2.2 1.4-2.2 3M12 17h.01"/></>, menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>, info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>, refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9A7 7 0 0 1 18 6l2 2M4 16l2 2a7 7 0 0 0 12.5-3"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    moon: <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  }
  return <svg {...common} aria-hidden="true">{paths[name]}</svg>
}

export function ProfileCard({ profile, active, onSelect, onEdit }: { profile: UIProfile; active: boolean; onSelect: () => void; onEdit: () => void }) {
  return <div className={`profile-card ${active ? 'is-active' : ''}`}><div className="profile-card-top"><div className={`avatar avatar-lg avatar-${profile.color}`}>{profile.initials}</div>{active ? <span className="active-pill"><span/> Active</span> : <button className="icon-button" onClick={onEdit} aria-label="Edit profile"><Icon name="edit" size={15}/></button>}</div><h3>{profile.name}</h3><span className="profile-relation">{profile.relation}</span><div className="profile-card-bottom"><div><span>USUAL SIZE</span><strong>{profile.referenceSize || 'Add size'}</strong></div><div><span>FIT</span><strong>{profile.fit}</strong></div><button className="round-arrow" onClick={onSelect} aria-label={`Use ${profile.name}'s profile`}><Icon name="arrow" size={15}/></button></div></div>
}

export function PageTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-title-row"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="subheading">{description}</p></div>{action}</div>
}
function formatConfidenceLabel(conf?: string): string {
  switch ((conf || '').toUpperCase()) {
    case 'HIGH':
      return 'High confidence'
    case 'MEDIUM':
      return 'Good match'
    case 'LOW':
      return 'Estimated fit'
    default:
      return 'High confidence'
  }
}

function formatCheckDate(iso?: string): string {
  if (!iso) return 'Just now'
  try {
    const d = new Date(iso)
    const now = new Date()
    if (d.toDateString() === now.toDateString()) {
      return `Today, ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return 'Recent'
  }
}

export function RecentChecks({
  recommendations,
  products,
  onSelectRecommendation,
  expanded = false,
}: {
  recommendations: RecommendationResponse[]
  products: ProductResponse[]
  onSelectRecommendation: (rec: RecommendationResponse) => void
  expanded?: boolean
}) {
  const thumbColors = ['sand', 'denim', 'slate']

  if (recommendations.length === 0) {
    return (
      <div className="notice-banner">
        <div className="notice-symbol"><Icon name="info" size={17} /></div>
        <p><strong>No size checks for this profile yet.</strong> Use &ldquo;Find my size&rdquo; to generate a personalised recommendation from a product URL or brand catalog.</p>
      </div>
    )
  }

  const list = expanded ? recommendations : recommendations.slice(0, 4)

  return (
    <div className={`recent-list ${expanded ? 'expanded' : ''}`}>
      {list.map((rec, i) => {
        const prod = products.find(p => p.id === rec.productId)
        const brand = prod?.brandName ?? 'Brand'
        const productTitle = prod?.name ?? `Product ${rec.productId}`
        const category = prod?.categoryName ?? 'Apparel'
        const isBottom = category.toLowerCase().includes('jean') || category.toLowerCase().includes('trouser')
        const color = thumbColors[i % thumbColors.length]

        return (
          <button className="recent-item" key={rec.recommendationId} onClick={() => onSelectRecommendation(rec)}>
            <div className={`product-thumb thumb-${color}`}><div className="mini-garment">{isBottom ? '〰' : '◒'}</div></div>
            <div className="recent-product">
              <strong>{brand} <span>·</span> {productTitle}</strong>
              <span>{category} · {formatCheckDate(rec.createdAt)} · Score {rec.fitScore}%</span>
            </div>
            <div className="recent-fit"><span>RECOMMENDED</span><strong>{rec.recommendedSize}</strong></div>
            <span className="confidence-chip"><i /> {formatConfidenceLabel(rec.confidence)}</span>
            <Icon name="arrow" size={16} />
          </button>
        )
      })}
    </div>
  )
}
function formatDimVal(valCm: number, unit: 'cm' | 'in'): string {
  if (unit === 'in') {
    return `${(valCm / 2.54).toFixed(1)}`
  }
  return `${Math.round(valCm * 10) / 10}`
}

export function Recommendation({
  profile,
  recommendation,
  product,
  unit,
  feedback,
  isSubmittingFeedback,
  onFeedback,
}: {
  profile: UIProfile
  recommendation: RecommendationResponse
  product?: ProductResponse
  unit: 'cm' | 'in'
  feedback: string
  isSubmittingFeedback?: boolean
  onFeedback: (v: 'yes' | 'no') => void
}) {
  const brandName = (product?.brandName ?? 'Brand').toUpperCase()
  const genderLabel = (product?.genderAudience ?? profile.genderCategory ?? 'UNISEX').toUpperCase()
  const productName = product?.name ?? `Product ${recommendation.productId}`
  const metaParts = [
    product?.materialComposition,
    `${recommendation.fitPreference.charAt(0) + recommendation.fitPreference.slice(1).toLowerCase()} fit`,
    `Chart v${recommendation.chartVersion}`,
    recommendation.measurementSetVersion ? `Profile v${recommendation.measurementSetVersion}` : null,
  ].filter(Boolean)

  const dimEntries = Object.entries(recommendation.dimensionAnalysis || {})
  const explanationText =
    recommendation.explanation && recommendation.explanation.length > 0
      ? recommendation.explanation.join(' ')
      : `Your profile measurements fall within this product's ${recommendation.recommendedSize} size range.${
          recommendation.alternativeSize ? ` ${recommendation.alternativeSize} is your closest alternative.` : ''
        }`

  return (
    <section className="recommendation-card">
      <div className="recommendation-top">
        <div>
          <div className="eyebrow">02 / YOUR SIZE RESULT</div>
          <h2>Here&apos;s your best fit.</h2>
          <p>Based on verified sizing data and {profile.name}&apos;s saved fit profile.</p>
        </div>
        <span className="confidence-pill">
          <i /> {formatConfidenceLabel(recommendation.confidence)}
        </span>
      </div>
      <div className="result-product">
        <div className="result-product-art">
          <div className="result-garment"><span /></div>
          <span className="art-caption">PRODUCT PREVIEW</span>
        </div>
        <div className="result-product-info">
          <span className="product-brand">{brandName} · {genderLabel}</span>
          <h3>{productName}</h3>
          <span className="product-meta">{metaParts.join(' · ')}</span>
          <div className="result-size-row">
            <div>
              <span>YOUR RECOMMENDED SIZE</span>
              <strong>{recommendation.recommendedSize}</strong>
              {recommendation.alternativeSize && (
                <small style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  Alternative: {recommendation.alternativeSize}
                </small>
              )}
            </div>
            <div className="fit-match">
              <span>FIT MATCH</span>
              <strong>{recommendation.fitScore}%</strong>
              <small>{recommendation.fitSummary || 'Strong match'}</small>
            </div>
          </div>
          <div className="result-reason">
            <span className="reason-icon"><Icon name="check" size={15} /></span>
            <p>
              <strong>Why size {recommendation.recommendedSize}?</strong> {explanationText}
            </p>
          </div>
        </div>
      </div>
      <div className="size-comparison">
        <div className="comparison-title">
          <strong>How the measurements compare</strong>
          <span>{unit === 'cm' ? 'Centimetres' : 'Inches'} · live backend engine analysis</span>
        </div>
        <div className="comparison-table">
          <div className="comparison-row table-head">
            <span>MEASUREMENT</span>
            <span>{profile.name.toUpperCase()}</span>
            <span>SIZE {recommendation.recommendedSize} RANGE</span>
            <span>MATCH</span>
          </div>
          {dimEntries.map(([dim, detail]) => {
            const label = dim.charAt(0) + dim.slice(1).toLowerCase().replace('_', ' ')
            const userVal = `${formatDimVal(detail.userValueCm, unit)} ${unit}`
            const rangeVal =
              detail.targetMinCm === detail.targetMaxCm
                ? `${formatDimVal(detail.targetMinCm, unit)} ${unit}`
                : `${formatDimVal(detail.targetMinCm, unit)}–${formatDimVal(detail.targetMaxCm, unit)} ${unit}`
            const statusLabel =
              detail.status === 'IDEAL' || detail.status === 'IN_RANGE'
                ? 'In range'
                : detail.status.charAt(0) + detail.status.slice(1).toLowerCase()
            return (
              <div className="comparison-row" key={dim}>
                <span>{label}</span>
                <strong>{userVal}</strong>
                <span>{rangeVal}</span>
                <span className="match-mark"><Icon name="check" size={15} /> {statusLabel}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="recommendation-footer">
        <div>
          <strong>Did this recommendation help?</strong>
          <span>Your feedback is saved to the backend fit engine.</span>
        </div>
        <div className="feedback-actions">
          <button disabled={isSubmittingFeedback} className={feedback === 'yes' ? 'chosen' : ''} onClick={() => onFeedback('yes')}>
            <Icon name="check" size={15} /> Looks right
          </button>
          <button disabled={isSubmittingFeedback} className={feedback === 'no' ? 'chosen' : ''} onClick={() => onFeedback('no')}>
            <Icon name="help" size={15} /> Not quite
          </button>
        </div>
        {feedback && <span className="feedback-thanks">Saved to fit feedback history.</span>}
      </div>
    </section>
  )
}

export function PrivacyModal({
  privacy,
  onClose,
  onToggleConsent,
  onExportData,
  onRequestDeletion,
}: {
  privacy: PrivacySettingsResponse | null
  onClose: () => void
  onToggleConsent: (
    field: keyof Pick<
      PrivacySettingsResponse,
      'analyticsConsent' | 'personalizedRecommendationsConsent' | 'imageMeasurementConsent' | 'marketingConsent'
    >,
    value: boolean
  ) => void
  onExportData: () => void
  onRequestDeletion: () => void
}) {
  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-head">
          <div>
            <div className="eyebrow">PRIVACY &amp; PERSONAL DATA</div>
            <h2>Manage your fit data</h2>
            <p>Control consent preferences, export your JSON archive, or request account deletion.</p>
          </div>
          <button className="icon-button bordered" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </div>
        {privacy ? (
          <div className="settings-list" style={{ marginBottom: 18 }}>
            <div>
              <div>
                <strong>Personalised recommendations</strong>
                <p>Use saved body measurements and reference sizes to score garments.</p>
              </div>
              <input
                type="checkbox"
                checked={privacy.personalizedRecommendationsConsent}
                onChange={e => onToggleConsent('personalizedRecommendationsConsent', e.target.checked)}
              />
            </div>
            <div>
              <div>
                <strong>Sizing analytics</strong>
                <p>Help improve ease models and brand size chart accuracy.</p>
              </div>
              <input
                type="checkbox"
                checked={privacy.analyticsConsent}
                onChange={e => onToggleConsent('analyticsConsent', e.target.checked)}
              />
            </div>
            <div>
              <div>
                <strong>Image &amp; chart extraction</strong>
                <p>Allow processing of uploaded size chart screenshots.</p>
              </div>
              <input
                type="checkbox"
                checked={privacy.imageMeasurementConsent}
                onChange={e => onToggleConsent('imageMeasurementConsent', e.target.checked)}
              />
            </div>
            <div>
              <div>
                <strong>Product updates</strong>
                <p>Receive occasional updates when new brand charts are verified.</p>
              </div>
              <input
                type="checkbox"
                checked={privacy.marketingConsent}
                onChange={e => onToggleConsent('marketingConsent', e.target.checked)}
              />
            </div>
          </div>
        ) : (
          <p>Loading privacy preferences…</p>
        )}
        <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
          <button className="secondary-button" onClick={onRequestDeletion} style={{ color: 'var(--danger)' }}>
            <Icon name="trash" size={15} /> Request account deletion
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="secondary-button" onClick={onExportData}>
              <Icon name="external" size={15} /> Export JSON
            </button>
            <button className="primary-button" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProviderLogo({ provider, size = 17 }: { provider: 'GOOGLE' | 'APPLE' | 'GITHUB'; size?: number }) {
  if (provider === 'GOOGLE') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M21.8 12.23c0-.72-.06-1.41-.18-2.08H12v3.93h5.5a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.04-4.4 3.04-7.49Z" />
        <path fill="#34A853" d="M12 22c2.76 0 5.08-.91 6.77-2.47l-3.3-2.56c-.91.61-2.08.98-3.47.98-2.67 0-4.93-1.8-5.74-4.22H2.85v2.65A10 10 0 0 0 12 22Z" />
        <path fill="#FBBC05" d="M6.26 13.73a6.03 6.03 0 0 1 0-3.46V7.62H2.85a10 10 0 0 0 0 8.76l3.41-2.65Z" />
        <path fill="#EA4335" d="M12 6.05c1.5 0 2.85.52 3.91 1.53l2.93-2.93C17.07 2.99 14.76 2 12 2a10 10 0 0 0-9.15 5.62l3.41 2.65C7.07 7.85 9.33 6.05 12 6.05Z" />
      </svg>
    )
  }
  if (provider === 'APPLE') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.67 12.63c.02 2.47 2.16 3.29 2.19 3.3-.02.06-.34 1.18-1.13 2.33-.68.99-1.39 1.98-2.5 2-.98.02-1.3-.64-2.42-.64-1.12 0-1.48.62-2.4.66-.96.04-1.7-.94-2.39-1.93-1.39-2.01-2.45-5.68-1.02-8.16.71-1.23 1.98-2.01 3.36-2.03 1.05-.02 2.04.71 2.68.71.64 0 1.85-.87 3.12-.75.53.02 2.02.21 2.98 1.61-.08.05-1.78 1.04-1.76 2.9ZM14.66 5.91c.54-.66.91-1.58.81-2.5-.78.03-1.73.52-2.29 1.18-.5.58-.94 1.51-.82 2.41.87.07 1.76-.43 2.3-1.09Z" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.35 1.12 2.92.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
    </svg>
  )
}

const OAUTH_PRESET_ACCOUNTS: Record<'GOOGLE' | 'APPLE' | 'GITHUB', { name: string; email: string; subtitle: string }[]> = {
  GOOGLE: [
    { name: 'Rishabh Gautam', email: 'rishabh.google@gmail.com', subtitle: 'Google Account · Signed in' },
    { name: 'Priya Sharma', email: 'priya.sharma@gmail.com', subtitle: 'Google Account' },
  ],
  APPLE: [
    { name: 'Rishabh Gautam', email: 'rishabh@icloud.com', subtitle: 'Apple ID · Hide My Email available' },
  ],
  GITHUB: [
    { name: 'Rishabh (@rishabh-dev)', email: 'rishabh.dev@github.com', subtitle: 'GitHub Developer Account' },
  ],
}

export interface AuthViewProps {
  theme: 'light' | 'dark'
  authMode: 'login' | 'register'
  email: string
  password: string
  name: string
  preferredUnit: 'CM' | 'IN'
  region: string
  selectedOAuthProvider: 'GOOGLE' | 'APPLE' | 'GITHUB' | null
  oauthEmail: string
  oauthName: string
  isSubmitting: boolean
  onToggleTheme: () => void
  onModeChange: (m: 'login' | 'register') => void
  onEmailChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onNameChange: (v: string) => void
  onUnitChange: (v: 'CM' | 'IN') => void
  onRegionChange: (v: string) => void
  onSelectOAuthProvider: (p: 'GOOGLE' | 'APPLE' | 'GITHUB' | null) => void
  onOAuthEmailChange: (v: string) => void
  onOAuthNameChange: (v: string) => void
  onSubmitCredentials: () => void
  onSubmitOAuth: (provider: 'GOOGLE' | 'APPLE' | 'GITHUB', email: string, name: string) => void
}
export function AuthView({
  theme,
  authMode,
  email,
  password,
  name,
  preferredUnit,
  region,
  selectedOAuthProvider,
  oauthEmail,
  oauthName,
  isSubmitting,
  onToggleTheme,
  onModeChange,
  onEmailChange,
  onPasswordChange,
  onNameChange,
  onUnitChange,
  onRegionChange,
  onSelectOAuthProvider,
  onOAuthEmailChange,
  onOAuthNameChange,
  onSubmitCredentials,
  onSubmitOAuth,
}: AuthViewProps) {
  const selectProvider = (provider: 'GOOGLE' | 'APPLE' | 'GITHUB') => {
    const next = selectedOAuthProvider === provider ? null : provider
    onSelectOAuthProvider(next)
    if (next) {
      onOAuthEmailChange(OAUTH_PRESET_ACCOUNTS[next][0].email)
      onOAuthNameChange(OAUTH_PRESET_ACCOUNTS[next][0].name)
    }
  }

  return (
    <div className="auth-shell">
      <header className="auth-topbar">
        <div className="brand-lockup" style={{ padding: 0 }}>
          <div className="brand-mark">s</div>
          <div>
            <div className="brand-name">sizeok<span>.</span></div>
            <div className="brand-caption">YOUR PERSONAL FIT</div>
          </div>
        </div>
        <button
          className="icon-button bordered"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={onToggleTheme}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
      </header>

      <main className="auth-main">
        <div className="auth-layout">
          <section className="auth-editorial">
            <div className="hero-kicker">ONE PROFILE · EVERY STORE</div>
            <h1>Shop any brand knowing your size will fit.</h1>
            <p>
              Save body measurements and reference sizes for yourself and your family. Get deterministic, explainable
              size recommendations across Zara, H&amp;M, Nike, Levi&apos;s, and more.
            </p>
            <div className="auth-highlights">
              <div className="auth-highlight-item">
                <div className="notice-symbol"><Icon name="ruler" size={16} /></div>
                <div>
                  <strong>Versioned body &amp; garment fit engine</strong>
                  <span>Compares your exact measurements against verified brand charts.</span>
                </div>
              </div>
              <div className="auth-highlight-item">
                <div className="notice-symbol"><Icon name="users" size={16} /></div>
                <div>
                  <strong>Household profiles in one account</strong>
                  <span>Switch between your own fit profile, partner, or kids anytime.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="auth-card">
            <div className="eyebrow">WELCOME TO SIZEOK</div>
            <h2>{authMode === 'login' ? 'Sign in to your workspace' : 'Create your sizeok account'}</h2>
            <p className="card-subcopy">
              {authMode === 'login'
                ? 'Continue with Google, Apple, GitHub, or your email and password.'
                : 'Start with a third-party account or register with your email.'}
            </p>

            <div className="oauth-buttons">
              <button
                type="button"
                className={`oauth-button ${selectedOAuthProvider === 'GOOGLE' ? 'active' : ''}`}
                disabled={isSubmitting}
                onClick={() => selectProvider('GOOGLE')}
              >
                <ProviderLogo provider="GOOGLE" />
                <span>Continue with Google</span>
              </button>
              <div className="oauth-row-two">
                <button
                  type="button"
                  className={`oauth-button ${selectedOAuthProvider === 'APPLE' ? 'active' : ''}`}
                  disabled={isSubmitting}
                  onClick={() => selectProvider('APPLE')}
                >
                  <ProviderLogo provider="APPLE" />
                  <span>Continue with Apple</span>
                </button>
                <button
                  type="button"
                  className={`oauth-button ${selectedOAuthProvider === 'GITHUB' ? 'active' : ''}`}
                  disabled={isSubmitting}
                  onClick={() => selectProvider('GITHUB')}
                >
                  <ProviderLogo provider="GITHUB" />
                  <span>Continue with GitHub</span>
                </button>
              </div>
            </div>
            {selectedOAuthProvider && (
              <div className="oauth-provider-box">
                <div className="oauth-box-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ProviderLogo provider={selectedOAuthProvider} size={16} />
                    <strong>Continue with {selectedOAuthProvider.charAt(0) + selectedOAuthProvider.slice(1).toLowerCase()}</strong>
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    style={{ width: 26, height: 26 }}
                    onClick={() => onSelectOAuthProvider(null)}
                    aria-label="Close provider box"
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>
                <div className="oauth-preset-list">
                  {OAUTH_PRESET_ACCOUNTS[selectedOAuthProvider].map(acct => (
                    <button
                      key={acct.email}
                      type="button"
                      className="oauth-preset-item"
                      disabled={isSubmitting}
                      onClick={() => onSubmitOAuth(selectedOAuthProvider, acct.email, acct.name)}
                    >
                      <div className="avatar avatar-mint">{acct.name.slice(0, 2).toUpperCase()}</div>
                      <div>
                        <strong>{acct.name}</strong>
                        <small>{acct.email} · {acct.subtitle}</small>
                      </div>
                      <Icon name="arrow" size={14} />
                    </button>
                  ))}
                </div>
                <div className="oauth-custom-fields">
                  <div className="form-field">
                    <label>{selectedOAuthProvider} EMAIL</label>
                    <input
                      type="email"
                      value={oauthEmail}
                      onChange={e => onOAuthEmailChange(e.target.value)}
                      placeholder="your.name@gmail.com"
                    />
                  </div>
                  <div className="form-field">
                    <label>DISPLAY NAME</label>
                    <input
                      value={oauthName}
                      onChange={e => onOAuthNameChange(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="primary-button"
                  style={{ width: '100%', marginTop: 10 }}
                  disabled={isSubmitting}
                  onClick={() => onSubmitOAuth(selectedOAuthProvider, oauthEmail, oauthName)}
                >
                  {isSubmitting ? 'Authenticating…' : `Continue as ${oauthName || oauthEmail || selectedOAuthProvider}`}
                  <Icon name="arrow" size={15} />
                </button>
              </div>
            )}
            <div className="auth-divider"><span>OR USE EMAIL</span></div>

            <div className="mode-switch" style={{ margin: '0 0 16px' }}>
              <button type="button" className={authMode === 'login' ? 'selected' : ''} onClick={() => onModeChange('login')}>
                Sign in
              </button>
              <button type="button" className={authMode === 'register' ? 'selected' : ''} onClick={() => onModeChange('register')}>
                Create account
              </button>
            </div>

            <div className="modal-form">
              {authMode === 'register' && (
                <div className="form-field full">
                  <label>FULL NAME</label>
                  <input value={name} onChange={e => onNameChange(e.target.value)} placeholder="e.g. Rishabh Gautam" />
                </div>
              )}
              <div className="form-field full">
                <label>EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => onEmailChange(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="form-field full">
                <label>PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => onPasswordChange(e.target.value)}
                  placeholder={authMode === 'register' ? 'Create a password (min 6 characters)' : 'Enter your password'}
                  onKeyDown={e => e.key === 'Enter' && onSubmitCredentials()}
                />
              </div>
              {authMode === 'register' && (
                <>
                  <div className="form-field">
                    <label>PREFERRED UNIT</label>
                    <select value={preferredUnit} onChange={e => onUnitChange(e.target.value as 'CM' | 'IN')}>
                      <option value="CM">Centimetres (cm)</option>
                      <option value="IN">Inches (in)</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>DEFAULT REGION</label>
                    <select value={region} onChange={e => onRegionChange(e.target.value)}>
                      <option value="IN">India (IN)</option>
                      <option value="EU">Europe (EU)</option>
                      <option value="US">United States (US)</option>
                      <option value="UK">United Kingdom (UK)</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              className="primary-button"
              style={{ width: '100%', height: 42, marginTop: 18 }}
              disabled={isSubmitting}
              onClick={onSubmitCredentials}
            >
              {isSubmitting
                ? 'Connecting to sizeok…'
                : authMode === 'login'
                  ? 'Sign in with credentials'
                  : 'Create account'}
              <Icon name="arrow" size={16} />
            </button>
          </section>
        </div>
      </main>
    </div>
  )
}


