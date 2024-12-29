import React, { useState, useEffect } from 'react';
import { X, Building, Globe, Mail, Phone, MapPin, Tag, Shield, Users, Briefcase, Database, History, Building2, Linkedin, Twitter, Facebook, Instagram, Youtube, DollarSign, Award, Globe2, BarChart, UserCheck, FileText, Package, Contact, Settings, Info, ArrowLeft, ArrowRight, Edit2, Bot, Flag, Download } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Increased from 6 to 9 to show 3 rows of 3

  // Group the information sections into pages
  const sections = [
    {
      id: 'overview',
      title: 'Company Overview',
      icon: Building,
      content: (
        <>
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
        </>
      )
    },
    {
      id: 'products',
      title: 'Products & Services',
      icon: Package,
      content: (
        <>
          {company.products && company.products.length > 0 && (
            <div>
              <div className="text-green-400/70 text-sm mb-2">Products</div>
              <div className="flex flex-wrap gap-2">
                {company.products.map((product: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                    {product}
                  </span>
                ))}
              </div>
            </div>
          )}
          {company.services && company.services.length > 0 && (
            <div className="mt-3">
              <div className="text-green-400/70 text-sm mb-2">Services</div>
              <div className="flex flex-wrap gap-2">
                {company.services.map((service: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: Contact,
      content: (
        <>
          {company.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-400/70" />
              <a href={`mailto:${company.email}`} className="text-green-400 hover:text-green-300">
                {company.email}
              </a>
            </div>
          )}
          {company.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-400/70" />
              <span className="text-green-400">{company.phone}</span>
            </div>
          )}
          {company.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-400/70" />
              <span className="text-green-400">{company.address}</span>
            </div>
          )}
        </>
      )
    },
    {
      id: 'oem',
      title: 'OEM Capabilities',
      icon: Settings,
      content: (
        <>
          {company.oem?.categories && (
            <div>
              <div className="text-green-400/70 text-sm mb-2">Categories</div>
              <div className="flex flex-wrap gap-2">
                {company.oem.categories.map((category: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
          {company.oem?.quality_standards && (
            <div className="mt-3">
              <div className="text-green-400/70 text-sm mb-2">Quality Standards</div>
              <div className="flex flex-wrap gap-2">
                {company.oem.quality_standards.map((standard: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                    {standard}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )
    },
    {
      id: 'market',
      title: 'Market & Business',
      icon: BarChart,
      content: (
        <>
          {company.market_presence?.regions && (
            <div>
              <div className="text-green-400/70 text-sm mb-2">Regions</div>
              <div className="flex flex-wrap gap-2">
                {company.market_presence.regions.map((region: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                    {region}
                  </span>
                ))}
              </div>
            </div>
          )}
          {company.business_metrics && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(company.business_metrics).map(([key, value]) => (
                <div key={key}>
                  <div className="text-green-400/70 text-xs">
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </div>
                  <div className="text-green-400">{value}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )
    },
    {
      id: 'source',
      title: 'Source Information',
      icon: Info,
      content: (
        <>
          <div>
            <div className="text-green-400/70 text-sm mb-1">Source</div>
            <div className="text-green-400">{company.source}</div>
          </div>
          <div>
            <div className="text-green-400/70 text-sm mb-1">Last Updated</div>
            <div className="text-green-400">
              {new Date(company.updated_at).toLocaleDateString()}
            </div>
          </div>
        </>
      )
    },
    {
      id: 'social',
      title: 'Social Media',
      icon: Globe,
      content: (
        <>
          {company.social_media && Object.entries(company.social_media).map(([platform, url]) => (
            url && (
              <div key={platform} className="flex items-center gap-2">
                {platform === 'linkedin' && <Linkedin className="w-3 h-3 text-green-400/70" />}
                {platform === 'twitter' && <Twitter className="w-3 h-3 text-green-400/70" />}
                {platform === 'facebook' && <Facebook className="w-3 h-3 text-green-400/70" />}
                {platform === 'instagram' && <Instagram className="w-3 h-3 text-green-400/70" />}
                {platform === 'youtube' && <Youtube className="w-3 h-3 text-green-400/70" />}
                <a href={url} target="_blank" rel="noopener noreferrer" 
                   className="text-green-400 hover:text-green-300">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              </div>
            )
          ))}
        </>
      )
    },
    {
      id: 'keyPeople',
      title: 'Key Personnel',
      icon: Users,
      content: (
        <>
          {company.key_people?.map((person, index) => (
            <div key={index} className="mb-2 last:mb-0">
              <div className="text-green-400">{person.name}</div>
              <div className="text-green-400/70">{person.position}</div>
              {person.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-green-400/50" />
                  <span className="text-green-400/70">{person.email}</span>
                </div>
              )}
            </div>
          ))}
        </>
      )
    },
    {
      id: 'financial',
      title: 'Financial Information',
      icon: DollarSign,
      content: (
        <>
          {company.financial_info && Object.entries(company.financial_info).map(([key, value]) => (
            value && (
              <div key={key}>
                <div className="text-green-400/70 text-xs">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </div>
                <div className="text-green-400">{value}</div>
              </div>
            )
          ))}
        </>
      )
    },
    {
      id: 'compliance',
      title: 'Compliance',
      icon: Shield,
      content: (
        <>
          {company.compliance?.certifications && (
            <div className="mb-2">
              <div className="text-green-400/70 text-xs mb-1">Certifications</div>
              <div className="flex flex-wrap gap-1">
                {company.compliance.certifications.map((cert, index) => (
                  <span key={index} className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
          {company.compliance?.standards && (
            <div className="mb-2">
              <div className="text-green-400/70 text-xs mb-1">Standards</div>
              <div className="flex flex-wrap gap-1">
                {company.compliance.standards.map((standard, index) => (
                  <span key={index} className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                    {standard}
                  </span>
                ))}
              </div>
            </div>
          )}
          {company.compliance?.licenses && (
            <div>
              <div className="text-green-400/70 text-xs mb-1">Licenses</div>
              <div className="flex flex-wrap gap-1">
                {company.compliance.licenses.map((license, index) => (
                  <span key={index} className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                    {license}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )
    },
    {
      id: 'marketPresence',
      title: 'Market Presence',
      icon: Globe2,
      content: (
        <>
          {company.market_presence?.regions && (
            <div className="mb-2">
              <div className="text-green-400/70 text-xs mb-1">Regions</div>
              <div className="flex flex-wrap gap-1">
                {company.market_presence.regions.map((region, index) => (
                  <span key={index} className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                    {region}
                  </span>
                ))}
              </div>
            </div>
          )}
          {company.market_presence?.languages && (
            <div>
              <div className="text-green-400/70 text-xs mb-1">Languages</div>
              <div className="flex flex-wrap gap-1">
                {company.market_presence.languages.map((lang, index) => (
                  <span key={index} className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )
    },
    {
      id: 'dataQuality',
      title: 'Data Quality',
      icon: Database,
      content: (
        <>
          {company.data_quality && (
            <>
              <div className="mb-2">
                <div className="text-green-400/70 text-xs">Quality Score</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500/50 rounded-full"
                      style={{ width: `${company.data_quality.score || 0}%` }}
                    />
                  </div>
                  <span className="text-green-400 text-xs min-w-[2rem]">
                    {company.data_quality.score || 0}%
                  </span>
                </div>
              </div>
              {company.data_quality.last_verified && (
                <div>
                  <div className="text-green-400/70 text-xs">Last Verified</div>
                  <div className="text-green-400">
                    {new Date(company.data_quality.last_verified).toLocaleDateString()}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )
    },
    {
      id: 'industryClassification',
      title: 'Industry Classification',
      icon: Building2,
      content: (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-green-400/70 text-xs mb-1">Category</div>
              <div className="text-green-400">{company.category}</div>
            </div>
            <div>
              <div className="text-green-400/70 text-xs mb-1">Industry Group</div>
              <div className="text-green-400">{company.industryGroup}</div>
            </div>
            <div>
              <div className="text-green-400/70 text-xs mb-1">Sector</div>
              <div className="text-green-400">{company.sector}</div>
            </div>
            <div>
              <div className="text-green-400/70 text-xs mb-1">Type</div>
              <div className="text-green-400">{company.type}</div>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'businessCodes',
      title: 'Business Codes',
      icon: FileText,
      content: (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-green-400/70 text-xs mb-1">GICS Code</div>
              <div className="text-green-400">{company.gicsCode}</div>
            </div>
            <div>
              <div className="text-green-400/70 text-xs mb-1">NAICS Code</div>
              <div className="text-green-400">{company.naicsCode}</div>
            </div>
            <div>
              <div className="text-green-400/70 text-xs mb-1">NAICS-6</div>
              <div className="text-green-400">{company.naics6Codes}</div>
            </div>
            <div>
              <div className="text-green-400/70 text-xs mb-1">SIC Code</div>
              <div className="text-green-400">{company.sicCode}</div>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'location',
      title: 'Location Details',
      icon: MapPin,
      content: (
        <>
          <div className="space-y-2">
            <div>
              <div className="text-green-400/70 text-xs mb-1">Country</div>
              <div className="text-green-400">{company.country} ({company.countryCode})</div>
            </div>
            <div>
              <div className="text-green-400/70 text-xs mb-1">Coordinates</div>
              <div className="text-green-400">
                {company.lat}, {company.lng}
              </div>
            </div>
            <div>
              <div className="text-green-400/70 text-xs mb-1">Time Zone</div>
              <div className="text-green-400">
                {company.timeZone} (UTC{company.utcOffset >= 0 ? '+' : ''}{company.utcOffset})
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'onlinePresence',
      title: 'Online Presence',
      icon: Globe,
      content: (
        <>
          <div className="space-y-2">
            <div>
              <div className="text-green-400/70 text-xs mb-1">Website</div>
              <a href={company.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-green-400 hover:text-green-300">
                {company.url}
              </a>
            </div>
            <div>
              <div className="text-green-400/70 text-xs mb-1">Email</div>
              <a href={`mailto:${company.email}`}
                 className="text-green-400 hover:text-green-300">
                {company.email}
              </a>
            </div>
            <div>
              <div className="text-green-400/70 text-xs mb-1">Alexa Rank</div>
              <div className="text-green-400">#{company.alexaGlobalRank}</div>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'technology',
      title: 'Technology Stack',
      icon: Settings,
      content: (
        <>
          {company.tech && (
            <div className="mb-2">
              <div className="text-green-400/70 text-xs mb-1">Technologies</div>
              <div className="flex flex-wrap gap-1">
                {Array.isArray(company.tech)
                  ? company.tech.map((tech: string, index: number) => (
                  <span key={index} className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                    {tech.replace(/'/g, '')}
                  </span>
                    ))
                  : typeof company.tech === 'string'
                    ? company.tech.split("', '").map((tech: string, index: number) => (
                        <span key={index} className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                          {tech.replace(/'/g, '')}
                        </span>
                      ))
                    : null
                }
              </div>
            </div>
          )}
          {company.techCategories && (
            <div>
              <div className="text-green-400/70 text-xs mb-1">Categories</div>
              <div className="flex flex-wrap gap-1">
                {Array.isArray(company.techCategories)
                  ? company.techCategories.map((category: string, index: number) => (
                  <span key={index} className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                    {category.replace(/'/g, '')}
                  </span>
                    ))
                  : typeof company.techCategories === 'string'
                    ? company.techCategories.split("', '").map((category: string, index: number) => (
                        <span key={index} className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                          {category.replace(/'/g, '')}
                        </span>
                      ))
                    : null
                }
              </div>
            </div>
          )}
        </>
      )
    },
    {
      id: 'tags',
      title: 'Tags & Categories',
      icon: Tag,
      content: (
        <>
          {company.tags && (
            <div className="mb-2">
              <div className="text-green-400/70 text-xs mb-1">Tags</div>
              <div className="flex flex-wrap gap-1">
                {Array.isArray(company.tags) 
                  ? company.tags.map((tag: string, index: number) => (
                  <span key={index} className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                    {tag.replace(/'/g, '')}
                  </span>
                    ))
                  : typeof company.tags === 'string'
                    ? company.tags.split("', '").map((tag: string, index: number) => (
                        <span key={index} className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                          {tag.replace(/'/g, '')}
                        </span>
                      ))
                    : null
                }
              </div>
            </div>
          )}
          {company.tag_trustedshops && (
            <div>
              <div className="text-green-400/70 text-xs mb-1">Trusted Shops Category</div>
              <div className="text-green-400">{company.tag_trustedshops}</div>
            </div>
          )}
        </>
      )
    },
    {
      id: 'naicsDetails',
      title: 'NAICS Details',
      icon: FileText,
      content: (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-green-400/70 text-xs mb-1">NAICS Code</div>
              <div className="text-green-400">{company.naicsCode}</div>
            </div>
            <div>
              <div className="text-green-400/70 text-xs mb-1">NAICS-6 (2022)</div>
              <div className="text-green-400">{company.naics6Codes2022}</div>
            </div>
            <div>
              <div className="text-green-400/70 text-xs mb-1">NAICS-6</div>
              <div className="text-green-400">{company.naics6Codes}</div>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'sicDetails',
      title: 'SIC Details',
      icon: FileText,
      content: (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-green-400/70 text-xs mb-1">SIC Code</div>
              <div className="text-green-400">{company.sicCode}</div>
            </div>
            <div>
              <div className="text-green-400/70 text-xs mb-1">SIC-4</div>
              <div className="text-green-400">{company.sic4Codes}</div>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'onlineMetrics',
      title: 'Online Metrics',
      icon: BarChart,
      content: (
        <>
          <div className="space-y-2">
            <div>
              <div className="text-green-400/70 text-xs mb-1">Alexa Global Rank</div>
              <div className="text-green-400">#{company.alexaGlobalRank}</div>
            </div>
            <div>
              <div className="text-green-400/70 text-xs mb-1">URL</div>
              <a href={company.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-green-400 hover:text-green-300 text-xs">
                {company.url}
              </a>
            </div>
          </div>
        </>
      )
    }
  ];

  const totalPages = Math.ceil(sections.length / itemsPerPage);
  const currentSections = sections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const exportToTxt = () => {
    // Format company data as text
    const formatData = () => {
      let text = `PLUGILO MASTER DATABASE - COMPANY REPORT\n`;
      text += `Generated: ${new Date().toLocaleString()}\n\n`;
      text += `=== COMPANY PROFILE ===\n`;
      text += `Name: ${company.name}\n`;
      text += `Domain: ${company.domain}\n`;
      text += `Description: ${company.description || 'N/A'}\n\n`;

      text += `=== CONTACT INFORMATION ===\n`;
      text += `Email: ${company.email || 'N/A'}\n`;
      text += `Phone: ${company.phone || 'N/A'}\n`;
      text += `Address: ${company.address || 'N/A'}\n`;
      text += `Country: ${company.country || 'N/A'}\n`;
      text += `City: ${company.city || 'N/A'}\n\n`;

      text += `=== BUSINESS DETAILS ===\n`;
      text += `Industry: ${company.industry || 'N/A'}\n`;
      text += `Sub-Industry: ${company.sub_industry || 'N/A'}\n`;
      text += `Company Size: ${company.company_size || 'N/A'}\n`;
      text += `Source: ${company.source || 'N/A'}\n\n`;

      if (company.products?.length) {
        text += `=== PRODUCTS ===\n`;
        company.products.forEach((product: string) => {
          text += `- ${product}\n`;
        });
        text += '\n';
      }

      if (company.services?.length) {
        text += `=== SERVICES ===\n`;
        company.services.forEach((service: string) => {
          text += `- ${service}\n`;
        });
        text += '\n';
      }

      if (company.oem) {
        text += `=== OEM CAPABILITIES ===\n`;
        if (company.oem.categories?.length) {
          text += `Categories:\n`;
          company.oem.categories.forEach((category: string) => {
            text += `- ${category}\n`;
          });
        }
        text += `Production Capacity: ${company.oem.production_capacity || 'N/A'}\n`;
        if (company.oem.quality_standards?.length) {
          text += `Quality Standards:\n`;
          company.oem.quality_standards.forEach((standard: string) => {
            text += `- ${standard}\n`;
          });
        }
        text += '\n';
      }

      if (company.key_people?.length) {
        text += `=== KEY PERSONNEL ===\n`;
        company.key_people.forEach((person: any) => {
          text += `- ${person.name} (${person.position})\n`;
          if (person.email) text += `  Email: ${person.email}\n`;
          if (person.phone) text += `  Phone: ${person.phone}\n`;
        });
        text += '\n';
      }

      if (company.market_presence) {
        text += `=== MARKET PRESENCE ===\n`;
        if (company.market_presence.regions?.length) {
          text += `Regions:\n`;
          company.market_presence.regions.forEach((region: string) => {
            text += `- ${region}\n`;
          });
        }
        if (company.market_presence.languages?.length) {
          text += `Languages:\n`;
          company.market_presence.languages.forEach((lang: string) => {
            text += `- ${lang}\n`;
          });
        }
        text += '\n';
      }

      if (company.data_quality) {
        text += `=== DATA QUALITY ===\n`;
        text += `Quality Score: ${company.data_quality.score || 0}%\n`;
        text += `Last Verified: ${company.data_quality.last_verified ? 
          new Date(company.data_quality.last_verified).toLocaleDateString() : 'N/A'}\n\n`;
      }

      text += `=== METADATA ===\n`;
      text += `Created: ${new Date(company.created_at).toLocaleString()}\n`;
      text += `Last Updated: ${new Date(company.updated_at).toLocaleString()}\n`;

      text += `=== CLASSIFICATION CODES ===\n`;
      text += `GICS Code: ${company.gicsCode}\n`;
      text += `NAICS Code: ${company.naicsCode}\n`;
      text += `NAICS-6: ${company.naics6Codes}\n`;
      text += `NAICS-6 (2022): ${company.naics6Codes2022}\n`;
      text += `SIC Code: ${company.sicCode}\n`;
      text += `SIC-4: ${company.sic4Codes}\n\n`;

      text += `=== TAGS & CATEGORIES ===\n`;
      text += `Tags: ${company.tags}\n`;
      text += `Trusted Shops Category: ${company.tag_trustedshops}\n\n`;

      text += `=== ONLINE PRESENCE ===\n`;
      text += `URL: ${company.url}\n`;
      text += `Alexa Global Rank: #${company.alexaGlobalRank}\n`;
      text += `Technologies: ${company.tech}\n`;
      text += `Tech Categories: ${company.techCategories}\n\n`;

      return text;
    };

    // Create and download the file
    const blob = new Blob([formatData()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${company.name.replace(/\s+/g, '_')}_report.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-[4rem_0_4rem_0] flex items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm">
      <div 
        className={`
          relative w-[90vw] h-[85vh] 
          bg-black/80 border border-green-500/30 rounded-lg
          backdrop-blur-sm shadow-2xl transform-gpu
          ${isAnimating ? 'animate-file-open' : ''}
          overflow-hidden
          z-[9999]
          max-w-[1800px]
          mx-auto
        `}
      >
        {/* Top Secret Header - Fixed */}
        <div className="sticky top-0 z-[10000] bg-black/60 border-b border-green-500/30 backdrop-blur-sm">
          <div className="p-4 text-center relative">
            {/* Close and Pagination Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-4">
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-green-500/30">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-1 rounded ${
                      currentPage === 1
                        ? 'text-green-500/30'
                        : 'text-green-400 hover:text-green-300'
                    } transition-colors`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <span className="text-green-400/70 text-xs px-2 font-['Orbitron']">
                    {currentPage}/{totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-1 rounded ${
                      currentPage === totalPages
                        ? 'text-green-500/30'
                        : 'text-green-400 hover:text-green-300'
                    } transition-colors`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Close Button */}
              <button 
                onClick={onClose}
                className="text-green-400/70 hover:text-green-400 transition-colors
                         bg-black/40 p-2 rounded-full hover:bg-black/60"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Title remains the same */}
            <div className="font-['Orbitron'] text-green-400 tracking-[0.5em] text-2xl mb-2">
              PLUGILO MASTER DATABASE
            </div>
            <div className="text-green-400/70 text-sm font-['Orbitron']">
              SYSTEM 2.1
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 p-4 border-t border-green-500/30">
            <button className="px-4 py-2 bg-black/40 border border-green-500/30 rounded
                            text-green-400 text-sm font-['Orbitron']
                            hover:bg-green-500/10 hover:scale-105
                            transition-all duration-200
                            flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Edit/Add Information
            </button>

            <button className="px-4 py-2 bg-black/40 border border-green-500/30 rounded
                            text-green-400 text-sm font-['Orbitron']
                            hover:bg-green-500/10 hover:scale-105
                            transition-all duration-200
                            flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Research Agent
            </button>

            <button className="px-4 py-2 bg-black/40 border border-green-500/30 rounded
                            text-green-400 text-sm font-['Orbitron']
                            hover:bg-green-500/10 hover:scale-105
                            transition-all duration-200
                            flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Flag Information
            </button>

            <button 
              onClick={exportToTxt}
              className="px-4 py-2 bg-black/40 border border-green-500/30 rounded
                            text-green-400 text-sm font-['Orbitron']
                            hover:bg-green-500/10 hover:scale-105
                            transition-all duration-200
                       flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Simpler Scroll Indicator - without text */}
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[10001] flex flex-col items-center">
          <div className="w-0.5 h-24 bg-green-500/10 rounded-full">
            <div className="w-full h-6 bg-green-500/30 rounded-full animate-scroll-down" />
          </div>
        </div>

        {/* Content Area */}
        <div className="h-[calc(85vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-green-500/20 relative z-[9999] pb-16">
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

          {/* Information Grid - More compact, 3 columns */}
          <div className="p-4 grid grid-cols-3 gap-3">
            {currentSections.map((section) => (
              <div key={section.id} 
                   className="bg-black/60 border border-green-500/30 rounded-lg p-3 backdrop-blur-sm">
                <h2 className="font-['Orbitron'] text-green-400 text-sm mb-2 flex items-center gap-2">
                  <section.icon className="w-3 h-3" />
                  {section.title}
                </h2>
                <div className="space-y-2 text-xs">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 