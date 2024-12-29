import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: String,
  domain: String,
  description: String,
  logo_url: String,
  country: String,
  city: String,
  address: String,
  postal_code: String,
  phone: String,
  email: String,
  website: String,
  source: {
    type: String,
    enum: [
      'Trusted Shops',
      'Gelbe Seiten',
      'Google',
      'WLW',
      'Ciao',
      'Billiger.de',
      'Guenstiger.de',
      'Other'
    ]
  },
  tags: [String],
  company_size: {
    type: String,
    enum: [
      'Startup (1-50)',
      'Small (51-200)',
      'Medium (201-1000)',
      'Large (1001-5000)',
      'Enterprise (5000+)'
    ]
  },
  revenue_range: {
    type: String,
    enum: [
      '<1M',
      '1M-10M',
      '10M-50M',
      '50M-100M',
      '100M-500M',
      '500M-1B',
      '>1B'
    ]
  },
  industry: String,
  sub_industry: String,
  services: [String],
  products: [String],
  oem: {
    categories: [String],
    production_capacity: {
      type: String,
      enum: ['small', 'medium', 'large']
    },
    quality_standards: [String],
    certifications: [String]
  },
  social_media: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String,
    youtube: String
  },
  key_people: [{
    name: String,
    position: String,
    email: String,
    phone: String
  }],
  financial_info: {
    annual_revenue: String,
    funding_status: String,
    stock_symbol: String,
    fiscal_year: String
  },
  compliance: {
    certifications: [String],
    standards: [String],
    licenses: [String]
  },
  market_presence: {
    regions: [String],
    countries: [String],
    languages: [String]
  },
  business_metrics: {
    employee_count: String,
    locations_count: Number,
    years_in_business: Number,
    customer_count: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  data_quality: {
    score: Number,
    last_verified: Date,
    confidence_level: String
  },
  audit_trail: [{
    timestamp: Date,
    action: String,
    user: String,
    changes: mongoose.Schema.Types.Mixed
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps on save
companySchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Add text search indexes
companySchema.index({
  name: 'text',
  description: 'text',
  domain: 'text',
  tags: 'text',
  industry: 'text',
  services: 'text',
  products: 'text'
});

export const CompanyModel = mongoose.model('Company', companySchema, 'Company');

export interface ICompany extends mongoose.Document {
  name: string;
  domain: string;
  description?: string;
  logo_url?: string;
  country?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  source?: string;
  tags?: string[];
  company_size?: string;
  revenue_range?: string;
  industry?: string;
  sub_industry?: string;
  services?: string[];
  products?: string[];
  oem?: {
    categories: string[];
    production_capacity?: string;
    quality_standards?: string[];
    certifications?: string[];
  };
  social_media?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  key_people?: Array<{
    name: string;
    position: string;
    email?: string;
    phone?: string;
  }>;
  financial_info?: {
    annual_revenue?: string;
    funding_status?: string;
    stock_symbol?: string;
    fiscal_year?: string;
  };
  compliance?: {
    certifications?: string[];
    standards?: string[];
    licenses?: string[];
  };
  market_presence?: {
    regions?: string[];
    countries?: string[];
    languages?: string[];
  };
  business_metrics?: {
    employee_count?: string;
    locations_count?: number;
    years_in_business?: number;
    customer_count?: string;
  };
  status?: string;
  data_quality?: {
    score?: number;
    last_verified?: Date;
    confidence_level?: string;
  };
  audit_trail?: Array<{
    timestamp: Date;
    action: string;
    user: string;
    changes?: any;
  }>;
  created_at?: Date;
  updated_at?: Date;
} 