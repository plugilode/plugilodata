// Add these interfaces to the existing types
export interface TopProduct {
  name: string;
  description: string;
  url: string;
  annualRevenue: number; // in millions USD
}

export interface CompanyMetrics {
  trustScore: number; // 0-100
  dealProbability: number; // 0-100
  annualRevenue: number; // in millions USD
  yearOverYearGrowth: number; // percentage
  marketShare: number; // percentage
  topProducts: TopProduct[];
}

// Update CompanyRecord interface to include metrics and verification details
export interface CompanyRecord {
  id: string;
  name: string;
  domain: string;
  url?: string;
  gicsCode?: string;
  industryGroup?: string;
  naics6Codes?: string[];
  naics6Codes2022?: string[];
  naicsCode?: string;
  sector?: string;
  sic4Codes?: string[];
  sicCode: number; // Made required
  tag_trustedshops?: string[];
  subject?: string;
  details?: string;
  status?: string;
  level?: string;
  lastAccessed?: string;
  requiredClearance?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  logo?: string;
  images: string[];
  category: string[];
  tags: string[];
  socialMedia?: {
    [key: string]: string;
  };
  description?: string;
  sourceFound?: string;
  ceo?: string;
  previousCEOs: string[];
  language: string[];
  taxId?: string;
  competitors: string[];
  metrics?: {
    [key: string]: any;
  };
  verificationStatus?: {
    [key: string]: any;
  };
  alexaGlobalRank?: number;
  email?: string;
  tech?: string[];
  techCategories?: string[];
  timeZone?: string;
  type?: string;
  lat: number; // Made required
  lng: number; // Made required
}

export interface VerificationEntry {
  fieldName: string;
  verified: boolean;
  verifiedBy: string;
  date: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  email: string;
}

// Add Guardian API types
export interface GuardianNewsItem {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  isHosted: boolean;
  pillarId: string;
  pillarName: string;
  fields?: {
    headline?: string;
    trailText?: string;
    thumbnail?: string;
    shortUrl?: string;
    bodyText?: string;
  };
}

export interface GuardianApiResponse {
  response: {
    status: string;
    userTier: string;
    total: number;
    startIndex: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    orderBy: string;
    results: GuardianNewsItem[];
  };
}
