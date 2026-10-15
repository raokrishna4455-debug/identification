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
import { 
  getStoredProducts, 
  saveStoredProducts, 
  clearAllStoredData, 
  INITIAL_PRODUCTS 
} from './data/mockBlockchain';
import { ProductItem, CustodyCheckpoint, UserProfile } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedBarcode, setSelectedBarcode] = useState<string>('');
  const [productsMap, setProductsMap] = useState<Record<string, ProductItem>>(() => getStoredProducts());

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('authentix_user');
      return stored ? JSON.parse(stored) : null;
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
    setProductsMap((prev) => {
      const updated = {
        ...prev,
        [newProduct.barcode]: newProduct
      };
      saveStoredProducts(updated);
      return updated;
    });
    setSelectedBarcode(newProduct.barcode);
  };

  const handleUpdateCustodyCheckpoint = (barcode: string, checkpoint: CustodyCheckpoint) => {
    setProductsMap((prev) => {
      const existing = prev[barcode];
      if (!existing) return prev;
      const updated = {
        ...prev,
        [barcode]: {
          ...existing,
          custodyPath: [...existing.custodyPath, checkpoint]
        }
      };
      saveStoredProducts(updated);
      return updated;
    });
  };

  const handleClearAllData = () => {
    clearAllStoredData();
    setProductsMap({});
    setSelectedBarcode('');
    setCurrentUser(null);
  };

  const handleSeedSampleData = () => {
    setProductsMap(INITIAL_PRODUCTS);
    saveStoredProducts(INITIAL_PRODUCTS);
    const firstBarcode = Object.keys(INITIAL_PRODUCTS)[0];
    if (firstBarcode) setSelectedBarcode(firstBarcode);
  };

  const productsList = Object.values(productsMap);

  return (
    <div className="mesh-bg min-h-screen flex flex-col text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Fixed Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenQuickScan={() => handleVerifyBarcode('')}
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
            productsMap={productsMap}
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
            productsMap={productsMap}
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
            onNavigateTab={handleSelectTab}
          />
        )}

        {currentTab === 'authenticity-dashboard' && (
          <DashboardView
            products={productsList}
            onInspectBarcode={handleVerifyBarcode}
            onNavigateTab={handleSelectTab}
          />
        )}

        {currentTab === 'blockchain-explorer' && (
          <ExplorerView
            productsMap={productsMap}
            onInspectBarcode={handleVerifyBarcode}
          />
        )}

        {currentTab === 'manufacturer-portal' && (
          <ManufacturerView
            currentUser={currentUser}
            existingProducts={productsList}
            onAddNewProduct={handleAddNewProduct}
            onSelectTab={handleSelectTab}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer 
        onSelectTab={handleSelectTab}
        hasStoredData={productsList.length > 0}
        onClearAllData={handleClearAllData}
        onSeedSampleData={handleSeedSampleData}
      />
    </div>
  );
}

