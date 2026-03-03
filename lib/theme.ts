export const theme = {
  colors: {
    primary: process.env.NEXT_PUBLIC_COLOR_PRIMARY || '#1e3a5f',
    primaryLight: process.env.NEXT_PUBLIC_COLOR_PRIMARY_LIGHT || '#2563eb',
    secondary: process.env.NEXT_PUBLIC_COLOR_SECONDARY || '#10b981',
    accent: process.env.NEXT_PUBLIC_COLOR_ACCENT || '#f59e0b',
    tertiary: process.env.NEXT_PUBLIC_COLOR_TERTIARY || '#8b5cf6',
    success: process.env.NEXT_PUBLIC_COLOR_SUCCESS || '#10b981',
    error: process.env.NEXT_PUBLIC_COLOR_ERROR || '#ef4444',
    warning: process.env.NEXT_PUBLIC_COLOR_WARNING || '#f59e0b',
  }
}

export const branding = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'K7 E-Library',
  appTagline: process.env.NEXT_PUBLIC_APP_TAGLINE || 'Digital Knowledge Hub',
  schoolName: process.env.NEXT_PUBLIC_SCHOOL_NAME || 'K7 University',
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || '/logo.png',
  logoIcon: process.env.NEXT_PUBLIC_LOGO_ICON || '📚',
  footerText: process.env.NEXT_PUBLIC_FOOTER_TEXT || 'All rights reserved',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'library@k7university.edu',
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+234 123 456 7890',
}
