/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { VerifyView } from './views/VerifyView';
import { DashboardView } from './views/DashboardView';
import { ExplorerView } from './views/ExplorerView';
import { ManufacturerView } from './views/ManufacturerView';
import { TrackerView } from './views/TrackerView';
import { AuthView } from './views/AuthView';
import { INITIAL_PRODUCTS } from './data/mockBlockchain';
import { ProductItem, CustodyCheckpoint, UserProfile } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedBarcode, setSelectedBarcode] = useState<string>('8901030865421');
  const [productsMap, setProductsMap] = useState<Record<string, ProductItem>>(INITIAL_PRODUCTS);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('authentix_user');
      return stored ? JSON.parse(stored) : {
        id: 'usr-default',
        name: 'Hans Wilsdorf Jr.',
        email: 'rolex.admin@authentix.io',
        role: 'manufacturer' as const,
        organization: 'Rolex SA',
        licenseNumber: 'GS1-CH-761329',
        walletAddress: '0x7F2e918c42a8b9e1028374829104829108a9D882',
        joinedDate: '2025-01-01'
      };
    } catch {
      return null;
    }
  });

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('authentix_user', JSON.stringify(user));
    } catch (_) {}

    // Navigate to their specialized workflow
    if (user.role === 'manufacturer') {
      setCurrentTab('manufacturer-portal');
    } else if (user.role === 'retailer') {
      setCurrentTab('geo-tracker');
    } else {
      setCurrentTab('verify-product');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('authentix_user');
    } catch (_) {}
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerifyBarcode = (barcode: string) => {
    setSelectedBarcode(barcode);
    setCurrentTab('verify-product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTracker = (barcode?: string) => {
    if (barcode) setSelectedBarcode(barcode);
    setCurrentTab('geo-tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNewProduct = (newProduct: ProductItem) => {
    setProductsMap((prev) => ({
      ...prev,
      [newProduct.barcode]: newProduct
    }));
    setSelectedBarcode(newProduct.barcode);
  };

  const handleUpdateCustodyCheckpoint = (barcode: string, checkpoint: CustodyCheckpoint) => {
    setProductsMap((prev) => {
      const existing = prev[barcode];
      if (!existing) return prev;
      return {
        ...prev,
        [barcode]: {
          ...existing,
          custodyPath: [...existing.custodyPath, checkpoint]
        }
      };
    });
  };

  const productsList = Object.values(productsMap);

  return (
    <div className="mesh-bg min-h-screen flex flex-col text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Fixed Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenQuickScan={() => handleVerifyBarcode('8901030865421')}
        currentUser={currentUser}
        onOpenAuth={() => handleSelectTab('auth')}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="w-full pt-20 flex-1">
        {currentTab === 'home' && (
          <HomeView
            onSelectTab={handleSelectTab}
            onVerifyBarcode={handleVerifyBarcode}
          />
        )}

        {currentTab === 'auth' && (
          <AuthView
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => handleSelectTab('home')}
          />
        )}

        {currentTab === 'verify-product' && (
          <VerifyView
            initialBarcode={selectedBarcode}
            onSelectTab={handleSelectTab}
            onOpenTracker={handleOpenTracker}
          />
        )}

        {currentTab === 'geo-tracker' && (
          <TrackerView
            products={productsList}
            selectedBarcode={selectedBarcode}
            onSelectProduct={(code) => setSelectedBarcode(code)}
            onUpdateCustodyCheckpoint={handleUpdateCustodyCheckpoint}
          />
        )}

        {currentTab === 'authenticity-dashboard' && (
          <DashboardView
            onInspectBarcode={handleVerifyBarcode}
          />
        )}

        {currentTab === 'blockchain-explorer' && (
          <ExplorerView
            onInspectBarcode={handleVerifyBarcode}
          />
        )}

        {currentTab === 'manufacturer-portal' && (
          <ManufacturerView
            existingProducts={productsList}
            onAddNewProduct={handleAddNewProduct}
            onSelectTab={handleSelectTab}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
}
