import React from 'react';
import { Car, PlusCircle, Scale, Search, ShieldCheck } from 'lucide-react';

export default function Header({ onOpenAddModal, compareCount, onOpenCompareModal, activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('browse')}>
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
                LinCars<span className="text-blue-500">Auto</span>
              </span>
              <span className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                Premium Marketplace
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
                activeTab === 'browse'
                  ? 'bg-slate-800 text-blue-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Browse Inventory
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
                activeTab === 'manage'
                  ? 'bg-slate-800 text-blue-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Seller Dashboard
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenCompareModal}
              className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-lg border text-sm font-semibold transition-all ${
                compareCount > 0
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                  : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
              }`}
            >
              <Scale className="w-4 h-4 text-blue-400" />
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Vehicle</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
