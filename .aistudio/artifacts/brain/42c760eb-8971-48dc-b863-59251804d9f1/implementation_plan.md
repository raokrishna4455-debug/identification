# Remove Dummy Data & Enable Clean Production State

Remove all hardcoded demo/dummy products, simulated user sessions, pre-filled test cards, and fabricated telemetry, replacing them with a clean zero-data state and dynamic data flows driven entirely by user actions and local persistence.

### User Review & Critical Decisions

> [!IMPORTANT]
> The clarifying questions were skipped by default, so we are proceeding with the clean production reset:
> - **Zero-Data Foundation**: All hardcoded fake products (Rolex, Zeiss, Biotech serum), pre-filled test buttons, and automatic mock user login will be removed. The application starts in an unauthenticated, zero-item state.
> - **Dynamic Telemetry & Metrics**: All metrics in the Dashboard, Explorer, and Tracker will be computed live from real registered batches and scans rather than static numbers.
> - **Product Creation & Ingestion**: Users can create real products/batches through the Manufacturer Portal, sign in with their own credentials, and log genuine custody checkpoints.
> - **Optional Developer Testing Control**: A discreet reset/seed toggle in settings or footer will allow re-seeding test data if needed for demo purposes, without polluting normal clean operation.

---

### 1. Overview & Core Concept

- **What It Delivers**: A clean-slate, production-ready version of AUTHENTIX where no fake products, mock custody records, or synthetic analytics are presented by default.
- **Target Persona**: Supply chain operators, brand manufacturers, retail store managers, and consumers who need to interact with genuine, user-created blockchain verification records.
- **Key Value**: Eliminates confusing demo artifacts and fake records so users can register their real brands, mint genuine cryptographic batches, record true physical store/factory locations, and verify authentic barcodes.

---

### 2. User Experience & Visual Design

- **Authentication Flow**:
  - Starts in an unauthenticated state with a clean Sign In / Sign Up interface.
  - Users select their role (Brand Manufacturer, Authorized Retailer, Independent Auditor, or Consumer) and register their legitimate details.
- **Verification Flow**:
  - Barcode lookup field and camera scanner start empty.
  - When scanning or searching an unregistered barcode, displays an accessible, informative zero-match state with guidance on verification protocol and how authorized manufacturers enroll products.
- **Geo-Tracker Flow**:
  - Displays a clean world canvas with an intuitive zero-state: *"No tracked product custody records registered yet. Mint a product batch or scan an item to track its journey from factory to retail."*
  - As soon as a product is minted or a checkpoint is logged, the tracking radar, location pins, and facility ledger update automatically.
- **Dashboard & Explorer**:
  - Replaces hardcoded "1.4M scans" and static fake incident reports with real statistics computed from the user's active ledger.
  - Empty state displays clear zero-metrics (`0 Products Registered`, `0 Active Shipments`, `0 Tamper Incidents`) with quick-action links to register products.

```
┌────────────────────────────────────────────────────────────────────────┐
│ AUTHENTIX ZERO-STATE WORKFLOW                                         │
└────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────┐       ┌──────────────────────┐
│  Unauthenticated │ ────▶ │ Sign In / Register   │
│  Landing Screen  │       │ Real Brand / Role    │
└──────────────────┘       └──────────────────────┘
          │                           │
          ▼                           ▼
┌──────────────────┐       ┌──────────────────────┐
│  Empty Registry  │ ◀──── │ Mint Genuine Batch   │
│  & Live Tracker  │       │ in Manufacturer Hub  │
└──────────────────┘       └──────────────────────┘
          │
          ▼
┌──────────────────┐
│ Verify Barcode   │ ───▶ Real Cryptographic Merkle Certificate
│ & Shop Custody   │
└──────────────────┘
```

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Removal of Hardcoded INITIAL_PRODUCTS**
  - *Chosen Approach*: Initialize `productsMap` from browser `localStorage` (falling back to an empty object `{}` if no user records exist).
  - *Why*: Ensures that products minted by the user persist across refreshes without being overwritten by or mixed with fictional watch or serum entries.
  - *Alternatives Considered*: Keeping one sample item — discarded because the user explicitly requested to remove dummy data.

- **Decision 2: User Authentication Zero-State**
  - *Chosen Approach*: `currentUser` defaults to `null`. The user can freely browse public verification and explorer tools, and is prompted to sign in or register when attempting privileged operations (minting batches, updating store custody).
  - *Why*: Removes the pre-filled "Hans Wilsdorf Jr. / Rolex SA" dummy identity, enforcing realistic role-based access.

- **Decision 3: Polished Empty States across All Tabs**
  - *Chosen Approach*: Implement rich empty states following the SaaS Dashboard design guidelines (clear explanation, domain SVG icon, single-elevation card, and primary CTA to action).
  - *Why*: Prevents awkward broken layouts or blank screens when no items are present.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│ DATA ARCHITECTURE (CLEAN STATE)                                        │
└────────────────────────────────────────────────────────────────────────┘

  [ localStorage: 'authentix_products' ]  ──▶  productsMap (State in App)
  [ localStorage: 'authentix_user' ]      ──▶  currentUser (State in App)
  [ localStorage: 'authentix_blocks' ]    ──▶  blocks & txs (Dynamic)

                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
  [ VerifyView ]     [ TrackerView ]     [ ManufacturerView ]
  - Empty search      - Empty map         - Dynamic batch list
  - Camera scan       - Dynamic nodes     - Live minting engine
  - Zero-state card   - Real shop logs    - Generates real items
```

#### State Transitions & Handlers:
1. **App State**: Initialize `productsMap` with `getStoredProducts()` which reads `localStorage` or defaults to `{}`.
2. **Dynamic Minting**: When a user creates a batch in `ManufacturerView`, it computes the Merkle root, appends the new products to `productsMap`, stores them in `localStorage`, and triggers a ledger block record.
3. **Dynamic Verification**: When verifying a barcode in `VerifyView`, it looks up the code in the live `productsMap`. If found, displays the full authentic certificate; if not found, shows the "Unregistered Barcode" audit response.
4. **Dynamic Tracker**: Filters checkpoints directly from `productsMap`.
