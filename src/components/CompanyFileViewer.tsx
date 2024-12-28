import React, { useState, useEffect } from 'react';
import { X, Building, Globe, Mail, Phone, MapPin, Tag, Shield, Users, Briefcase, Database, History, Building2, Linkedin, Twitter, Facebook, Instagram, Youtube, DollarSign, Award, Globe2, BarChart, UserCheck, FileText, Package, Contact, Settings, Info } from 'lucide-react';

interface CompanyFileProps {
  company: any;
  onClose: () => void;
  isOpen: boolean;
}

const ImageWithFallback: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        </div>
      )}
      <img 
        src={src} 
        alt={alt}
        className={className}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        style={{ opacity: isLoading ? 0 : 1 }}
      />
      {hasError && (
        <div className="flex flex-col items-center justify-center text-green-500/30">
          <div className="text-4xl font-['Orbitron'] tracking-widest">N/A</div>
          <span className="text-xs text-center px-2 mt-2">Logo Not Available</span>
        </div>
      )}
    </>
  );
};

export const CompanyFileViewer: React.FC<CompanyFileProps> = ({ company, onClose, isOpen }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Debug log to see company data structure
    console.log('Company data:', {
      name: company.name,
      logo: company.logo,
      logo_url: company.logo_url,
      all_fields: Object.keys(company)
    });

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [company]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-10 flex items-start justify-center z-50">
      <div 
        className={`
          bg-black/80 border border-green-500/30 rounded-lg w-full max-w-[90%] 
          backdrop-blur-sm shadow-2xl transform-gpu
          ${isAnimating ? 'animate-file-open' : ''}
          max-h-[calc(100vh-120px)] overflow-hidden
        `}
      >
        {/* Top Secret Header - Fixed */}
        <div className="sticky top-0 z-10 bg-black/60 border-b border-green-500/30 p-4 text-center relative backdrop-blur-sm">
          <div className="absolute top-4 right-4">
            <button 
              onClick={onClose}
              className="text-green-400/70 hover:text-green-400 transition-colors
                       bg-black/40 p-2 rounded-full hover:bg-black/60"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="font-['Orbitron'] text-green-400 tracking-[0.5em] text-2xl mb-2">
            PLUGILO MASTER DATABASE
          </div>
          <div className="text-green-400/70 text-sm font-['Orbitron']">
            SYSTEM 2.1
          </div>
        </div>

        {/* Vertical Scroll Indicator */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col items-center gap-2 text-green-400/70">
            <span className="text-xs font-['Orbitron'] rotate-90 mb-4">SCROLL</span>
            <div className="h-32 w-1 bg-black/40 rounded-full relative">
              <div className="absolute top-0 left-0 w-full bg-green-500/30 rounded-full h-1/3
                            animate-scroll-down" />
            </div>
          </div>
        </div>

        {/* Company Logo and Quick Info Section */}
        <div className="p-8 border-b border-green-500/30 bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-8">
            {/* Enhanced Company Logo */}
            <div className="w-40 h-40 bg-black/40 rounded-lg border border-green-500/30 
                          flex items-center justify-center overflow-hidden relative
                          group hover:border-green-500/50 transition-all duration-300
                          hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              {company.logo ? (
                <ImageWithFallback 
                  src={company.logo} 
                  alt={`${company.name} logo`}
                  className="max-w-full max-h-full object-contain p-4
                           filter brightness-125 group-hover:scale-105
                           transition-all duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-green-500/30">
                  <div className="text-4xl font-['Orbitron'] tracking-widest">N/A</div>
                  <span className="text-xs text-center px-2 mt-2">Logo Not Available</span>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="flex-1">
              <h1 className="font-['Orbitron'] text-green-400 text-3xl mb-2 tracking-wider">
                {company.name}
              </h1>
              <div className="flex items-center gap-6 text-green-400/70">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <a href={`https://${company.domain}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="hover:text-green-400 transition-colors">
                    {company.domain}
                  </a>
                </div>
                {company.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {company.city}, {company.country}
                  </div>
                )}
                {company.industry && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {company.industry}
                  </div>
                )}
              </div>

              {/* Status and Quick Stats */}
              <div className="mt-4 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs
                    ${company.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      company.status === 'inactive' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'}`}>
                    {company.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
                {company.company_size && (
                  <div className="text-green-400/70 text-sm">
                    <Users className="w-4 h-4 inline-block mr-2" />
                    {company.company_size}
                  </div>
                )}
                {company.data_quality?.score && (
                  <div className="flex items-center gap-2">
                    <div className="text-green-400/70 text-sm">Quality Score:</div>
                    <div className="h-2 w-24 bg-black/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500/50 rounded-full"
                        style={{ width: `${company.data_quality.score}%` }}
                      />
                    </div>
                    <span className="text-green-400 text-sm">
                      {company.data_quality.score}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {company.description && (
            <div className="mt-6 text-green-400/90 text-sm leading-relaxed max-w-4xl">
              {company.description}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="p-8 grid grid-cols-2 gap-8">
          {/* Left Column - Core Information */}
          <div className="space-y-6">
            {/* Company Overview */}
            <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="font-['Orbitron'] text-green-400 text-xl mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Overview
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="text-green-400/70 text-sm mb-1">Industry</div>
                  <div className="text-green-400">{company.industry}</div>
                </div>
                {company.sub_industry && (
                  <div>
                    <div className="text-green-400/70 text-sm mb-1">Sub-Industry</div>
                    <div className="text-green-400">{company.sub_industry}</div>
                  </div>
                )}
                <div>
                  <div className="text-green-400/70 text-sm mb-1">Company Size</div>
                  <div className="text-green-400">{company.company_size}</div>
                </div>
                {company.description && (
                  <div>
                    <div className="text-green-400/70 text-sm mb-1">Description</div>
                    <div className="text-green-400 text-sm leading-relaxed">
                      {company.description}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products & Services */}
            <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="font-['Orbitron'] text-green-400 text-xl mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Products & Services
              </h2>
              {/* Products Section */}
              {company.products && company.products.length > 0 && (
                <div className="mb-6">
                  <div className="text-green-400/70 text-sm mb-2">Products</div>
                  <div className="flex flex-wrap gap-2">
                    {company.products.map((product, index) => (
                      <span key={index} className="px-3 py-1 bg-green-500/10 border border-green-500/30 
                                               rounded-full text-green-400 text-sm">
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Services Section */}
              {company.services && company.services.length > 0 && (
                <div>
                  <div className="text-green-400/70 text-sm mb-2">Services</div>
                  <div className="flex flex-wrap gap-2">
                    {company.services.map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-green-500/10 border border-green-500/30 
                                               rounded-full text-green-400 text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="font-['Orbitron'] text-green-400 text-xl mb-4 flex items-center gap-2">
                <Contact className="w-5 h-5" />
                Contact Information
              </h2>
              <div className="space-y-4">
                {company.email && (
                  <div>
                    <div className="text-green-400/70 text-sm mb-1">Email</div>
                    <div className="text-green-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${company.email}`} 
                         className="hover:text-green-300 transition-colors">
                        {company.email}
                      </a>
                    </div>
                  </div>
                )}
                {company.phone && (
                  <div>
                    <div className="text-green-400/70 text-sm mb-1">Phone</div>
                    <div className="text-green-400 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {company.phone}
                    </div>
                  </div>
                )}
                {company.address && (
                  <div>
                    <div className="text-green-400/70 text-sm mb-1">Address</div>
                    <div className="text-green-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {company.address}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Technical & Business Information */}
          <div className="space-y-6">
            {/* OEM Capabilities */}
            <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="font-['Orbitron'] text-green-400 text-xl mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                OEM Capabilities
              </h2>
              <div className="space-y-4">
                {company.oem?.categories && (
                  <div>
                    <div className="text-green-400/70 text-sm mb-2">Categories</div>
                    <div className="flex flex-wrap gap-2">
                      {company.oem.categories.map((category, index) => (
                        <span key={index} className="px-3 py-1 bg-green-500/10 border border-green-500/30 
                                                 rounded-full text-green-400 text-sm">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {company.oem?.production_capacity && (
                  <div>
                    <div className="text-green-400/70 text-sm mb-1">Production Capacity</div>
                    <div className="text-green-400">{company.oem.production_capacity}</div>
                  </div>
                )}
                {company.oem?.quality_standards && (
                  <div>
                    <div className="text-green-400/70 text-sm mb-2">Quality Standards</div>
                    <div className="flex flex-wrap gap-2">
                      {company.oem.quality_standards.map((standard, index) => (
                        <span key={index} className="px-3 py-1 bg-green-500/10 border border-green-500/30 
                                                 rounded-full text-green-400 text-sm">
                          {standard}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Market & Business */}
            <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="font-['Orbitron'] text-green-400 text-xl mb-4 flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Market & Business
              </h2>
              <div className="space-y-4">
                {company.market_presence?.regions && (
                  <div>
                    <div className="text-green-400/70 text-sm mb-2">Market Regions</div>
                    <div className="flex flex-wrap gap-2">
                      {company.market_presence.regions.map((region, index) => (
                        <span key={index} className="px-3 py-1 bg-green-500/10 border border-green-500/30 
                                                 rounded-full text-green-400 text-sm">
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {company.business_metrics && (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(company.business_metrics).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-green-400/70 text-sm mb-1">
                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </div>
                        <div className="text-green-400">{value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Compliance & Certifications */}
            <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="font-['Orbitron'] text-green-400 text-xl mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Compliance & Certifications
              </h2>
              <div className="space-y-4">
                {company.compliance.certifications && (
                  <div>
                    <div className="text-green-400/70 text-sm mb-2">Certifications</div>
                    <div className="flex flex-wrap gap-2">
                      {company.compliance.certifications.map((cert, index) => (
                        <span key={index} className="px-3 py-1 bg-green-500/10 border border-green-500/30 
                                                 rounded-full text-green-400 text-sm">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Add standards and licenses sections similarly */}
              </div>
            </div>

            {/* Source Information */}
            <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="font-['Orbitron'] text-green-400 text-xl mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Source Information
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="text-green-400/70 text-sm mb-1">Listed On</div>
                  <div className="text-green-400">{company.source}</div>
                </div>
                <div>
                  <div className="text-green-400/70 text-sm mb-1">Last Updated</div>
                  <div className="text-green-400">
                    {new Date(company.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-green-400/70 text-sm mb-1">Created</div>
                  <div className="text-green-400">
                    {new Date(company.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 