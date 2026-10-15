import { ProductItem, BlockTransaction, MerkleNode } from '../types';

export const INITIAL_PRODUCTS: Record<string, ProductItem> = {
  '8901030865421': {
    barcode: '8901030865421',
    upcFormat: 'EAN-13 (GS1 General Specs)',
    title: 'Chronograph Regalia · Series 09',
    brand: 'Rolex SA & Authentix Consortium',
    category: 'Luxury Timepiece',
    modelNumber: 'REGALIA-4109-CERACHROM',
    serialNumber: 'SN-CHRONO-890103-994A',
    batchNumber: 'BATCH-2025-04-CHRONO',
    manufacturingDate: '2025-01-14T08:30:00Z',
    originCountry: 'Geneva, Switzerland (Canton of Geneva)',
    authorizedManufacturer: 'Rolex SA Haute Horlogerie Division',
    manufacturerAddress: '0x71F32A4B892c9082d4992147FeE7bF05719Ab301',
    status: 'GENUINE',
    statusMessage: 'Cryptographically Verified · 100% Immutable Authenticity Twin',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    description: 'Bespoke perpetual automatic chronograph crafted with 904L aerospace steel alloy, ceramic tachymeter bezel, and cryptographic micro-etched laser serial verified against Sepolia smart contracts.',
    specifications: {
      'Movement Calibre': 'Calibre 4130 Parachrom Hairspring',
      'Power Reserve': '72 Hours certified COSC',
      'Water Resistance': '100m / 330ft Triplock Waterproofness',
      'Case Diameter': '40 mm Oyster Architecture',
      'Crystal': 'Scratch-resistant Sapphire with AR Cryptographic Hologram',
      'Laser Proof': 'Micro-etched GS1 DataMatrix at 6 O’clock'
    },
    proof: {
      contractAddress: '0x71F32A4B892c9082d4992147FeE7bF05719Ab301',
      tokenId: '4109',
      tokenStandard: 'ERC-721',
      merkleRoot: '0x8f3a992bbca30172e0182419ef257aa4c194a21e78c41295db283949817281bc',
      merkleLeafHash: '0x49e1028ba48201fa8723491bc8271e84a82194c2',
      merkleDepth: 12,
      ecdsaSignature: '0x38bdf8810237e8c109247180293751a02938471bceea4028471928374a29817491028374a10294871928374198273491a82736481927349182734918273491821b',
      issuerPublicKey: '0x04e198bca410298371982374619283749182736491827346192837419283741928374198237491827349182734918273491827349182734918273491827349182',
      blockNumber: 19402118,
      blockTimestamp: '2025-01-14T08:35:12Z',
      txHash: '0x8F3a89010321a4B2e87901048201948172938471bceea4028471928374a29817',
      ipfsMetadataUri: 'ipfs://bafybeid9x47k1lq82937401928374019283740192837401928374/metadata.json',
      gasUsed: '84,129 gas (0.00142 ETH)',
      oracleConsensus: 'Consensus 100% · 24/24 Sepolia Validator Nodes Agreement'
    },
    custodyPath: [
      {
        id: 'cp-1',
        stage: 'Genesis Manufacture & Laser Inscription',
        location: 'Rolex SA Foundry, Geneva, CH',
        facilityType: 'manufacturing',
        lat: 46.2044,
        lng: 6.1432,
        timestamp: '2025-01-14 08:30 UTC',
        operator: 'Rolex SA Genesis Master Key',
        blockNumber: 19402118,
        txHash: '0x8F3a...4B2e',
        status: 'completed',
        tamperSealIntact: true,
        notes: 'Cold-etched cryptographic serial pair embedded on balance wheel'
      },
      {
        id: 'cp-2',
        stage: 'Central Secure Vault Dispatch',
        location: 'Geneva Freeport High-Security Terminal, CH',
        facilityType: 'warehouse',
        lat: 46.2166,
        lng: 6.1300,
        timestamp: '2025-01-16 11:20 UTC',
        operator: 'Loomis Armored Cryptographic Custody',
        blockNumber: 19416040,
        txHash: '0x3C9a...81Fe',
        status: 'completed',
        tamperSealIntact: true,
        notes: 'Tamper-evident holographic tape #CH-9921 scanned'
      },
      {
        id: 'cp-3',
        stage: 'International Customs Bonded Clearance',
        location: 'Zurich Airport International Freight Gate A, CH',
        facilityType: 'customs',
        lat: 47.4582,
        lng: 8.5555,
        timestamp: '2025-01-17 16:45 UTC',
        operator: 'Swiss Federal Customs Digital Portal',
        blockNumber: 19424910,
        txHash: '0x55E1...7A92',
        status: 'completed',
        tamperSealIntact: true,
        notes: 'Carnet ATA #882910 electronic token match validated'
      },
      {
        id: 'cp-4',
        stage: 'Air Cargo International Transfer',
        location: 'JFK International Airport Terminal 4, New York, USA',
        facilityType: 'transit_hub',
        lat: 40.6413,
        lng: -73.7781,
        timestamp: '2025-01-19 04:30 UTC',
        operator: 'Swiss WorldCargo Security Escort',
        blockNumber: 19438010,
        txHash: '0x77A1...33D8',
        status: 'completed',
        tamperSealIntact: true,
        notes: 'Cold container unsealed under bonded customs oversight'
      },
      {
        id: 'cp-5',
        stage: 'Active In-Store Display / Ready for Customer Transfer',
        location: 'Bucherer 5th Avenue Flagship Boutique, New York, USA',
        facilityType: 'retail_shop',
        shopName: 'Bucherer 5th Avenue Flagship',
        shopAddress: '530 5th Avenue, New York, NY 10036',
        lat: 40.7554,
        lng: -73.9804,
        timestamp: '2025-01-22 14:00 UTC',
        operator: 'Store Manager Terminal #04',
        blockNumber: 19460290,
        txHash: '0x44D9...11A3',
        status: 'current',
        tamperSealIntact: true,
        notes: 'Unit active in showcase display; soulbound ERC-5192 warranty certificate armed'
      }
    ]
  },

  '079357318392': {
    barcode: '079357318392',
    upcFormat: 'UPC-A (GS1 US Pharmaceutical)',
    title: 'BioTech Peptide Serum Batch #98B',
    brand: 'Genentech BioPharma',
    category: 'Biotechnology',
    modelNumber: 'BIO-SERUM-PEPTIDE-V98',
    serialNumber: 'SN-GEN-079357-8392B',
    batchNumber: 'BATCH-GEN-2025-Q1-98B',
    manufacturingDate: '2025-02-01T04:12:00Z',
    originCountry: 'South San Francisco, CA, USA',
    authorizedManufacturer: 'Genentech / Roche Biologics Campus',
    manufacturerAddress: '0x22A0F81c4e69B3c829028471e982348a01928374',
    status: 'GENUINE',
    statusMessage: 'Cold Chain Intact (-4°C IoT Verified) · Genentech Oracle Signed',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    description: 'High-purity therapeutic peptide solution requiring strict uninterrupted cold-chain logistics between 2°C and 8°C. Every vial carries an NFC/DataMatrix chip paired with an automated oracle telemetry stream.',
    specifications: {
      'Storage Spec': '2°C to 8°C Refrigerated (Continuous Logger)',
      'Active Concentration': '50 mg/mL recombinant oligopeptide',
      'Vial Integrity': 'Type I Borosilicate Glass with inert elastomer',
      'Sterilization': '0.22 micron sterile filtration GMP Class A',
      'IoT Sensor UID': 'BLE-TEMP-LOG-98214',
      'Regulatory Filing': 'FDA IND #148920 / EMA Orphan Track'
    },
    proof: {
      contractAddress: '0x22A0F81c4e69B3c829028471e982348a01928374',
      tokenId: '98204',
      tokenStandard: 'ERC-1155',
      merkleRoot: '0x22a09c10f84a8271e8471b029384719283741928374192837491827349182734',
      merkleLeafHash: '0x99c2b48102938471e92837401928374019283740',
      merkleDepth: 16,
      ecdsaSignature: '0x498172938471bceea4028471928374a29817491028374a10294871928374198273491a827364819273491827349182734918273491821b02938471bceea4028471',
      issuerPublicKey: '0x04bb29384719283746192837491827364918273461928374192837419283741982374918273491827349182734918273491827349182734918273491827349182',
      blockNumber: 19418290,
      blockTimestamp: '2025-02-01T04:20:00Z',
      txHash: '0x22A0891274919c10847291048201948172938471bceea4028471928374a29817',
      ipfsMetadataUri: 'ipfs://bafybeicoldchainbiotech98b2938471928374/pharma.json',
      gasUsed: '72,800 gas',
      oracleConsensus: 'Consensus 100% · Chainlink Cold-Chain IoT Node Agreement'
    },
    custodyPath: [
      {
        id: 'cp-1',
        stage: 'Bioreactor Synthesis & Sterile Packaging',
        location: 'Genentech Suite B, South San Francisco, CA',
        facilityType: 'manufacturing',
        lat: 37.6604,
        lng: -122.3878,
        timestamp: '2025-02-01 04:12 UTC',
        operator: 'Genentech Automated Sterility Suite',
        blockNumber: 19418290,
        txHash: '0x22A0...9c10',
        status: 'completed',
        temperature: '4.2°C (Optimal)',
        tamperSealIntact: true,
        notes: 'Nitrogen headspace sealed; tamper ring intact'
      },
      {
        id: 'cp-2',
        stage: 'Cryogenic Cold Logistics Carrier Transfer',
        location: 'San Francisco International Cargo Hub (SFO)',
        facilityType: 'transit_hub',
        lat: 37.6213,
        lng: -122.3790,
        timestamp: '2025-02-02 18:30 UTC',
        operator: 'World Courier Cold-Chain Services',
        blockNumber: 19429100,
        txHash: '0x77F1...44B2',
        status: 'completed',
        temperature: '3.8°C (Optimal)',
        tamperSealIntact: true,
        notes: 'Dry-ice sensor telemetry broadcast to Sepolia oracle'
      },
      {
        id: 'cp-3',
        stage: 'Central Specialty Pharmacy Receiving',
        location: 'Mayo Clinic Clinical Trials Pharmacy, Rochester, MN',
        facilityType: 'retail_shop',
        shopName: 'Mayo Clinic Specialty Pharmacy',
        shopAddress: '200 1st St SW, Rochester, MN 55905',
        lat: 44.0225,
        lng: -92.4666,
        timestamp: '2025-02-04 10:15 UTC',
        operator: 'Mayo Clinic Lead Clinical Pharmacist',
        blockNumber: 19441200,
        txHash: '0x11E8...993C',
        status: 'current',
        temperature: '4.0°C (Optimal)',
        tamperSealIntact: true,
        notes: 'Dose custody verified in retail hospital pharmacy storage; zero excursions recorded'
      }
    ]
  },

  '4006381333931': {
    barcode: '4006381333931',
    upcFormat: 'EAN-13 (GS1 Germany)',
    title: 'Zeiss Optic Lens 50mm f/1.2 S',
    brand: 'Carl Zeiss AG',
    category: 'Precision Optics',
    modelNumber: 'ZEISS-OTUS-50-F12-S',
    serialNumber: 'SN-ZEISS-400638-33931',
    batchNumber: 'BATCH-OBERKOCHEN-2025-03',
    manufacturingDate: '2025-01-28T14:40:00Z',
    originCountry: 'Oberkochen, Baden-Württemberg, Germany',
    authorizedManufacturer: 'Carl Zeiss Microscopy & Camera Division',
    manufacturerAddress: '0xCC41e78c41295db283949817281bc8f3a992bbca',
    status: 'GENUINE',
    statusMessage: 'Authentic · Digital Twin #882 Oberkochen Plant Production Proof',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-precision optical prime lens featuring T* anti-reflective multicoating, apochromatic optical design, and individual MTF chart cryptographic calibration record anchored on Ethereum.',
    specifications: {
      'Focal Length': '50 mm standard prime',
      'Max Aperture': 'f/1.2 electromagnetic 9-blade diaphragm',
      'Elements / Groups': '14 Elements in 11 Groups (APO glass)',
      'Mount Type': 'Full-frame Mirrorless Precision Bayonet',
      'Optical Calibration': 'Individual MTF Chart Hash Stored On-Chain',
      'Manufacturing Facility': 'Zeiss Oberkochen Optical Cleanroom 4'
    },
    proof: {
      contractAddress: '0xCC41e78c41295db283949817281bc8f3a992bbca',
      tokenId: '882',
      tokenStandard: 'ERC-721',
      merkleRoot: '0xcc4177e901928374192837491827349182734918273491827349182734918273',
      merkleLeafHash: '0x88f2b10928374019283740192837401928374019',
      merkleDepth: 10,
      ecdsaSignature: '0xcc4182734918273491827349182734918273491821b02938471bceea4028471938471bceea4028471928374a29817491028374a10294871928374198273491a82',
      issuerPublicKey: '0x04cc9182734619283741928374192837419823749182734918273491827349182734918273491827349182734918273491827349182734918273491827349182',
      blockNumber: 19411045,
      blockTimestamp: '2025-01-28T14:48:30Z',
      txHash: '0xCC4140063877e98471928374a29817491028374a10294871928374198273491a',
      ipfsMetadataUri: 'ipfs://bafybeizeissoptics50mmoberkochen882/specs.json',
      gasUsed: '78,410 gas',
      oracleConsensus: 'Consensus 100% · Zeiss Authorized Master Key Verification'
    },
    custodyPath: [
      {
        id: 'cp-1',
        stage: 'Lens Grinding & Optical Bench MTF Calibration',
        location: 'Carl Zeiss Cleanroom, Oberkochen, DE',
        facilityType: 'manufacturing',
        lat: 48.7845,
        lng: 10.1039,
        timestamp: '2025-01-28 14:40 UTC',
        operator: 'Lead Optical Physicist Dr. Klaus M.',
        blockNumber: 19411045,
        txHash: '0xCC41...77e9',
        status: 'completed',
        tamperSealIntact: true,
        notes: 'MTF interferometer values hashed into leaf node'
      },
      {
        id: 'cp-2',
        stage: 'Frankfurt Central Distribution Logistics',
        location: 'Lufthansa Cargo Center Frankfurt (FRA), DE',
        facilityType: 'transit_hub',
        lat: 50.0379,
        lng: 8.5622,
        timestamp: '2025-01-30 08:00 UTC',
        operator: 'DHL Express Global Logistics High-Value Unit',
        blockNumber: 19422000,
        txHash: '0x44B1...991A',
        status: 'completed',
        tamperSealIntact: true,
        notes: 'Electronic tamper-seal bar code scanned'
      },
      {
        id: 'cp-3',
        stage: 'Delivered to Authorized Professional Retailer',
        location: 'B&H Photo Video Pro Optics Store, New York, USA',
        facilityType: 'retail_shop',
        shopName: 'B&H Photo Video Pro Store',
        shopAddress: '420 9th Ave, New York, NY 10001',
        lat: 40.7533,
        lng: -73.9967,
        timestamp: '2025-02-02 11:30 UTC',
        operator: 'B&H Pro Dept Master Scanner #12',
        blockNumber: 19438900,
        txHash: '0x88E2...33D4',
        status: 'current',
        tamperSealIntact: true,
        notes: 'Unit serial verified in unspent state at retailer counter display'
      }
    ]
  },

  '9998887776665': {
    barcode: '9998887776665',
    upcFormat: 'EAN-13 (Flagged Duplicate)',
    title: 'Counterfeit Flagged · Luxury Leather Tote',
    brand: 'Unauthorized Fabricator (Rogue Replica)',
    category: 'Apparel',
    modelNumber: 'FAKE-TOTE-REPLICA-999',
    serialNumber: 'SN-FORGERY-999888-DUP',
    batchNumber: 'ROGUE-DUPLICATE-DETECTED',
    manufacturingDate: '2025-02-10T00:00:00Z',
    originCountry: 'Unknown Black Market Syndicate (Guangzhou Origin)',
    authorizedManufacturer: 'ILLEGITIMATE / NOT AUTHORIZED',
    manufacturerAddress: '0x000000000000000000000000000000000000dEaD',
    status: 'COUNTERFEIT',
    statusMessage: 'CRITICAL ALERT: Barcode Duplication Attack Detected! Token already claimed in Paris, France.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    description: 'This physical barcode has been scanned concurrently from multiple IP addresses across different geographic continents within 10 minutes. The genuine digital twin was already bound to a verified owner.',
    specifications: {
      'Detection Reason': 'Concurrent Duplicate Scan / Unmatched Cryptographic Private Key',
      'Authentix Oracle Action': 'Quarantined & Added to Blacklist Registry',
      'Incident ID': 'INCIDENT-2025-FRAUD-0992',
      'Original Twin Holder': 'Verified French Collector (0x918...41e8)'
    },
    proof: {
      contractAddress: '0x71F32A4B892c9082d4992147FeE7bF05719Ab301',
      tokenId: '0',
      tokenStandard: 'ERC-721',
      merkleRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
      merkleLeafHash: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      merkleDepth: 0,
      ecdsaSignature: 'INVALID_SIGNATURE_MISMATCH_DETECTED',
      issuerPublicKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
      blockNumber: 19445900,
      blockTimestamp: '2025-02-10T12:00:00Z',
      txHash: '0xFA1L89010321a4B2e87901048201948172938471bceea4028471928374a29817',
      ipfsMetadataUri: 'ipfs://unauthorized-counterfeit-alert',
      gasUsed: '21,000 gas (Reverted Execution)',
      oracleConsensus: 'REJECTED: 0/24 Validators confirmed proof integrity'
    },
    custodyPath: [
      {
        id: 'cp-err-1',
        stage: 'Unauthorized Replication Detected',
        location: 'Grey Market Marketplaces',
        timestamp: '2025-02-10 12:00 UTC',
        operator: 'Authentix Automated Threat Hunter Node',
        blockNumber: 19445900,
        txHash: '0xFA1L...9817',
        status: 'completed',
        tamperSealIntact: false,
        notes: 'Photocopied UPC barcode sticker with invalid cryptographic checksum'
      }
    ],
    counterfeitAttemptsCount: 14
  },

  '1112223334445': {
    barcode: '1112223334445',
    upcFormat: 'GS1 DataMatrix (Seal Breach)',
    title: 'Tampered Cold Chain · Pharma Injection Solution',
    brand: 'Apex BioTherapeutics',
    category: 'Biotechnology',
    modelNumber: 'APEX-INJ-500MG',
    serialNumber: 'SN-APEX-111222-BREACH',
    batchNumber: 'BATCH-2025-TEMP-EXCURSION',
    manufacturingDate: '2025-01-05T00:00:00Z',
    originCountry: 'Basel, Switzerland',
    authorizedManufacturer: 'Apex BioTherapeutics AG',
    manufacturerAddress: '0x88123A4B892c9082d4992147FeE7bF05719Ab301',
    status: 'TAMPERED',
    statusMessage: 'WARNING: Physical Tamper Seal Broken & Temperature Excursion (>14°C for 6 hours)',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80',
    description: 'The digital record is genuine, but the IoT cryptographic sensor logged a catastrophic seal breach and thermal spike in transit. Product is NOT safe for administration.',
    specifications: {
      'Violation Type': 'Thermal Shock & Physical Enclosure Tamper',
      'Max Temp Reached': '18.4°C (Limit: 8.0°C)',
      'Sensor Hash': '0x77c2...919a',
      'Action Required': 'Do not dispense. Quarantine and notify regulatory body.'
    },
    proof: {
      contractAddress: '0x88123A4B892c9082d4992147FeE7bF05719Ab301',
      tokenId: '5002',
      tokenStandard: 'ERC-5192 Soulbound',
      merkleRoot: '0x111222333444555666777888999aaabbbcccdddeeefff0001112223334445556',
      merkleLeafHash: '0x77c28102938471e9283740192837401928374019',
      merkleDepth: 8,
      ecdsaSignature: '0x11122233344451bceea4028471928374a29817491028374a10294871928374198273491a827364819273491827349182734918273491821b02938471bceea4028471',
      issuerPublicKey: '0x0488123A4B892c9082d4992147FeE7bF05719Ab3011928374192837419823749182734918273491827349182734918273491827349182734918273491827349182',
      blockNumber: 19430110,
      blockTimestamp: '2025-01-08T09:12:00Z',
      txHash: '0x1112TAMPER4B2e87901048201948172938471bceea4028471928374a29817',
      ipfsMetadataUri: 'ipfs://bafybeitamperedalertcoldchain/log.json',
      gasUsed: '65,000 gas',
      oracleConsensus: 'ALERT: Oracle flagged thermal anomaly event #8812'
    },
    custodyPath: [
      {
        id: 'cp-1',
        stage: 'Genesis Manufacture',
        location: 'Apex Bio Labs, Basel, CH',
        timestamp: '2025-01-05 08:00 UTC',
        operator: 'Apex Lab Tech #19',
        blockNumber: 19430110,
        txHash: '0x1112...4B2e',
        status: 'completed',
        temperature: '4.0°C (Normal)',
        tamperSealIntact: true
      },
      {
        id: 'cp-2',
        stage: 'CRITICAL EVENT: Thermal Excursion & Tamper Flag',
        location: 'In-Transit Freight Hub Frankfurt, DE',
        timestamp: '2025-01-07 14:22 UTC',
        operator: 'Autonomous IoT BLE Beacon #882',
        blockNumber: 19435800,
        txHash: '0x9921...ALERT',
        status: 'completed',
        temperature: '18.4°C (EXCURSION DETECTED)',
        tamperSealIntact: false,
        notes: 'Tamper-evident seal circuit open; temperature rose above safe threshold'
      }
    ]
  }
};

export const RECENT_TRANSACTIONS: BlockTransaction[] = [
  {
    hash: '0x8F3a...4B2e',
    blockNumber: 19402118,
    method: 'verifyScan',
    from: '0x7F2e9...8a9D',
    to: '0x71F32A...Ab301',
    timestamp: '12 seconds ago',
    gasPriceGwei: 14.2,
    status: 'Success',
    barcode: '8901030865421',
    productName: 'Chronograph Regalia · Ref. 4109'
  },
  {
    hash: '0x22A0...9c10',
    blockNumber: 19402117,
    method: 'verifyScan',
    from: '0x3D4a1...99B2',
    to: '0x22A0F8...8374',
    timestamp: '28 seconds ago',
    gasPriceGwei: 13.9,
    status: 'Success',
    barcode: '079357318392',
    productName: 'BioTech Peptide Serum Batch #98B'
  },
  {
    hash: '0xCC41...77e9',
    blockNumber: 19402116,
    method: 'batchMint',
    from: '0xCC41e7...bbca',
    to: '0x71F32A...Ab301',
    timestamp: '1 min ago',
    gasPriceGwei: 14.5,
    status: 'Success',
    barcode: '4006381333931',
    productName: 'Zeiss Optic Lens 50mm f/1.2 S (500 units)'
  },
  {
    hash: '0xFA1L...9817',
    blockNumber: 19402115,
    method: 'flagCounterfeit',
    from: '0x919a0...33c1',
    to: '0x71F32A...Ab301',
    timestamp: '2 mins ago',
    gasPriceGwei: 16.1,
    status: 'Reverted',
    barcode: '9998887776665',
    productName: 'Duplicate Label Collision Detected'
  },
  {
    hash: '0x99B4...11F2',
    blockNumber: 19402114,
    method: 'updateCustody',
    from: '0x44D91...11A3',
    to: '0x71F32A...Ab301',
    timestamp: '3 mins ago',
    gasPriceGwei: 14.0,
    status: 'Success',
    barcode: '8901030865421',
    productName: 'Retail Handover Checkpoint #05'
  }
];

export const MERKLE_TREE_DATA: MerkleNode = {
  id: 'root',
  hash: '0x8f3a992bbca30172e0182419ef257aa4c194a21e78c41295db283949817281bc',
  label: 'Merkle Root (Sepolia State)',
  level: 0,
  verified: true,
  left: {
    id: 'node-l1',
    hash: '0x49e1028ba48201fa8723491bc8271e84a82194c2',
    label: 'Branch Hash L1 (Batch #4109)',
    level: 1,
    verified: true,
    left: {
      id: 'leaf-1',
      hash: '0x8901030865421...keccak',
      label: 'Leaf 0: SN-CHRONO-890103',
      level: 2,
      verified: true
    },
    right: {
      id: 'leaf-2',
      hash: '0x8901030865422...keccak',
      label: 'Leaf 1: SN-CHRONO-890104',
      level: 2,
      verified: false
    }
  },
  right: {
    id: 'node-r1',
    hash: '0x22a09c10f84a8271e8471b029384719283741928',
    label: 'Branch Hash R1 (Batch #4110)',
    level: 1,
    verified: false,
    left: {
      id: 'leaf-3',
      hash: '0x8901030865423...keccak',
      label: 'Leaf 2: SN-CHRONO-890105',
      level: 2,
      verified: false
    },
    right: {
      id: 'leaf-4',
      hash: '0x8901030865424...keccak',
      label: 'Leaf 3: SN-CHRONO-890106',
      level: 2,
      verified: false
    }
  }
};

export const EMPTY_PRODUCTS: Record<string, ProductItem> = {};

export function createUnregisteredProduct(barcode: string): ProductItem {
  const cleanCode = barcode.trim() || '0000000000000';
  return {
    barcode: cleanCode,
    upcFormat: cleanCode.length === 12 ? 'UPC-A (GS1 General Specs)' : 'EAN-13 (GS1 International)',
    title: `Unregistered Item (#${cleanCode})`,
    brand: 'Unregistered / Unknown Brand',
    category: 'Uncategorized',
    modelNumber: 'N/A',
    serialNumber: `SN-UNVERIFIED-${cleanCode}`,
    batchNumber: 'N/A',
    manufacturingDate: 'N/A',
    originCountry: 'Unverified Physical Origin',
    authorizedManufacturer: 'No Authorized Manufacturer Registered',
    manufacturerAddress: '0x0000000000000000000000000000000000000000',
    status: 'UNREGISTERED',
    statusMessage: 'Not Found in Blockchain Ledger. Zero-knowledge proof verification failed.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    description: 'This barcode was queried across all Ethereum Sepolia blocks, but no cryptographic digital twin, authorized mint transaction, or Merkle leaf was found. It may be an unregistered retail product or an unauthorized replica.',
    specifications: {
      'Ledger Status': 'Unregistered / Zero Records Found',
      'Merkle State': 'Non-existent leaf',
      'Authority Check': 'Failed · No valid ECDSA signature'
    },
    proof: {
      contractAddress: '0x71F32A4B892c9082d4992147FeE7bF05719Ab301',
      tokenId: '0',
      tokenStandard: 'None',
      merkleRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
      merkleLeafHash: '0x0000000000000000000000000000000000000000',
      merkleDepth: 0,
      ecdsaSignature: 'NONE',
      issuerPublicKey: 'NONE',
      blockNumber: 19402120,
      blockTimestamp: new Date().toISOString(),
      txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      ipfsMetadataUri: '',
      gasUsed: '21,000 gas',
      oracleConsensus: 'Consensus 0% · Zero node attestations'
    },
    custodyPath: []
  };
}

export function verifyBarcodeInLedger(barcode: string, productsMap: Record<string, ProductItem>): ProductItem {
  const cleanCode = barcode.trim();
  if (productsMap[cleanCode]) {
    return productsMap[cleanCode];
  }
  return createUnregisteredProduct(cleanCode);
}

// Storage helpers for user-managed data
export function getStoredProducts(): Record<string, ProductItem> {
  try {
    const raw = localStorage.getItem('authentix_products');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (_) {}
  return {};
}

export function saveStoredProducts(products: Record<string, ProductItem>): void {
  try {
    localStorage.setItem('authentix_products', JSON.stringify(products));
  } catch (_) {}
}

export function clearAllStoredData(): void {
  try {
    localStorage.removeItem('authentix_products');
    localStorage.removeItem('authentix_user');
    localStorage.removeItem('authentix_scans');
  } catch (_) {}
}

// Backward compatibility alias for dynamic product resolution
export function generateDynamicProduct(barcode: string): ProductItem {
  return createUnregisteredProduct(barcode);
}

