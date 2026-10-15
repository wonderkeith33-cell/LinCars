import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchFilter from './components/SearchFilter';
import VehicleCard from './components/VehicleCard';
import VehicleDetailModal from './components/VehicleDetailModal';
import PriceComparisonModal from './components/PriceComparisonModal';
import VehicleManagementModal from './components/VehicleManagementModal';
import { Car, Sparkles, ShieldCheck, ArrowUpDown, Scale, CheckCircle } from 'lucide-react';

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'manage'

  // Filter state
  const [filters, setFilters] = useState({
    query: '',
    make: '',
    condition: '',
    bodyType: '',
    fuelType: '',
    maxPrice: ''
  });

  // Selected for comparison
  const [comparedIds, setComparedIds] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Selected vehicle for details modal
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Management modal state
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // Sort state
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'year-desc'

  // Fetch vehicles
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.query) queryParams.append('query', filters.query);
      if (filters.make) queryParams.append('make', filters.make);
      if (filters.condition) queryParams.append('condition', filters.condition);
      if (filters.bodyType) queryParams.append('bodyType', filters.bodyType);
      if (filters.fuelType) queryParams.append('fuelType', filters.fuelType);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

      const res = await fetch(`/api/cars?${queryParams.toString()}`);
      const json = await res.json();
      if (json.success) {
        setVehicles(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  // Distinct makes and body types
  const makes = Array.from(new Set(vehicles.map(v => v.make))).sort();
  const bodyTypes = Array.from(new Set(vehicles.map(v => v.bodyType))).sort();

  // Handle comparison toggle
  const handleToggleCompare = (id) => {
    setComparedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 vehicles at once.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      query: '',
      make: '',
      condition: '',
      bodyType: '',
      fuelType: '',
      maxPrice: ''
    });
  };

  // Add vehicle
  const handleAddVehicle = async (vehicleData) => {
    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData)
      });
      const json = await res.json();
      if (json.success) {
        await fetchVehicles();
      }
    } catch (err) {
      console.error('Failed to add vehicle:', err);
    }
  };

  // Update vehicle
  const handleUpdateVehicle = async (id, vehicleData) => {
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData)
      });
      const json = await res.json();
      if (json.success) {
        await fetchVehicles();
        if (selectedVehicle?.id === id) {
          setSelectedVehicle(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to update vehicle:', err);
    }
  };

  // Delete vehicle
  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to remove this listing?')) return;
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setComparedIds(prev => prev.filter(cId => cId !== id));
        if (selectedVehicle?.id === id) setSelectedVehicle(null);
        await fetchVehicles();
      }
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
    }
  };

  // Sorting logic
  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'year-desc') return b.year - a.year;
    return 0; // default
  });

  const comparedVehicles = vehicles.filter(v => comparedIds.includes(v.id));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">

      {/* Header Navigation */}
      <Header
        onOpenAddModal={() => setIsManageModalOpen(true)}
        compareCount={comparedIds.length}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'manage') setIsManageModalOpen(true);
        }}
      />

      {/* Hero Banner Section */}
      <section className="bg-slate-900 text-white relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Vehicle Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Find, Compare, and Drive <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Your Dream Vehicle
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore premium listings with verified specifications, side-by-side pricing analysis, interactive image galleries, and instant seller contact.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Inspection Data</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Scale className="w-4 h-4 text-blue-400" />
                <span>Real-Time Price Comparisons</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-indigo-400" />
                <span>Direct Seller Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

        {/* Search and Filters */}
        <SearchFilter
          filters={filters}
          setFilters={setFilters}
          makes={makes}
          bodyTypes={bodyTypes}
          onReset={handleResetFilters}
        />

        {/* Results Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Available Inventory
            </h2>
            <p className="text-xs text-slate-500">
              Showing <span className="font-bold text-slate-800">{sortedVehicles.length}</span> vehicles matching your criteria
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured / Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Newest Year First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3">
                <div className="bg-slate-200 h-44 rounded-xl"></div>
                <div className="bg-slate-200 h-4 w-1/2 rounded"></div>
                <div className="bg-slate-200 h-6 w-3/4 rounded"></div>
                <div className="bg-slate-100 h-16 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : sortedVehicles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12 space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Car className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No vehicles match your search</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your filter options or search term to discover available inventory.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedVehicles.map((car) => (
              <VehicleCard
                key={car.id}
                vehicle={car}
                onViewDetails={(v) => setSelectedVehicle(v)}
                isCompared={comparedIds.includes(car.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>
        )}

      </main>

      {/* Floating Comparison Bar Sticky Footer */}
      {comparedIds.length > 0 && !isCompareModalOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <Scale className="w-4 h-4 text-blue-400" />
            <span>{comparedIds.length} Vehicles Selected</span>
          </div>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-4 py-1.5 rounded-xl transition-colors shadow-md"
          >
            Compare Now
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onToggleCompare={handleToggleCompare}
          isCompared={comparedIds.includes(selectedVehicle.id)}
        />
      )}

      {/* Comparison Modal */}
      {isCompareModalOpen && (
        <PriceComparisonModal
          comparedVehicles={comparedVehicles}
          onClose={() => setIsCompareModalOpen(false)}
          onRemove={handleToggleCompare}
          onClearAll={() => setComparedIds([])}
        />
      )}

      {/* Management / Seller Dashboard Modal */}
      <VehicleManagementModal
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setActiveTab('browse');
        }}
        vehicles={vehicles}
        onAddVehicle={handleAddVehicle}
        onUpdateVehicle={handleUpdateVehicle}
        onDeleteVehicle={handleDeleteVehicle}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Car className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-sm">LinCars Auto</span>
          </div>
          <p>© {new Date().getFullYear()} LinCars Marketplace. All vehicle specifications and prices verified.</p>
        </div>
      </footer>

    </div>
  );
}
