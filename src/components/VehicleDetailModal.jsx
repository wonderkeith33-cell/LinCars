import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Scale, Check, Phone, Mail, Shield, Zap, Gauge, MapPin, Tag, User } from 'lucide-react';

export default function VehicleDetailModal({ vehicle, onClose, onToggleCompare, isCompared }) {
  if (!vehicle) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const images = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'];

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(vehicle.price);

  const formattedMileage = vehicle.mileage
    ? new Intl.NumberFormat('en-US').format(vehicle.mileage) + ' miles'
    : 'Brand New';

  const handlePrevImage = () => {
    setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6">

      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden my-auto max-h-[92vh] flex flex-col">

        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
              {vehicle.year} {vehicle.make}
            </span>
            <h2 className="text-xl sm:text-2xl font-black">{vehicle.model}</h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onToggleCompare(vehicle.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isCompared
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {isCompared ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">

          {/* Gallery Carousel & Quick Purchase Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Gallery (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={images[activeImageIndex]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs font-semibold px-3 py-1 rounded-lg backdrop-blur-md">
                  Image {activeImageIndex + 1} of {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-thin">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Summary Info (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                <div>
                  <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">Listing Price</div>
                  <div className="text-3xl font-black text-slate-900">{formattedPrice}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="block text-slate-500 font-semibold mb-0.5">Condition</span>
                    <span className="font-extrabold text-slate-900">{vehicle.condition}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="block text-slate-500 font-semibold mb-0.5">Mileage</span>
                    <span className="font-extrabold text-slate-900">{formattedMileage}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="block text-slate-500 font-semibold mb-0.5">Drivetrain</span>
                    <span className="font-extrabold text-slate-900">{vehicle.drivetrain || 'N/A'}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="block text-slate-500 font-semibold mb-0.5">Location</span>
                    <span className="font-extrabold text-slate-900 truncate block">{vehicle.location || 'USA'}</span>
                  </div>
                </div>

                {/* Seller Box */}
                {vehicle.seller && (
                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{vehicle.seller.name}</span>
                      <span className="text-slate-500">{vehicle.seller.type} • ⭐ {vehicle.seller.rating || '5.0'}</span>
                    </div>
                    <a
                      href={`tel:${vehicle.seller.phone}`}
                      className="flex items-center space-x-1 text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Inquiry Form */}
              <div className="bg-blue-900 text-white p-5 rounded-2xl shadow-md">
                <h3 className="text-sm font-extrabold mb-2 flex items-center space-x-1.5">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Send Inquiry to Seller</span>
                </h3>

                {contactSubmitted ? (
                  <div className="bg-emerald-500/20 text-emerald-200 p-3 rounded-xl text-xs font-semibold border border-emerald-500/30">
                    ✅ Your message was sent! The seller will get back to you shortly.
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email or Phone"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                    >
                      Inquire About Vehicle
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>

          {/* Complete Specification Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 pb-2 border-b border-slate-200">
              Detailed Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 font-semibold block mb-0.5">Engine</span>
                <span className="font-extrabold text-slate-900">{vehicle.engine || 'N/A'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 font-semibold block mb-0.5">Horsepower</span>
                <span className="font-extrabold text-slate-900">{vehicle.horsepower ? `${vehicle.horsepower} HP` : 'N/A'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 font-semibold block mb-0.5">Transmission</span>
                <span className="font-extrabold text-slate-900">{vehicle.transmission || 'N/A'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 font-semibold block mb-0.5">Fuel Type</span>
                <span className="font-extrabold text-slate-900">{vehicle.fuelType || 'Gasoline'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 font-semibold block mb-0.5">Exterior Color</span>
                <span className="font-extrabold text-slate-900">{vehicle.exteriorColor || 'N/A'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 font-semibold block mb-0.5">Interior Color</span>
                <span className="font-extrabold text-slate-900">{vehicle.interiorColor || 'N/A'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 font-semibold block mb-0.5">Body Style</span>
                <span className="font-extrabold text-slate-900">{vehicle.bodyType}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 font-semibold block mb-0.5">VIN</span>
                <span className="font-mono font-bold text-slate-700">{vehicle.vin || 'Available on request'}</span>
              </div>
            </div>
          </div>

          {/* Features & Options */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-900 pb-2 border-b border-slate-200">
                Included Features & Options
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-semibold text-slate-700">
                {vehicle.features.map((feature, i) => (
                  <div key={i} className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {vehicle.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 pb-2 border-b border-slate-200">
                Seller Overview
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                {vehicle.description}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
