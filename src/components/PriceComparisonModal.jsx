import React from 'react';
import { X, Scale, Trash2, Trophy, DollarSign, Zap, Check, AlertCircle } from 'lucide-react';

export default function PriceComparisonModal({ comparedVehicles, onClose, onRemove, onClearAll }) {
  if (!comparedVehicles) return null;

  const count = comparedVehicles.length;

  const minPrice = count > 0 ? Math.min(...comparedVehicles.map(c => c.price)) : 0;
  const maxPrice = count > 0 ? Math.max(...comparedVehicles.map(c => c.price)) : 0;
  const priceDelta = maxPrice - minPrice;

  const maxHorsepower = count > 0 ? Math.max(...comparedVehicles.map(c => c.horsepower || 0)) : 0;

  const formatPrice = (p) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl overflow-hidden my-auto max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black">Vehicle Comparison Matrix</h2>
              <p className="text-xs text-slate-400">Comparing side-by-side pricing, performance & specs</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {count > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs font-bold text-slate-400 hover:text-red-400 flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-800/80 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">

          {count < 2 ? (
            <div className="text-center py-12 px-4 space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Select at least 2 vehicles to compare</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Click the <Scale className="w-3.5 h-3.5 inline text-blue-600" /> icon on any vehicle card in the marketplace to add it to your comparison grid.
              </p>
            </div>
          ) : (
            <>
              {/* Comparison Summary Analytics Banner */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <DollarSign className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-300 block font-semibold">Price Delta Range</span>
                    <span className="text-base font-extrabold text-white">{formatPrice(priceDelta)} difference</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-slate-300 block font-semibold">Lowest Price Pick</span>
                    <span className="text-base font-extrabold text-white">
                      {formatPrice(minPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <Zap className="w-6 h-6 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-slate-300 block font-semibold">Peak Horsepower</span>
                    <span className="text-base font-extrabold text-white">{maxHorsepower} HP</span>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr>
                      <th className="p-4 bg-slate-100 text-slate-600 font-extrabold text-xs uppercase tracking-wider w-44 rounded-tl-xl border-b border-slate-200">
                        Specification
                      </th>
                      {comparedVehicles.map((car) => (
                        <th key={car.id} className="p-4 bg-slate-50 border-b border-slate-200 min-w-[220px] align-top">
                          <div className="space-y-3 relative">
                            <button
                              onClick={() => onRemove(car.id)}
                              className="absolute top-0 right-0 text-slate-400 hover:text-red-500 p-1"
                              title="Remove vehicle"
                            >
                              <X className="w-4 h-4" />
                            </button>

                            <img
                              src={car.images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'}
                              alt={car.model}
                              className="w-full h-28 object-cover rounded-xl shadow-sm"
                            />

                            <div>
                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
                                {car.year} {car.make}
                              </span>
                              <h4 className="font-black text-slate-900 text-sm">{car.model}</h4>
                            </div>

                            <div className="text-xl font-black text-slate-900">
                              {formatPrice(car.price)}
                              {car.price === minPrice && (
                                <span className="ml-2 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block">
                                  Best Price
                                </span>
                              )}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50">Condition</td>
                      {comparedVehicles.map(c => (
                        <td key={c.id} className="p-4 font-semibold">{c.condition}</td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50">Horsepower</td>
                      {comparedVehicles.map(c => (
                        <td key={c.id} className={`p-4 font-bold ${c.horsepower === maxHorsepower ? 'text-blue-600 font-extrabold' : ''}`}>
                          {c.horsepower ? `${c.horsepower} HP` : 'N/A'}
                          {c.horsepower === maxHorsepower && ' ⚡ (Top Power)'}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50">Engine</td>
                      {comparedVehicles.map(c => (
                        <td key={c.id} className="p-4">{c.engine || 'N/A'}</td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50">Transmission</td>
                      {comparedVehicles.map(c => (
                        <td key={c.id} className="p-4">{c.transmission || 'N/A'}</td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50">Drivetrain</td>
                      {comparedVehicles.map(c => (
                        <td key={c.id} className="p-4">{c.drivetrain || 'N/A'}</td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50">Mileage</td>
                      {comparedVehicles.map(c => (
                        <td key={c.id} className="p-4 font-semibold">
                          {c.mileage ? `${new Intl.NumberFormat().format(c.mileage)} mi` : 'Brand New'}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50">Fuel Type</td>
                      {comparedVehicles.map(c => (
                        <td key={c.id} className="p-4">{c.fuelType || 'Gasoline'}</td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50">Key Highlights</td>
                      {comparedVehicles.map(c => (
                        <td key={c.id} className="p-4">
                          <ul className="space-y-1">
                            {c.features?.slice(0, 3).map((f, i) => (
                              <li key={i} className="flex items-center space-x-1 text-[11px]">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
