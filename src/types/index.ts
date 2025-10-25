export type UserType = 'buyer' | 'seller' | 'both';
export type KYCStatus = 'pending' | 'verified' | 'rejected';
export type PlotStatus = 'draft' | 'pending_verification' | 'verified' | 'sold';
export type VerificationStatus = 'pending' | 'in_progress' | 'verified' | 'rejected';
export type DocumentType = 'title_deed' | 'survey_map' | 'tax_receipt' | 'noc' | 'encumbrance_certificate' | 'other';
export type TransactionStatus = 'interested' | 'negotiating' | 'escrow' | 'completed' | 'cancelled';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  kyc_status: KYCStatus;
  kyc_document_url?: string;
  user_type: UserType;
  created_at: string;
}

export interface Plot {
  id: string;
  seller_id: string;
  seller_name?: string;
  seller_phone?: string;
  owner_name: string;
  owner_aadhaar: string;
  property_owner_name: string;
  owner_verified: boolean;
  title: string;
  description?: string;
  location_address: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  area_sqft: number;
  price: number;
  price_per_sqft: number;
  status: PlotStatus;
  verification_status: VerificationStatus;
  blockchain_hash?: string;
  images: string[];
  documents: Document[];
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  plot_id: string;
  document_type: DocumentType;
  document_url: string;
  verification_status: VerificationStatus;
  ai_check_status: 'pending' | 'passed' | 'failed';
  govt_check_status: 'pending' | 'verified' | 'failed';
  verified_at?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  plot_id: string;
  buyer_id: string;
  seller_id: string;
  status: TransactionStatus;
  offer_price?: number;
  final_price?: number;
  escrow_status?: 'pending' | 'funded' | 'released';
  ownership_transferred_at?: string;
  blockchain_transfer_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface PriceComparison {
  city: string;
  state: string;
  area_type: 'residential' | 'commercial' | 'agricultural';
  avg_price_per_sqft: number;
  min_price_per_sqft: number;
  max_price_per_sqft: number;
  sample_size: number;
  last_updated: string;
}
