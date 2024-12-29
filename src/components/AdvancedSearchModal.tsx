import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: any) => void;
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch
}) => {
  const [selectedFilters, setSelectedFilters] = useState({
    countries: [] as string[],
    sources: [] as string[],
    services: [] as string[],
    certifications: [] as string[],
    companyType: [] as string[],
    companySize: '',
    marketFocus: [] as string[],
    tags: [] as string[],
    techStack: [] as string[]
  });

  const countries = {
    'Europe': [
      'Germany',
      'France',
      'United Kingdom',
      'Italy',
      'Spain',
      'Netherlands',
      'Switzerland',
      'Austria',
      'Belgium',
      'Sweden',
      'Norway',
      'Denmark',
      'Finland',
      'Poland'
    ],
    'North America': [
      'United States',
      'Canada'
    ],
    'Asia': [
      'Japan',
      'China',
      'South Korea',
      'India',
      'Singapore',
      'Taiwan'
    ]
  };

  const sources = [
    'Trusted Shops',
    'Gelbe Seiten',
    'Google',
    'WLW',
    'Ciao',
    'Billiger.de',
    'Guenstiger.de',
    'Other'
  ];

  const tags = [
    'Cloud Provider',
    'Software Development',
    'IT Services',
    'Web Development',
    'Mobile Development',
    'Network Solutions',
    'IT Consulting',
    'System Integration',
    'Data Center',
    'Cybersecurity',
    'AI/ML',
    'IoT',
    'ERP Solutions',
    'CRM Solutions',
    'E-Commerce',
    'Digital Marketing',
    'IT Training',
    'Support Services',
    'Hardware Provider',
    'Telecommunications'
  ];

  const industries = [
    'Software Development',
    'Cloud Services',
    'Cybersecurity',
    'Network Infrastructure',
    'Telecommunications',
    'IT Consulting',
    'Data Centers',
    'System Integration',
    'IoT Solutions',
    'AI/ML Services'
  ];

  const oemCategories = {
    'Manufacturing': [
      'Electronics Assembly',
      'PCB Manufacturing',
      'Component Production',
      'Hardware Integration',
      'Quality Control'
    ],
    'Hardware': [
      'Servers',
      'Network Equipment',
      'Storage Systems',
      'Workstations',
      'IoT Devices'
    ],
    'Components': [
      'Processors',
      'Memory Modules',
      'Storage Devices',
      'Network Cards',
      'Power Supplies'
    ],
    'Peripherals': [
      'Displays',
      'Input Devices',
      'Printing Systems',
      'Security Hardware',
      'Audio Equipment'
    ],
    'Certifications': [
      'ISO 9001',
      'ISO 14001',
      'CE Marking',
      'RoHS Compliance',
      'UL Certification'
    ]
  };

  const certifications = [
    'ISO 27001', // Information Security
    'ISO 20000', // IT Service Management
    'SOC 2',     // Security & Privacy
    'CMMI',      // Development Process
    'PCI DSS',   // Payment Security
    'CISSP',     // Cybersecurity
    'ITIL',      // IT Service Management
    'CSA STAR'   // Cloud Security
  ];

  const companyTypes = [
    'SaaS Provider',
    'System Integrator',
    'Telecom Operator',
    'IT Services',
    'Software House',
    'Cloud Provider',
    'Security Firm',
    'Network Equipment',
    'Data Center Provider',
    'IT Consulting'
  ];

  const serviceCategories = {
    'Software': [
      'Custom Development',
      'Enterprise Solutions',
      'Mobile Apps',
      'Cloud Applications',
      'API Development'
    ],
    'Infrastructure': [
      'Cloud Hosting',
      'Network Services',
      'Data Center Services',
      'CDN Services',
      'VoIP Solutions'
    ],
    'Security': [
      'Cybersecurity Services',
      'Security Auditing',
      'Penetration Testing',
      'Security Operations',
      'Identity Management'
    ],
    'Consulting': [
      'Digital Transformation',
      'Cloud Migration',
      'IT Strategy',
      'Technical Architecture',
      'DevOps Consulting'
    ]
  };

  const companySize = [
    'Startup (1-50)',
    'Small (51-200)',
    'Medium (201-1000)',
    'Large (1001-5000)',
    'Enterprise (5000+)'
  ];

  const marketFocus = [
    'B2B Enterprise',
    'B2B SME',
    'Government/Public Sector',
    'Telecom Operators',
    'Financial Services',
    'Healthcare IT',
    'Retail Technology'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-black/90 border border-green-500/30 rounded-lg w-[800px] max-h-[80vh] overflow-hidden
                    shadow-2xl transform-gpu transition-all duration-300 animate-slideDown">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-green-500/30">
          <h2 className="text-green-400 font-['Orbitron'] tracking-wider text-lg">Advanced Search</h2>
          <button
            onClick={onClose}
            className="text-green-400/70 hover:text-green-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-8rem)]
                     scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-green-500/20">
          <div className="grid grid-cols-2 gap-6">
            {/* Search Query */}
            <div className="col-span-2">
              <label className="block text-green-400 font-['Orbitron'] text-sm mb-2">Search Query</label>
              <input
                type="text"
                className="w-full bg-black/30 border border-green-500/30 rounded px-4 py-2
                         text-green-400 placeholder-green-500/30
                         focus:outline-none focus:border-green-500"
                placeholder="Enter keywords..."
              />
            </div>

            {/* Countries Section */}
            <div className="col-span-2">
              <label className="block text-green-400 font-['Orbitron'] text-sm mb-2">
                Countries
              </label>
              <div className="grid grid-cols-3 gap-6">
                {Object.entries(countries).map(([region, countryList]) => (
                  <div key={region} className="space-y-2 bg-black/20 p-4 rounded-lg border border-green-500/10">
                    <div className="text-green-400 font-['Orbitron'] text-sm mb-2">{region}</div>
                    <div className="grid grid-cols-1 gap-2">
                      {countryList.map(country => (
                        <label key={country} className="flex items-center gap-2 text-green-400/70">
                          <input 
                            type="checkbox"
                            checked={selectedFilters.countries.includes(country)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFilters(prev => ({
                                  ...prev,
                                  countries: [...prev.countries, country]
                                }));
                              } else {
                                setSelectedFilters(prev => ({
                                  ...prev,
                                  countries: prev.countries.filter(c => c !== country)
                                }));
                              }
                            }}
                            className="form-checkbox text-green-500"
                          />
                          <span>{country}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources Section */}
            <div className="col-span-2">
              <label className="block text-green-400 font-['Orbitron'] text-sm mb-2">
                Sources
              </label>
              <div className="grid grid-cols-2 gap-4">
                {sources.map(source => (
                  <label key={source} className="flex items-center gap-2 text-green-400/70 p-2 hover:bg-green-500/10 rounded transition-colors">
                    <input 
                      type="checkbox"
                      checked={selectedFilters.sources.includes(source)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFilters(prev => ({
                            ...prev,
                            sources: [...prev.sources, source]
                          }));
                        } else {
                          setSelectedFilters(prev => ({
                            ...prev,
                            sources: prev.sources.filter(s => s !== source)
                          }));
                        }
                      }}
                      className="form-checkbox text-green-500"
                    />
                    <span>{source}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div className="col-span-2">
              <label className="block text-green-400 font-['Orbitron'] text-sm mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <label key={tag} 
                         className={`inline-flex items-center px-3 py-1 rounded
                                  border transition-colors cursor-pointer
                                  ${selectedFilters.tags.includes(tag) 
                                    ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                                    : 'bg-green-500/10 border-green-500/30 text-green-400/70'}`}>
                    <input 
                      type="checkbox"
                      checked={selectedFilters.tags.includes(tag)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFilters(prev => ({
                            ...prev,
                            tags: [...prev.tags, tag]
                          }));
                        } else {
                          setSelectedFilters(prev => ({
                            ...prev,
                            tags: prev.tags.filter(t => t !== tag)
                          }));
                        }
                      }}
                      className="form-checkbox mr-2"
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>

            {/* OEM Options Section */}
            <div className="col-span-2">
              <label className="block text-green-400 font-['Orbitron'] text-sm mb-2">
                OEM Options
              </label>
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(oemCategories).map(([category, options]) => (
                  <div key={category} className="space-y-2 bg-black/20 p-4 rounded-lg border border-green-500/10">
                    <div className="text-green-400 font-['Orbitron'] text-sm mb-2 flex items-center justify-between">
                      <span>{category}</span>
                      <span className="text-xs text-green-400/50">OEM</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {options.map(option => (
                        <label key={option} 
                               className="flex items-center gap-2 text-green-400/70 hover:text-green-400 
                                        transition-colors p-1 rounded hover:bg-green-500/10">
                          <input 
                            type="checkbox"
                            checked={selectedFilters.techStack.includes(option)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFilters(prev => ({
                                  ...prev,
                                  techStack: [...prev.techStack, option]
                                }));
                              } else {
                                setSelectedFilters(prev => ({
                                  ...prev,
                                  techStack: prev.techStack.filter(t => t !== option)
                                }));
                              }
                            }}
                            className="form-checkbox text-green-500"
                          />
                          <span className="flex-1">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional OEM Information */}
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-green-400 font-['Orbitron'] text-sm mb-2">
                    Production Capacity
                  </label>
                  <select 
                    className="w-full bg-black/30 border border-green-500/30 rounded px-3 py-2
                             text-green-400 focus:outline-none focus:border-green-500"
                    value={selectedFilters.productionCapacity}
                    onChange={(e) => setSelectedFilters(prev => ({
                      ...prev,
                      productionCapacity: e.target.value
                    }))}
                  >
                    <option value="">Any Capacity</option>
                    <option value="small">Small Scale (Less than 1000 units/month)</option>
                    <option value="medium">Medium Scale (1000-10000 units/month)</option>
                    <option value="large">Large Scale (More than 10000 units/month)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-green-400 font-['Orbitron'] text-sm mb-2">
                    Quality Standards
                  </label>
                  <div className="space-y-2">
                    {['Six Sigma', 'Lean Manufacturing', 'TQM', 'ISO 13485', 'AS9100'].map(standard => (
                      <label key={standard} 
                             className="flex items-center gap-2 text-green-400/70 hover:text-green-400 
                                      transition-colors p-1 rounded hover:bg-green-500/10">
                        <input 
                          type="checkbox"
                          checked={selectedFilters.qualityStandards?.includes(standard)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFilters(prev => ({
                                ...prev,
                                qualityStandards: [...(prev.qualityStandards || []), standard]
                              }));
                            } else {
                              setSelectedFilters(prev => ({
                                ...prev,
                                qualityStandards: prev.qualityStandards?.filter(s => s !== standard) || []
                              }));
                            }
                          }}
                          className="form-checkbox text-green-500"
                        />
                        <span>{standard}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Size */}
            <div className="col-span-1">
              <label className="block text-green-400 font-['Orbitron'] text-sm mb-2">
                Company Size
              </label>
              <select 
                className="w-full bg-black/30 border border-green-500/30 rounded px-3 py-2
                       text-green-400 focus:outline-none focus:border-green-500"
                value={selectedFilters.companySize}
                onChange={(e) => setSelectedFilters(prev => ({
                  ...prev,
                  companySize: e.target.value
                }))}
              >
                <option value="">Any Size</option>
                {companySize.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Service Categories */}
            <div className="col-span-2">
              <label className="block text-green-400 font-['Orbitron'] text-sm mb-2">
                Services Offered
              </label>
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(serviceCategories).map(([category, services]) => (
                  <div key={category} className="space-y-2 bg-black/20 p-4 rounded-lg border border-green-500/10">
                    <div className="text-green-400 font-['Orbitron'] text-sm mb-2">{category}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {services.map(service => (
                        <label key={service} className="flex items-center gap-2 text-green-400/70">
                          <input 
                            type="checkbox"
                            checked={selectedFilters.services.includes(service)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFilters(prev => ({
                                  ...prev,
                                  services: [...prev.services, service]
                                }));
                              } else {
                                setSelectedFilters(prev => ({
                                  ...prev,
                                  services: prev.services.filter(s => s !== service)
                                }));
                              }
                            }}
                            className="form-checkbox text-green-500"
                          />
                          <span>{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ... other sections ... */}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-green-500/30 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-green-400/70 hover:text-green-400
                     font-['Orbitron'] text-sm tracking-wider
                     transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSearch(selectedFilters);
              onClose();
            }}
            className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20
                     border border-green-500/30 rounded
                     text-green-400 font-['Orbitron'] text-sm tracking-wider
                     transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}; 