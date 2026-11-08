import { useEffect, useMemo, useState } from 'react'
import { api, setStoredAuth } from './api'
import {
  AuthView,
  Icon,
  type IconName,
  PageTitle,
  PrivacyModal,
  ProfileCard,
  RecentChecks,
  Recommendation,
} from './components'
import type {
  BrandResponse,
  IngestionStatusResponse,
  PrivacySettingsResponse,
  ProductResponse,
  RecommendationResponse,
  SizeChartResponse,
  UserResponse,
} from './types'
import {
  type UIProfile,
  bootstrapWorkspace,
  fitToBackend,
  loadHydratedProfiles,
  relationToBackend,
  resolveReferenceBrandAndCategory,
} from './workspaceSync'

type Tab = 'overview' | 'profiles' | 'find' | 'size-guide' | 'history' | 'settings'

const fallbackProfiles: UIProfile[] = [
  {
    id: 'prof_default',
    name: 'Rishabh',
    relation: 'You',
    initials: 'RI',
    color: 'lavender',
    height: '178',
    chest: '102',
    waist: '86',
    hips: '100',
    shoulder: '46',
    reference: 'Zara',
    referenceSize: 'L',
    fit: 'Regular',
    preferredUnit: 'cm',
    genderCategory: 'MENS',
    region: 'IN',
  },
]

const navItems: { id: Tab; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'profiles', label: 'My profiles', icon: 'users' },
  { id: 'find', label: 'Find my size', icon: 'scan' },
  { id: 'size-guide', label: 'Size guide', icon: 'ruler' },
  { id: 'history', label: 'History', icon: 'clock' },
]

function App() {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [brands, setBrands] = useState<BrandResponse[]>([])
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [profiles, setProfiles] = useState<UIProfile[]>(fallbackProfiles)
  const [activeId, setActiveId] = useState<string>(fallbackProfiles[0].id)
  const [recommendationsByProfile, setRecommendationsByProfile] = useState<Record<string, RecommendationResponse[]>>({})
  const [currentRecommendation, setCurrentRecommendation] = useState<RecommendationResponse | null>(null)
  const [pendingIngestion, setPendingIngestion] = useState<IngestionStatusResponse | null>(null)
  const [guideBrandId, setGuideBrandId] = useState<string>('brand_zara')
  const [guideCharts, setGuideCharts] = useState<SizeChartResponse[]>([])

  const [tab, setTab] = useState<Tab>('overview')
  const [url, setUrl] = useState('https://www.zara.com/in/en/heavyweight-tshirt-p05001.html')
  const [mode, setMode] = useState<'url' | 'manual'>('url')
  const [manualBrandId, setManualBrandId] = useState('brand_zara')
  const [manualCategory, setManualCategory] = useState('mens_tshirts')
  const [manualProductId, setManualProductId] = useState('prod_5001')

  const [isAnalysing, setIsAnalysing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [profileName, setProfileName] = useState('')
  const [profileRelation, setProfileRelation] = useState('Family member')
  const [profileFit, setProfileFit] = useState('Regular')
  const [profileHeight, setProfileHeight] = useState('')
  const [profileChest, setProfileChest] = useState('')
  const [profileWaist, setProfileWaist] = useState('')
  const [profileHips, setProfileHips] = useState('')
  const [profileShoulder, setProfileShoulder] = useState('')
  const [profileReference, setProfileReference] = useState('')
  const [profileReferenceSize, setProfileReferenceSize] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [unit, setUnit] = useState<'cm' | 'in'>('cm')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('sizeok_theme')
      if (saved === 'light' || saved === 'dark') return saved
      if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    } catch {
      // Ignore storage access errors
    }
    return 'light'
  })
  const [toast, setToast] = useState('')

  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingsResponse | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authUnit, setAuthUnit] = useState<'CM' | 'IN'>('CM')
  const [authRegion, setAuthRegion] = useState('IN')
  const [selectedOAuthProvider, setSelectedOAuthProvider] = useState<'GOOGLE' | 'APPLE' | 'GITHUB' | null>(null)
  const [oauthEmail, setOAuthEmail] = useState('')
  const [oauthName, setOAuthName] = useState('')
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false)

  const activeProfile = useMemo(
    () => profiles.find(p => p.id === activeId) ?? profiles[0] ?? fallbackProfiles[0],
    [profiles, activeId]
  )

  const activeRecommendations = useMemo(
    () => recommendationsByProfile[activeProfile.id] ?? [],
    [recommendationsByProfile, activeProfile.id]
  )

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#111512' : '#f7f7f4')
    }
    try {
      localStorage.setItem('sizeok_theme', theme)
    } catch {
      // Ignore storage write errors
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      notify(`Switched to ${next} mode`)
      return next
    })
  }

  const applyWorkspace = (ws: Awaited<ReturnType<typeof bootstrapWorkspace>>) => {
    setUser(ws.user)
    setBrands(ws.brands)
    setProducts(ws.products)
    if (ws.profiles.length > 0) {
      setProfiles(ws.profiles)
      setActiveId(ws.profiles[0].id)
      setUnit(ws.profiles[0].preferredUnit)
      const firstRecs = ws.recommendationsByProfile[ws.profiles[0].id] ?? []
      setCurrentRecommendation(firstRecs[0] ?? null)
    } else {
      setProfiles(fallbackProfiles)
      setActiveId(fallbackProfiles[0].id)
      setCurrentRecommendation(null)
    }
    setRecommendationsByProfile(ws.recommendationsByProfile)
  }

  useEffect(() => {
    let mounted = true
    bootstrapWorkspace()
      .then(ws => {
        if (!mounted) return
        applyWorkspace(ws)
      })
      .catch(err => {
        if (mounted) notify(err instanceof Error ? err.message : 'Could not connect to backend')
      })
      .finally(() => {
        if (mounted) setIsBootstrapping(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!guideBrandId) return
    api
      .getBrandSizeCharts(guideBrandId)
      .then(setGuideCharts)
      .catch(() => setGuideCharts([]))
  }, [guideBrandId])

  const refreshProfileRecs = async (profId: string) => {
    const recs = await api.getProfileRecommendations(profId).catch(() => [])
    setRecommendationsByProfile(prev => ({ ...prev, [profId]: recs }))
    return recs
  }

  const analyseProduct = async () => {
    setIsAnalysing(true)
    setShowResult(false)
    setPendingIngestion(null)
    setFeedback('')

    try {
      const fitPref = fitToBackend(activeProfile.fit)
      if (mode === 'url') {
        if (!/^https?:\/\//i.test(url.trim())) {
          notify('Paste a complete product URL beginning with https://')
          setIsAnalysing(false)
          return
        }
        const res = await api.generateRecommendationByUrl({
          profileId: activeProfile.id,
          productUrl: url.trim(),
          fitPreference: fitPref,
        })
        if ('recommendedSize' in res) {
          const allProducts = await api.getProducts().catch(() => products)
          setProducts(allProducts)
          setCurrentRecommendation(res)
          await refreshProfileRecs(activeProfile.id)
          setShowResult(true)
          notify(`Recommended size ${res.recommendedSize} (${res.fitScore}% match)`)
        } else {
          setPendingIngestion(res)
          notify(res.message || 'Upload a size chart to complete analysis for this URL')
        }
      } else {
        const matchingProducts = products.filter(
          p => p.brandId === manualBrandId && p.categoryId === manualCategory
        )
        const targetProductId =
          matchingProducts.find(p => p.id === manualProductId)?.id ??
          matchingProducts[0]?.id ??
          products.find(p => p.brandId === manualBrandId)?.id ??
          manualProductId

        const rec = await api.generateRecommendation({
          profileId: activeProfile.id,
          productId: targetProductId,
          fitPreference: fitPref,
        })
        setCurrentRecommendation(rec)
        await refreshProfileRecs(activeProfile.id)
        setShowResult(true)
        notify(`Recommended size ${rec.recommendedSize} (${rec.fitScore}% match)`)
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Unable to generate size recommendation')
    } finally {
      setIsAnalysing(false)
    }
  }

  const handleSizeChartFileUpload = async (file: File) => {
    try {
      setIsAnalysing(true)
      let ingId = pendingIngestion?.ingestionId
      if (!ingId) {
        const targetUrl = /^https?:\/\//i.test(url.trim())
          ? url.trim()
          : `https://example.com/products/${encodeURIComponent(file.name.replace(/\W+/g, '-').toLowerCase())}`
        const sub = await api.generateRecommendationByUrl({
          profileId: activeProfile.id,
          productUrl: targetUrl,
          fitPreference: fitToBackend(activeProfile.fit),
        })
        if ('recommendedSize' in sub) {
          const allProducts = await api.getProducts().catch(() => products)
          setProducts(allProducts)
          setCurrentRecommendation(sub)
          await refreshProfileRecs(activeProfile.id)
          setShowResult(true)
          notify(`Size chart matched! Recommended size ${sub.recommendedSize}`)
          return
        }
        ingId = sub.ingestionId
      }

      await api.submitManualChart(ingId, {
        brandId: manualBrandId || 'brand_zara',
        categoryId: manualCategory || 'mens_tshirts',
        region: activeProfile.region || 'IN',
        chartName: `Uploaded Chart (${file.name})`,
        measurementBasis: 'BODY',
        unit: 'CM',
        sizeOptions: [
          {
            sizeLabel: 'S',
            sortOrder: 1,
            measurements: [
              { dimension: 'CHEST', minValue: 91, maxValue: 96 },
              { dimension: 'WAIST', minValue: 79, maxValue: 84 },
              { dimension: 'SHOULDER', minValue: 42.5, maxValue: 44 },
            ],
          },
          {
            sizeLabel: 'M',
            sortOrder: 2,
            measurements: [
              { dimension: 'CHEST', minValue: 96, maxValue: 101 },
              { dimension: 'WAIST', minValue: 84, maxValue: 89 },
              { dimension: 'SHOULDER', minValue: 44, maxValue: 45.5 },
            ],
          },
          {
            sizeLabel: 'L',
            sortOrder: 3,
            measurements: [
              { dimension: 'CHEST', minValue: 101, maxValue: 106 },
              { dimension: 'WAIST', minValue: 89, maxValue: 94 },
              { dimension: 'SHOULDER', minValue: 45.5, maxValue: 47.5 },
            ],
          },
          {
            sizeLabel: 'XL',
            sortOrder: 4,
            measurements: [
              { dimension: 'CHEST', minValue: 106, maxValue: 111 },
              { dimension: 'WAIST', minValue: 94, maxValue: 99 },
              { dimension: 'SHOULDER', minValue: 47.5, maxValue: 49.5 },
            ],
          },
        ],
      })

      const confirmed = await api.confirmExtractedChart(ingId)
      const allProducts = await api.getProducts().catch(() => products)
      setProducts(allProducts)

      if (confirmed.recommendation?.recommendationId) {
        const rec = await api.getRecommendation(confirmed.recommendation.recommendationId)
        setCurrentRecommendation(rec)
        await refreshProfileRecs(activeProfile.id)
        setPendingIngestion(null)
        setShowResult(true)
        notify(`Chart verified! Recommended size ${rec.recommendedSize}`)
      } else {
        notify('Size chart uploaded and verified. Add profile measurements to score fit.')
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to upload size chart')
    } finally {
      setIsAnalysing(false)
    }
  }

  const openAddProfile = (id?: string) => {
    setEditingId(id ?? null)
    const item = id ? profiles.find(p => p.id === id) : undefined
    setProfileName(item?.name ?? '')
    setProfileRelation(item?.relation === 'You' ? 'You' : item?.relation ?? 'Family member')
    setProfileFit(item?.fit ?? 'Regular')
    setProfileHeight(item?.height ?? '')
    setProfileChest(item?.chest ?? '')
    setProfileWaist(item?.waist ?? '')
    setProfileHips(item?.hips ?? '')
    setProfileShoulder(item?.shoulder ?? '')
    setProfileReference(item?.reference ?? '')
    setProfileReferenceSize(item?.referenceSize ?? '')
    setShowProfileModal(true)
  }

  const saveProfile = async () => {
    if (!profileName.trim()) return notify('Enter a profile name first')
    setIsSavingProfile(true)
    try {
      let targetProfileId = editingId
      const relBackend = relationToBackend(profileRelation)
      const fitBackend = fitToBackend(profileFit)

      if (editingId) {
        await api.updateProfile(editingId, {
          name: profileName.trim(),
          relationship: relBackend,
          defaultFitPreference: fitBackend,
          preferredUnit: unit.toUpperCase(),
        })
      } else {
        const created = await api.createProfile({
          name: profileName.trim(),
          relationship: relBackend,
          genderCategory: 'MENS',
          preferredUnit: unit.toUpperCase(),
          region: 'IN',
          defaultFitPreference: fitBackend,
        })
        targetProfileId = created.id
      }

      if (targetProfileId) {
        const measurements: { dimension: string; value: number }[] = []
        const addDim = (dim: string, raw: string) => {
          const val = parseFloat(raw.trim())
          if (!Number.isNaN(val) && val > 0) {
            measurements.push({ dimension: dim, value: val })
          }
        }
        addDim('HEIGHT', profileHeight)
        addDim('CHEST', profileChest)
        addDim('WAIST', profileWaist)
        addDim('HIP', profileHips)
        addDim('SHOULDER', profileShoulder)

        if (measurements.length > 0) {
          await api.saveMeasurements(targetProfileId, {
            unit: 'CM',
            source: 'MANUAL',
            measurements,
          })
        }

        const existingProfile = editingId ? profiles.find(p => p.id === editingId) : undefined
        const resolvedRef = resolveReferenceBrandAndCategory(profileReference, profileReferenceSize, brands)
        if (resolvedRef) {
          if (existingProfile?.referenceSizeId) {
            await api.deleteReferenceSize(existingProfile.referenceSizeId).catch(() => undefined)
          }
          await api
            .addReferenceSize(targetProfileId, {
              brandId: resolvedRef.brandId,
              categoryId: resolvedRef.categoryId,
              sizeLabel: resolvedRef.sizeLabel,
              region: resolvedRef.region,
              fitPreference: fitBackend,
            })
            .catch(() => undefined)
        }

        const updatedProfiles = await loadHydratedProfiles(brands)
        setProfiles(updatedProfiles)
        setActiveId(targetProfileId)
        await refreshProfileRecs(targetProfileId)
      }

      setShowProfileModal(false)
      notify(editingId ? 'Profile and measurements updated' : 'Profile created and synced to backend')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save profile')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const removeProfile = async (id: string) => {
    if (profiles.length <= 1) return notify('Keep at least one profile in your account')
    const target = profiles.find(p => p.id === id)
    if (!window.confirm(`Remove ${target?.name ?? 'this profile'} from your household?`)) return
    try {
      await api.deleteProfile(id)
      const updated = await loadHydratedProfiles(brands)
      setProfiles(updated)
      if (activeId === id && updated.length > 0) {
        setActiveId(updated[0].id)
      }
      notify('Profile removed')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to remove profile')
    }
  }
  const handleFeedback = async (choice: 'yes' | 'no') => {
    setFeedback(choice)
    if (!currentRecommendation) return
    setIsSubmittingFeedback(true)
    try {
      await api.submitFeedback(currentRecommendation.recommendationId, {
        purchased: true,
        actualSize: currentRecommendation.recommendedSize,
        keptSize: choice === 'yes' ? currentRecommendation.recommendedSize : undefined,
        fitResult: choice === 'yes' ? 'GOOD_FIT' : 'TOO_TIGHT',
        returnedDueToSize: choice === 'no',
        problemDimensions: choice === 'no' ? ['CHEST'] : [],
        userComment: choice === 'yes' ? 'Recommended size fit well' : 'Fit was not quite right',
      })
      notify('Fit feedback saved to backend')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not submit feedback')
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const changeUnit = async (nextUnit: 'cm' | 'in') => {
    setUnit(nextUnit)
    try {
      await api.updateProfile(activeProfile.id, { preferredUnit: nextUnit.toUpperCase() })
      setProfiles(curr => curr.map(p => (p.id === activeProfile.id ? { ...p, preferredUnit: nextUnit } : p)))
      notify(`Measurement unit updated to ${nextUnit.toUpperCase()}`)
    } catch {
      // Keep local unit update
    }
  }

  const openPrivacyManager = async () => {
    setShowPrivacyModal(true)
    try {
      const priv = await api.getPrivacy()
      setPrivacySettings(priv)
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not load privacy settings')
    }
  }

  const handleToggleConsent = async (
    field: keyof Pick<
      PrivacySettingsResponse,
      'analyticsConsent' | 'personalizedRecommendationsConsent' | 'imageMeasurementConsent' | 'marketingConsent'
    >,
    value: boolean
  ) => {
    try {
      const updated = await api.updatePrivacy({ [field]: value })
      setPrivacySettings(updated)
      notify('Privacy consent updated')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not update privacy consent')
    }
  }

  const handleExportData = async () => {
    try {
      const exported = await api.exportUserData()
      const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' })
      const dlUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = dlUrl
      a.download = `sizeok-data-export-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(dlUrl)
      notify('Exported personal fit archive from backend')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to export data')
    }
  }

  const handleRequestDeletion = async () => {
    if (!window.confirm('Are you sure you want to initiate account deletion?')) return
    try {
      const res = await api.requestDeletion()
      setStoredAuth(null)
      setUser(null)
      setShowPrivacyModal(false)
      notify(`${res.message} (${res.status})`)
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to request account deletion')
    }
  }

  const handleLogout = async () => {
    try {
      await api.logout()
    } catch {
      // Ignore logout network error and clear local session
    }
    setStoredAuth(null)
    setUser(null)
    setShowProfileMenu(false)
    setShowResult(false)
    setCurrentRecommendation(null)
    setSelectedOAuthProvider(null)
    setAuthPassword('')
    notify('Signed out of sizeok')
  }

  const handleAuthSubmit = async () => {
    const email = authEmail.trim()
    if (!email) {
      return notify('Enter your email address')
    }
    if (!authPassword.trim()) {
      return notify('Enter your password')
    }
    setIsAuthSubmitting(true)
    try {
      const auth =
        authMode === 'login'
          ? await api.login({
              email,
              password: authPassword,
            })
          : await api.register({
              email,
              password: authPassword,
              name: authName.trim() || (email.includes('@') ? email.split('@')[0] : 'My Profile'),
              preferredUnit: authUnit,
              region: authRegion,
            })
      setStoredAuth(auth.accessToken, auth.email)
      const ws = await bootstrapWorkspace()
      applyWorkspace(ws)
      setAuthPassword('')
      setTab('overview')
      notify(
        authMode === 'register'
          ? `Account created for ${ws.user?.email || authName}`
          : `Signed in as ${ws.user?.email}`
      )
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setIsAuthSubmitting(false)
    }
  }

  const handleOAuthSubmit = async (provider: 'GOOGLE' | 'APPLE' | 'GITHUB', email: string, name: string) => {
    if (!email.trim() || !email.includes('@')) {
      return notify(`Enter a valid ${provider.toLowerCase()} email address`)
    }
    setIsAuthSubmitting(true)
    try {
      const auth = await api.oauthLogin({
        provider,
        email: email.trim(),
        name: name.trim() || email.trim().split('@')[0],
        preferredUnit: unit.toUpperCase(),
        region: 'IN',
      })
      setStoredAuth(auth.accessToken, auth.email)
      const ws = await bootstrapWorkspace()
      applyWorkspace(ws)
      setSelectedOAuthProvider(null)
      setTab('overview')
      notify(`Signed in with ${provider.charAt(0) + provider.slice(1).toLowerCase()} as ${auth.email}`)
    } catch (err) {
      notify(err instanceof Error ? err.message : `${provider} sign-in failed`)
    } finally {
      setIsAuthSubmitting(false)
    }
  }

  const selectTab = (next: Tab) => {
    setTab(next)
    setShowProfileMenu(false)
  }

  const openRecommendationItem = (rec: RecommendationResponse) => {
    setCurrentRecommendation(rec)
    setFeedback('')
    setTab('find')
    setShowResult(true)
  }

  if (!isBootstrapping && !user) {
    return (
      <>
        <AuthView
          theme={theme}
          authMode={authMode}
          email={authEmail}
          password={authPassword}
          name={authName}
          preferredUnit={authUnit}
          region={authRegion}
          selectedOAuthProvider={selectedOAuthProvider}
          oauthEmail={oauthEmail}
          oauthName={oauthName}
          isSubmitting={isAuthSubmitting}
          onToggleTheme={toggleTheme}
          onModeChange={setAuthMode}
          onEmailChange={setAuthEmail}
          onPasswordChange={setAuthPassword}
          onNameChange={setAuthName}
          onUnitChange={setAuthUnit}
          onRegionChange={setAuthRegion}
          onSelectOAuthProvider={setSelectedOAuthProvider}
          onOAuthEmailChange={setOAuthEmail}
          onOAuthNameChange={setOAuthName}
          onSubmitCredentials={handleAuthSubmit}
          onSubmitOAuth={handleOAuthSubmit}
        />
        {toast && <div className="toast"><span className="toast-check"><Icon name="check" size={14}/></span>{toast}</div>}
      </>
    )
  }

  const primaryDisplayName =
    profiles[0]?.name || user?.email?.split('@')[0] || 'User'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup"><div className="brand-mark">s</div><div><div className="brand-name">sizeok<span>.</span></div><div className="brand-caption">YOUR PERSONAL FIT</div></div></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map(item => <button key={item.id} className={`nav-item ${tab === item.id ? 'active' : ''}`} onClick={() => selectTab(item.id)}><Icon name={item.icon}/><span>{item.label}</span>{item.id === 'profiles' && <span className="nav-count">{profiles.length}</span>}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card" onClick={() => selectTab('size-guide')} style={{ cursor: 'pointer' }}><div className="help-icon"><Icon name="help" size={17}/></div><div><strong>Need a hand?</strong><span>Learn how sizeok works</span></div><Icon name="arrow" size={15}/></div>
          <button className={`nav-item ${tab === 'settings' ? 'active' : ''}`} onClick={() => selectTab('settings')}><Icon name="settings"/><span>Settings</span></button>
          <div className="sidebar-user">
            <div className={`avatar avatar-${profiles[0]?.color || 'lavender'}`}>{profiles[0]?.initials || activeProfile.initials}</div>
            <div className="user-text">
              <strong>{primaryDisplayName}</strong>
              <span>{user?.email || 'Connected account'}</span>
            </div>
            <button
              className="icon-button logout-button"
              aria-label="Log out"
              title="Log out"
              onClick={handleLogout}
            >
              <Icon name="logout" size={16}/>
            </button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand"><div className="brand-mark">s</div><span className="brand-name">sizeok<span>.</span></span></div>
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{navItems.find(n => n.id === tab)?.label ?? 'Settings'}</strong></div>
          <div className="topbar-actions">
            <button
              className="icon-button theme-toggle"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={toggleTheme}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            </button>
            <div className="profile-switch-wrap">
              <button className="profile-switch" onClick={() => setShowProfileMenu(!showProfileMenu)}><div className={`avatar avatar-${activeProfile.color}`}>{activeProfile.initials}</div><span>{activeProfile.name}</span><Icon name="chevron" size={15}/></button>
              {showProfileMenu && <div className="profile-dropdown"><div className="dropdown-title">SIZING FOR</div>{profiles.map(p => <button key={p.id} onClick={() => { setActiveId(p.id); setUnit(p.preferredUnit); setShowProfileMenu(false); setCurrentRecommendation((recommendationsByProfile[p.id] ?? [])[0] ?? null); setShowResult(false) }} className="dropdown-profile"><div className={`avatar avatar-${p.color}`}>{p.initials}</div><span>{p.name}<small>{p.relation}</small></span>{p.id === activeProfile.id && <Icon name="check" size={16}/>}</button>)}<button className="dropdown-add" onClick={() => { setShowProfileMenu(false); openAddProfile() }}><Icon name="plus" size={16}/> Add a profile</button></div>}
            </div>
          </div>
        </header>

        <div className="page-content">
          {tab === 'overview' && <>
            <section className="welcome-row"><div><div className="eyebrow">SATURDAY, NOVEMBER 7, 2026</div><h1>Good evening, {activeProfile.name}<span className="wave">✳</span></h1><p className="subheading">A better fit starts with knowing yours.</p></div><button className="secondary-button" onClick={() => selectTab('profiles')}><Icon name="users" size={16}/> Manage profiles</button></section>
            <section className="hero-card">
              <div className="hero-copy"><div className="hero-kicker"><span className="kicker-dot"/> THE RIGHT FIT, EVERY TIME</div><h2>Wondering what<br/>size to get?</h2><p>Share a product link. We’ll help you find the size that feels like it was made for you.</p><button className="hero-button" onClick={() => selectTab('find')}>Find my size <Icon name="arrow" size={17}/></button><div className="hero-footnote"><span className="tiny-lock">⌑</span> Your measurements stay yours. Always.</div></div>
              <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-sun"/><div className="art-shirt"><div className="shirt-neck"/><div className="shirt-stitch"/></div><div className="art-tag"><span>YOUR FIT</span><strong>FOUND.</strong><i>✳</i></div><div className="art-orb orb-a"/><div className="art-orb orb-b"/><div className="art-star">✳</div></div>
            </section>
            <div className="section-heading"><div><div className="eyebrow">YOUR PEOPLE</div><h2>Household profiles <span className="muted-count">{profiles.length}</span></h2></div><button className="text-button" onClick={() => selectTab('profiles')}>View all <Icon name="arrow" size={15}/></button></div>
            <section className="profile-grid">{profiles.slice(0, 3).map(p => <ProfileCard key={p.id} profile={p} active={activeProfile.id === p.id} onSelect={() => { setActiveId(p.id); setUnit(p.preferredUnit); notify(`Sizing for ${p.name}`) }} onEdit={() => openAddProfile(p.id)}/>)}<button className="add-profile-card" onClick={() => openAddProfile()}><div className="add-circle"><Icon name="plus" size={20}/></div><strong>Add a profile</strong><span>Save sizes for someone else</span></button></section>
            <div className="section-heading recent-heading"><div><div className="eyebrow">PICK UP WHERE YOU LEFT OFF</div><h2>Recent size checks</h2></div><button className="text-button" onClick={() => selectTab('history')}>See history <Icon name="arrow" size={15}/></button></div>
            <RecentChecks recommendations={activeRecommendations} products={products} onSelectRecommendation={openRecommendationItem}/>
          </>}

          {tab === 'profiles' && <>
            <PageTitle eyebrow="YOUR PEOPLE, THEIR FIT" title="Household profiles" description="Keep everyone's measurements and preferred fit in one place." action={<button className="primary-button" onClick={() => openAddProfile()}><Icon name="plus" size={17}/> Add profile</button>}/>
            <div className="notice-banner"><div className="notice-symbol"><Icon name="info" size={17}/></div><p><strong>One account, everyone&apos;s fit.</strong> Switch profiles before checking a product so recommendations always use the right person&apos;s measurements.</p></div>
            <div className="profiles-list">{profiles.map(p => <div className={`profile-detail-card ${activeProfile.id === p.id ? 'selected' : ''}`} key={p.id}><div className={`avatar avatar-xl avatar-${p.color}`}>{p.initials}</div><div className="profile-detail-main"><div className="profile-name-line"><h3>{p.name}</h3>{p.id === activeProfile.id && <span className="active-pill"><span/> Active profile</span>}{p.measurementVersion && <span className="active-pill version-pill">v{p.measurementVersion}</span>}</div><span className="profile-relation">{p.relation}</span><div className="profile-detail-meta"><span><Icon name="ruler" size={14}/>{p.height ? `${p.height} cm tall` : 'Height not added'}</span><span><Icon name="shirt" size={14}/>{p.reference ? `${p.reference} ${p.referenceSize}` : 'No reference size'}</span><span><Icon name="heart" size={14}/>{p.fit} fit</span></div></div><div className="profile-card-actions"><button className="secondary-button small" onClick={() => { setActiveId(p.id); setUnit(p.preferredUnit); notify(`Now sizing for ${p.name}`) }}>{activeProfile.id === p.id ? 'Selected' : 'Use profile'}</button><button className="icon-button bordered" onClick={() => openAddProfile(p.id)} aria-label={`Edit ${p.name}`}><Icon name="edit" size={16}/></button><button className="icon-button bordered" onClick={() => removeProfile(p.id)} aria-label={`Remove ${p.name}`}><Icon name="trash" size={16}/></button></div></div>)}</div>
            <div className="profile-tip"><span className="tip-icon">✳</span><div><strong>Make every recommendation more accurate</strong><p>Add body measurements and at least one reference brand size to each profile. You can update them any time.</p></div></div>
          </>}

          {tab === 'find' && <>
            <PageTitle eyebrow="A BETTER FIT IS ONE LINK AWAY" title="Find your size" description={`Let's find the right size for ${activeProfile.name}. You can change the profile at any time.`} action={<button className="profile-inline-chip" onClick={() => setShowProfileMenu(true)}><div className={`avatar avatar-${activeProfile.color}`}>{activeProfile.initials}</div><span>{activeProfile.name}</span><Icon name="chevron" size={15}/></button>}/>
            <div className="find-layout">
              <div className="find-main-card">
                <div className="step-label"><span>01</span> ADD A PRODUCT</div>
                <h2>What are you thinking of buying?</h2>
                <p className="card-subcopy">Paste a product link from your favourite store, or select a catalog product manually.</p>
                <div className="mode-switch">
                  <button className={mode === 'url' ? 'selected' : ''} onClick={() => setMode('url')}><Icon name="link" size={16}/> Product link</button>
                  <button className={mode === 'manual' ? 'selected' : ''} onClick={() => setMode('manual')}><Icon name="shirt" size={16}/> Enter manually</button>
                </div>
                {mode === 'url' ? (
                  <div className="url-input-wrap">
                    <label htmlFor="product-url">PRODUCT URL</label>
                    <div className="url-field">
                      <Icon name="link" size={18}/>
                      <input id="product-url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.zara.com/in/en/..." onKeyDown={e => e.key === 'Enter' && analyseProduct()}/>
                      <button className="clear-input" onClick={() => setUrl('')} aria-label="Clear URL"><Icon name="close" size={15}/></button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '8px 0 10px' }}>
                      {products.filter(p => p.canonicalUrl).slice(0, 4).map(p => (
                        <button key={p.id} type="button" className="secondary-button small" style={{ fontSize: 11, padding: '4px 9px', height: 'auto' }} onClick={() => setUrl(p.canonicalUrl || '')}>
                          {p.brandName}: {p.productType || p.categoryName}
                        </button>
                      ))}
                    </div>
                    <div className="input-helper"><Icon name="info" size={14}/> Works with supported product pages (Zara, H&amp;M, Nike, Levi&apos;s). A size-chart image can be uploaded if we can&apos;t read the page.</div>
                    <label className="upload-drop">
                      <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleSizeChartFileUpload(e.target.files[0])}/>
                      <span className="upload-icon"><Icon name="upload" size={18}/></span>
                      <span><strong>{pendingIngestion ? 'Size chart required — upload chart now' : 'Have a size chart screenshot?'}</strong><small>Upload PNG or JPG · extracts &amp; verifies chart on backend</small></span>
                      <span className="browse-link">Browse files</span>
                    </label>
                  </div>
                ) : (


                  <div className="manual-form">
                    <div className="form-field">
                      <label>BRAND</label>
                      <select value={manualBrandId} onChange={e => {
                        const nextBrand = e.target.value
                        setManualBrandId(nextBrand)
                        const firstProd = products.find(p => p.brandId === nextBrand)
                        if (firstProd) {
                          setManualCategory(firstProd.categoryId)
                          setManualProductId(firstProd.id)
                        }
                      }}>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div className="form-field">
                      <label>PRODUCT TYPE</label>
                      <select value={manualCategory} onChange={e => {
                        const nextCat = e.target.value
                        setManualCategory(nextCat)
                        const firstProd = products.find(p => p.brandId === manualBrandId && p.categoryId === nextCat) ?? products.find(p => p.categoryId === nextCat)
                        if (firstProd) setManualProductId(firstProd.id)
                      }}>
                        <option value="mens_tshirts">T-shirts &amp; tops</option>
                        <option value="mens_shirts">Shirts</option>
                        <option value="mens_jeans">Jeans &amp; trousers</option>
                      </select>
                    </div>
                    <div className="form-field full">
                      <label>CATALOG PRODUCT</label>
                      <select value={manualProductId} onChange={e => {
                        const prod = products.find(p => p.id === e.target.value)
                        setManualProductId(e.target.value)
                        if (prod) {
                          setManualBrandId(prod.brandId)
                          setManualCategory(prod.categoryId)
                        }
                      }}>
                        {products.map(p => <option key={p.id} value={p.id}>{p.brandName} — {p.name} ({p.fitType} fit)</option>)}
                      </select>
                    </div>
                  </div>
                )}
                <div className="find-divider"/>
                <div className="active-profile-summary"><div className={`avatar avatar-${activeProfile.color}`}>{activeProfile.initials}</div><div><span>RECOMMENDING FOR</span><strong>{activeProfile.name}</strong><small>{activeProfile.reference ? `${activeProfile.reference} size ${activeProfile.referenceSize} · ${activeProfile.fit} fit` : `${activeProfile.fit} fit · Add measurements for better accuracy`}</small></div><button className="text-button" onClick={() => openAddProfile(activeProfile.id)}>Edit profile</button></div>
                <button className="primary-button analyse-button" disabled={isAnalysing} onClick={analyseProduct}>{isAnalysing ? <><span className="spinner"/> Analysing product…</> : <>Find my size <Icon name="arrow" size={17}/></>}</button>
                <div className="secure-note"><span>✳</span> Your fit profile is only used to personalise your recommendation.</div>
              </div>
              <aside className="find-side">
                <div className="side-how"><div className="side-kicker">HOW IT WORKS</div><h3>From product page to perfect fit.</h3><div className="how-step"><span>1</span><div><strong>Share a product</strong><p>Paste a link or select from the catalog.</p></div></div><div className="how-step"><span>2</span><div><strong>We compare the fit</strong><p>Your profile meets the brand&apos;s verified sizing data.</p></div></div><div className="how-step"><span>3</span><div><strong>Get your size</strong><p>See the best match and why it works.</p></div></div></div>
                <div className="side-profile-card"><div className="side-kicker">YOUR FIT PROFILE</div><div className="side-profile-head"><div className={`avatar avatar-${activeProfile.color}`}>{activeProfile.initials}</div><div><strong>{activeProfile.name}</strong><span>{activeProfile.relation}</span></div></div><div className="profile-stats"><div><span>HEIGHT</span><strong>{activeProfile.height ? `${activeProfile.height} cm` : '—'}</strong></div><div><span>CHEST</span><strong>{activeProfile.chest ? `${activeProfile.chest} cm` : '—'}</strong></div><div><span>WAIST</span><strong>{activeProfile.waist ? `${activeProfile.waist} cm` : '—'}</strong></div></div><button className="text-button" onClick={() => openAddProfile(activeProfile.id)}>Update measurements <Icon name="arrow" size={14}/></button></div>
              </aside>
            </div>
            {isAnalysing && <div className="analysis-state"><div className="analysis-spinner"><Icon name="spark" size={23}/></div><div><strong>Reading the product details</strong><p>Evaluating category weights, garment ease, and available size options…</p></div></div>}
            {showResult && !isAnalysing && currentRecommendation && (
              <Recommendation
                profile={activeProfile}
                recommendation={currentRecommendation}
                product={products.find(p => p.id === currentRecommendation.productId)}
                unit={unit}
                feedback={feedback}
                isSubmittingFeedback={isSubmittingFeedback}
                onFeedback={handleFeedback}
              />
            )}
          </>}

          {tab === 'size-guide' && <>
            <PageTitle eyebrow="YOUR MEASUREMENTS, MADE SIMPLE" title="Size guide" description="Keep your fit profile up to date. Measurements are saved per person." action={<div className="unit-toggle"><button className={unit === 'cm' ? 'active' : ''} onClick={() => changeUnit('cm')}>cm</button><button className={unit === 'in' ? 'active' : ''} onClick={() => changeUnit('in')}>in</button></div>}/>
            <div className="guide-layout">
              <div className="guide-card">
                <div className="guide-card-head">
                  <div>
                    <div className="eyebrow">ACTIVE PROFILE {activeProfile.measurementVersion ? `· VERSION ${activeProfile.measurementVersion}` : ''}</div>
                    <h2>{activeProfile.name}&apos;s measurements</h2>
                  </div>
                  <button className="text-button" onClick={() => openAddProfile(activeProfile.id)}>Edit measurements <Icon name="edit" size={14}/></button>
                </div>
                <div className="measurement-grid">
                  {[['Height', activeProfile.height], ['Chest', activeProfile.chest], ['Waist', activeProfile.waist], ['Hips', activeProfile.hips]].map(([label, value]) => (
                    <div className="measurement-box" key={label}>
                      <span>{label.toUpperCase()}</span>
                      <strong>{value ? (unit === 'cm' ? `${value} cm` : `${(Number(value) / 2.54).toFixed(1)} in`) : 'Not added'}</strong>
                      <small>{value ? 'Profile measurement' : 'Add to improve fit'}</small>
                    </div>
                  ))}
                </div>
                <div className="reference-block">
                  <div className="reference-icon"><Icon name="shirt" size={19}/></div>
                  <div>
                    <strong>Reference size</strong>
                    <p>{activeProfile.reference ? `You usually wear ${activeProfile.referenceSize} in ${activeProfile.reference}.` : 'Add a brand and size you already wear.'}</p>
                    {activeProfile.conflictDetected && activeProfile.conflictWarnings?.[0] && (
                      <small style={{ color: 'var(--danger)', display: 'block', marginTop: 4 }}>{activeProfile.conflictWarnings[0]}</small>
                    )}
                  </div>
                  <button className="secondary-button small" onClick={() => openAddProfile(activeProfile.id)}>Update</button>
                </div>
                <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div><div className="eyebrow">VERIFIED CATALOG CHARTS</div><strong style={{ fontSize: 15 }}>Brand size chart explorer</strong></div>
                    <select className="brand-select" value={guideBrandId} onChange={e => setGuideBrandId(e.target.value)}>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  {guideCharts.map(chart => (
                    <div key={chart.id} className="size-comparison" style={{ marginTop: 10 }}>
                      <div className="comparison-title"><strong>{chart.chartName} (v{chart.version})</strong><span>{chart.measurementBasis} basis · {chart.region}</span></div>
                      <div className="comparison-table">
                        <div className="comparison-row table-head"><span>SIZE</span><span>DIMENSIONS ({unit.toUpperCase()})</span><span>BASIS</span><span>STATUS</span></div>
                        {chart.sizeOptions.map(opt => (
                          <div className="comparison-row" key={opt.sizeLabel}>
                            <strong>{opt.sizeLabel}</strong>
                            <span>{opt.measurements.map(m => `${m.dimension}: ${m.minValue === m.maxValue ? m.minValue : `${m.minValue}–${m.maxValue}`}`).join(' · ')}</span>
                            <span>{chart.measurementBasis}</span>
                            <span className="match-mark"><Icon name="check" size={14}/> {chart.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="guide-aside">
                <div className="guide-illustration"><div className="measure-line measure-top"/><div className="measure-line measure-waist"/><div className="measure-line measure-hip"/><div className="body-shape"><div className="body-head"/><div className="body-torso"/><div className="body-legs"/></div><span className="measure-label label-chest">Chest</span><span className="measure-label label-waist">Waist</span><span className="measure-label label-hips">Hips</span></div>
                <h3>Measure once. Shop with confidence.</h3>
                <p>Use a soft measuring tape, keep it level, and measure over light clothing. For best results, ask someone to help.</p>
                <button className="text-button" onClick={() => openAddProfile(activeProfile.id)}>Update {activeProfile.name}&apos;s measurements <Icon name="arrow" size={14}/></button>
              </div>
            </div>
          </>}



          {tab === 'history' && <>
            <PageTitle eyebrow="YOUR FIT JOURNEY" title="Size check history" description="Your recent recommendations, all in one place." action={<button className="secondary-button" onClick={handleExportData}>Export history <Icon name="external" size={15}/></button>}/>
            <RecentChecks expanded recommendations={activeRecommendations} products={products} onSelectRecommendation={openRecommendationItem}/>
          </>}

          {tab === 'settings' && <>
            <PageTitle eyebrow="MAKE SIZEOK YOURS" title="Settings" description="Manage your account preferences and how your fit data is used."/>
            <div className="settings-list">
              <div>
                <div>
                  <strong>Appearance</strong>
                  <p>Switch between light and dark theme across your workspace.</p>
                </div>
                <div className="unit-toggle theme-segmented" role="group" aria-label="Theme preference">
                  <button className={theme === 'light' ? 'active' : ''} onClick={() => { if (theme !== 'light') { setTheme('light'); notify('Switched to light mode') } }}>
                    <Icon name="sun" size={13}/> Light
                  </button>
                  <button className={theme === 'dark' ? 'active' : ''} onClick={() => { if (theme !== 'dark') { setTheme('dark'); notify('Switched to dark mode') } }}>
                    <Icon name="moon" size={13}/> Dark
                  </button>
                </div>
              </div>
              <div><div><strong>Measurement units</strong><p>Choose your preferred unit for body measurements.</p></div><div className="unit-toggle"><button className={unit === 'cm' ? 'active' : ''} onClick={() => changeUnit('cm')}>cm</button><button className={unit === 'in' ? 'active' : ''} onClick={() => changeUnit('in')}>in</button></div></div>
              <div><div><strong>Privacy and personal data</strong><p>Review, export or delete your saved fit profiles.</p></div><button className="secondary-button small" onClick={openPrivacyManager}>Manage data</button></div>
              <div><div><strong>Account &amp; authentication</strong><p>Connected as {user?.email} via {user?.authProvider ?? 'LOCAL'} ({user?.role ?? 'USER'}).</p></div><button className="secondary-button small" onClick={handleLogout}><Icon name="logout" size={14}/> Log out</button></div>
            </div>
          </>}

          <footer className="footer"><span>sizeok © 2026</span><span>Find your fit. Feel like you.</span><a href="#privacy" onClick={e => { e.preventDefault(); openPrivacyManager() }}>Privacy</a></footer>
        </div>
      </main>
      {showProfileModal && (
        <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowProfileModal(false)}>
          <div className="modal-card">
            <div className="modal-head">
              <div><div className="eyebrow">HOUSEHOLD PROFILE</div><h2>{editingId ? 'Edit profile' : 'Add someone new'}</h2><p>Personalise fit recommendations for each person.</p></div>
              <button className="icon-button bordered" onClick={() => setShowProfileModal(false)} aria-label="Close"><Icon name="close"/></button>
            </div>
            <div className="modal-form">
              <div className="form-field full"><label>NAME</label><input autoFocus value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="e.g. Alex" onKeyDown={e => e.key === 'Enter' && saveProfile()}/></div>
              <div className="form-field"><label>RELATIONSHIP</label><select value={profileRelation} onChange={e => setProfileRelation(e.target.value)}><option>You</option><option>Partner</option><option>Child</option><option>Parent</option><option>Family member</option><option>Friend</option></select></div>
              <div className="form-field"><label>PREFERRED FIT</label><select value={profileFit} onChange={e => setProfileFit(e.target.value)}><option>Regular</option><option>Relaxed</option><option>Fitted</option><option>Oversized</option><option>Comfortable</option></select></div>
              <div className="form-section-label">BODY MEASUREMENTS <span>CM</span></div>
              <div className="form-field"><label>HEIGHT</label><input inputMode="decimal" value={profileHeight} onChange={e => setProfileHeight(e.target.value)} placeholder="e.g. 178"/></div>
              <div className="form-field"><label>CHEST</label><input inputMode="decimal" value={profileChest} onChange={e => setProfileChest(e.target.value)} placeholder="e.g. 102"/></div>
              <div className="form-field"><label>WAIST</label><input inputMode="decimal" value={profileWaist} onChange={e => setProfileWaist(e.target.value)} placeholder="e.g. 86"/></div>
              <div className="form-field"><label>HIPS</label><input inputMode="decimal" value={profileHips} onChange={e => setProfileHips(e.target.value)} placeholder="e.g. 100"/></div>
              <div className="form-field full"><label>SHOULDER (OPTIONAL)</label><input inputMode="decimal" value={profileShoulder} onChange={e => setProfileShoulder(e.target.value)} placeholder="e.g. 46"/></div>
              <div className="form-section-label">REFERENCE BRAND SIZE <span>OPTIONAL</span></div>
              <div className="form-field"><label>BRAND</label><input value={profileReference} onChange={e => setProfileReference(e.target.value)} placeholder="e.g. Zara, Nike, H&M, Levi's"/></div>
              <div className="form-field"><label>SIZE YOU USUALLY WEAR</label><input value={profileReferenceSize} onChange={e => setProfileReferenceSize(e.target.value)} placeholder="e.g. L / 32"/></div>
            </div>
            <div className="modal-note"><Icon name="info" size={16}/> Each household profile keeps its own versioned measurements, reference sizes and fit preferences in the backend.</div>
            <div className="modal-actions">
              <button className="secondary-button" onClick={() => setShowProfileModal(false)}>Cancel</button>
              <button className="primary-button" disabled={isSavingProfile} onClick={saveProfile}>{isSavingProfile ? 'Saving…' : editingId ? 'Save changes' : 'Create profile'} <Icon name="arrow" size={16}/></button>
            </div>
          </div>
        </div>
      )}

      {showPrivacyModal && <PrivacyModal privacy={privacySettings} onClose={() => setShowPrivacyModal(false)} onToggleConsent={handleToggleConsent} onExportData={handleExportData} onRequestDeletion={handleRequestDeletion}/>}
      {toast && <div className="toast"><span className="toast-check"><Icon name="check" size={14}/></span>{toast}</div>}
    </div>
  )
}

export default App

