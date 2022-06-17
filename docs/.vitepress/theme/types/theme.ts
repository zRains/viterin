export interface VRThemeConfig {
  logo?: string
  siteTitle?: string | false
  nav?: NavItem[]
  sidebar?: Sidebar
  editLink?: EditLink
  lastUpdatedText?: string
  socialLinks?: SocialLink[]
  friendLinks?: FriendLink[]
  footer?: Footer
  localeLinks?: LocaleLinks
  carbonAds?: CarbonAdsOptions
}

// nav -----------------------------------------------------------------------

export type NavItem = NavItemWithLink | NavItemWithChildren

export type NavItemWithLink = {
  text: string
  link: string
  activeMatch?: string
}

export type NavItemChildren = {
  text?: string
  items: NavItemWithLink[]
}

export interface NavItemWithChildren {
  text?: string
  items: (NavItemChildren | NavItemWithLink)[]
}

// sidebar -------------------------------------------------------------------

export type Sidebar = SidebarGroup[] | SidebarMulti

export interface SidebarMulti {
  [path: string]: SidebarGroup[]
}

export interface SidebarGroup {
  text: string
  items: SidebarItem[]
  collapsible?: boolean
  isCollapsed?: boolean
}

export interface SidebarItem {
  text: string
  link: string
}

// edit link -----------------------------------------------------------------

export interface EditLink {
  repo: string
  branch?: string
  dir?: string
  text?: string
}

// social link ---------------------------------------------------------------

export interface SocialLink {
  icon: SocialLinkIcon
  link: string
}
// friends link ---------------------------------------------------------------

export interface FriendLink {
  name: string
  avatar: string
  desc: string
  link: string
}

export type SocialLinkIcon = 'discord' | 'facebook' | 'github' | 'instagram' | 'linkedin' | 'slack' | 'twitter' | 'youtube'

// footer --------------------------------------------------------------------

export interface Footer {
  message?: string
  copyright?: string
}

// locales -------------------------------------------------------------------

export interface LocaleLinks {
  text: string
  items: LocaleLink[]
}

export interface LocaleLink {
  text: string
  link: string
}

// carbon ads ----------------------------------------------------------------

export interface CarbonAdsOptions {
  code: string
  placement: string
}
