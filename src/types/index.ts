// Service types
export type ServiceType = "lane" | "epoxy" | "paint";

export type Service = {
  id: ServiceType;
  title: string;
  backgroundImage: string;
  portfolioLink: string;
  quoteLink: string;
};

// Portfolio types
export type PortfolioCategory = "all" | ServiceType;

export type PortfolioItem = {
  id: string;
  title: string;
  category: ServiceType;
  location: string;
  date: string;
  area: number; // in square meters
  imageUrl: string;
};

// Quote types
export type SurfaceCondition = "good" | "normal" | "bad";

export type QuoteFormData = {
  serviceType: ServiceType;
  area: number;
  surfaceCondition: SurfaceCondition;
  options: string[];
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  notes?: string;
};

export type QuoteResult = {
  baseCost: number;
  optionCost: number;
  surcharge: number;
  total: number;
  isMinimumApplied: boolean;
};
