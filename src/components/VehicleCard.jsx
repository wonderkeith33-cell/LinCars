import React from 'react';
import { Gauge, Zap, MapPin, Scale, Eye, Check } from 'lucide-react';

export default function VehicleCard({ vehicle, onViewDetails, isCompared, onToggleCompare }) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(vehicle.price);

  const formattedMileage = vehicle.mileage
    ? new Intl.NumberFormat('en-US').format(vehicle.mileage) + ' mi'
    : 'Brand New';

  const mainImage = vehicle.images && vehicle.images.length > 0
    ? vehicle.images[0]
    : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">

      {/* Image & Top Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={mainImage}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${
            vehicle.condition === 'New'
              ? 'bg-emerald-500/90 text-white'
              : 'bg-slate-900/80 text-slate-100'
          }`}>
            {vehicle.condition}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800 shadow-sm backdrop-blur-md">
            {vehicle.bodyType}
          </span>
        </div>

        {/* Compare Select Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(vehicle.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
            isCompared
              ? 'bg-blue-600 text-white hover:bg-blue-700 ring-2 ring-blue-300'
              : 'bg-slate-900/60 text-white hover:bg-slate-900/90'
          }`}
          title={isCompared ? 'Remove from comparison' : 'Add to compare'}
        >
          {isCompared ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
        </button>

        {/* Image count badge */}
        {vehicle.images && vehicle.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-slate-900/70 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
            📷 {vehicle.images.length} Photos
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs font-bold uppercase text-blue-600 tracking-wider">
              {vehicle.year} {vehicle.make}
            </span>
            <span className="text-2xl font-black text-slate-900">
              {formattedPrice}
            </span>
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 line-clamp-1 mb-3">
            {vehicle.model}
          </h3>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 rounded-xl p-3 mb-4">
            <div className="flex items-center space-x-1.5">
              <Gauge className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{formattedMileage}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{vehicle.horsepower ? `${vehicle.horsepower} HP` : vehicle.engine || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 font-bold shrink-0">⚙️</span>
              <span className="truncate">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{vehicle.location || 'USA'}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            {vehicle.seller?.type === 'Dealer' ? '🏢 Dealer' : '👤 Private Seller'}
          </span>

          <button
            onClick={() => onViewDetails(vehicle)}
            className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>

      </div>

    </div>
  );
}
