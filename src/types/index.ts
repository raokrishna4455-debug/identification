export type VerificationStatus = 'GENUINE' | 'COUNTERFEIT' | 'TAMPERED' | 'UNREGISTERED' | 'CHECKING';

export type UserRole = 'auditor' | 'manufacturer' | 'retailer' | 'customs';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  licenseNumber?: string;
  walletAddress?: string;
  avatarUrl?: string;
  joinedDate: string;
}

export interface CustodyCheckpoint {
  id: string;
  stage: string;
  location: string;
  facilityType?: 'manufacturing' | 'transit_hub' | 'customs' | 'warehouse' | 'retail_shop';
  lat?: number;
  lng?: number;
  shopName?: string;
  shopAddress?: string;
  timestamp: string;
  operator: string;
  blockNumber: number;
  txHash: string;
  status: 'completed' | 'current' | 'pending';
  temperature?: string;
  tamperSealIntact: boolean;
  notes?: string;
}

export interface GpsTelemetry {
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  accuracyMeters: number;
  lastPingTime: string;
  satelliteLock: boolean;
  signalStrengthDbm: number;
  batteryPercent: number;
  isWithinAuthorizedGeofence: boolean;
  currentShopOrFacility: string;
  geofenceRadiusKm: number;
}

export interface CryptographicProof {
  contractAddress: string;
  tokenId: string;
  tokenStandard: 'ERC-721' | 'ERC-1155' | 'ERC-5192 Soulbound' | 'None';
  merkleRoot: string;
  merkleLeafHash: string;
  merkleDepth: number;
  ecdsaSignature: string;
  issuerPublicKey: string;
  blockNumber: number;
  blockTimestamp: string;
  txHash: string;
  ipfsMetadataUri: string;
  gasUsed: string;
  oracleConsensus: string;
}

export interface ProductItem {
  barcode: string;
  upcFormat: string;
  title: string;
  brand: string;
  category: 'Luxury Timepiece' | 'Biotechnology' | 'Precision Optics' | 'Fine Spirits' | 'Consumer Tech' | 'Apparel' | 'Uncategorized';
  modelNumber: string;

  serialNumber: string;
  batchNumber: string;
  manufacturingDate: string;
  originCountry: string;
  authorizedManufacturer: string;
  manufacturerAddress: string;
  status: VerificationStatus;
  statusMessage: string;
  image: string;
  description: string;
  specifications: Record<string, string>;
  proof: CryptographicProof;
  custodyPath: CustodyCheckpoint[];
  counterfeitAttemptsCount?: number;
}

export interface MerkleNode {
  id: string;
  hash: string;
  label: string;
  level: number;
  verified?: boolean;
  left?: MerkleNode;
  right?: MerkleNode;
}

export interface BlockTransaction {
  hash: string;
  blockNumber: number;
  method: 'verifyScan' | 'batchMint' | 'updateCustody' | 'revokeTwin' | 'flagCounterfeit';
  from: string;
  to: string;
  timestamp: string;
  gasPriceGwei: number;
  status: 'Success' | 'Reverted';
  barcode: string;
  productName: string;
}

export interface BatchMintForm {
  brand: string;
  productName: string;
  category: ProductItem['category'];
  batchNumber: string;
  quantity: number;
  manufacturingPlant: string;
  tokenStandard: CryptographicProof['tokenStandard'];
  coldChainMonitored: boolean;
  notes: string;
}
