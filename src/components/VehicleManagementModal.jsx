import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Image, Car, DollarSign } from 'lucide-react';

export default function VehicleManagementModal({ isOpen, onClose, vehicles, onAddVehicle, onUpdateVehicle, onDeleteVehicle }) {
  if (!isOpen) return null;

  const initialFormState = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    condition: 'Used',
    bodyType: 'Sedan',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    engine: '',
    horsepower: '',
    drivetrain: 'AWD',
    exteriorColor: '',
    interiorColor: '',
    vin: '',
    location: '',
    description: '',
    imageUrl: '',
    sellerName: 'LinCars Certified Seller',
    sellerType: 'Dealer',
    sellerPhone: '+1 (555) 019-2831'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [featuresList, setFeaturesList] = useState([]);
  const [featureInput, setFeatureInput] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const resetForm = () => {
    setFormData(initialFormState);
    setFeaturesList([]);
    setEditingId(null);
    setFormError('');
  };

  const handleEditClick = (car) => {
    setEditingId(car.id);
    setFormData({
      make: car.make || '',
      model: car.model || '',
      year: car.year || new Date().getFullYear(),
      price: car.price || '',
      mileage: car.mileage || '',
      condition: car.condition || 'Used',
      bodyType: car.bodyType || 'Sedan',
      fuelType: car.fuelType || 'Gasoline',
      transmission: car.transmission || 'Automatic',
      engine: car.engine || '',
      horsepower: car.horsepower || '',
      drivetrain: car.drivetrain || 'AWD',
      exteriorColor: car.exteriorColor || '',
      interiorColor: car.interiorColor || '',
      vin: car.vin || '',
      location: car.location || '',
      description: car.description || '',
      imageUrl: car.images?.[0] || '',
      sellerName: car.seller?.name || 'LinCars Certified Seller',
      sellerType: car.seller?.type || 'Dealer',
      sellerPhone: car.seller?.phone || '+1 (555) 019-2831'
    });
    setFeaturesList(car.features || []);
    setFormError('');
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeaturesList(prev => [...prev, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFeaturesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.make || !formData.model || !formData.price || !formData.year) {
      setFormError('Please fill out all required fields (Make, Model, Year, Price)');
      return;
    }

    const payload = {
      make: formData.make,
      model: formData.model,
      year: Number(formData.year),
      price: Number(formData.price),
      mileage: Number(formData.mileage || 0),
      condition: formData.condition,
      bodyType: formData.bodyType,
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      engine: formData.engine,
      horsepower: Number(formData.horsepower || 0),
      drivetrain: formData.drivetrain,
      exteriorColor: formData.exteriorColor,
      interiorColor: formData.interiorColor,
      vin: formData.vin,
      location: formData.location,
      description: formData.description,
      images: formData.imageUrl ? [formData.imageUrl] : ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'],
      features: featuresList,
      seller: {
        name: formData.sellerName,
        type: formData.sellerType,
        phone: formData.sellerPhone,
        rating: 5.0
      }
    };

    if (editingId) {
      await onUpdateVehicle(editingId, payload);
      setFormSuccess('Listing updated successfully!');
    } else {
      await onAddVehicle(payload);
      setFormSuccess('Vehicle listed successfully!');
    }

    resetForm();
    setTimeout(() => setFormSuccess(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden my-auto max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black">
                {editingId ? 'Edit Vehicle Listing' : 'Vehicle Inventory & Management'}
              </h2>
              <p className="text-xs text-slate-400">Add, update or manage vehicle inventory for buyers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-8">

          {formSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center space-x-2 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center space-x-2 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                {editingId ? '✏️ Edit Vehicle Specs' : '➕ Add New Vehicle Listing'}
              </h3>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Cancel Edit & Add New
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Make *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BMW"
                  value={formData.make}
                  onChange={e => setFormData({ ...formData, make: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Model *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M4 Competition"
                  value={formData.model}
                  onChange={e => setFormData({ ...formData, model: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Year *</label>
                <input
                  type="number"
                  required
                  placeholder="2024"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Price ($ USD) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 75000"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Condition</label>
                <select
                  value={formData.condition}
                  onChange={e => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Body Style</label>
                <select
                  value={formData.bodyType}
                  onChange={e => setFormData({ ...formData, bodyType: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Coupe">Coupe</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Wagon">Wagon</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mileage (Miles)</label>
                <input
                  type="number"
                  placeholder="e.g. 12000"
                  value={formData.mileage}
                  onChange={e => setFormData({ ...formData, mileage: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Horsepower (HP)</label>
                <input
                  type="number"
                  placeholder="e.g. 503"
                  value={formData.horsepower}
                  onChange={e => setFormData({ ...formData, horsepower: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Fuel Type</label>
                <select
                  value={formData.fuelType}
                  onChange={e => setFormData({ ...formData, fuelType: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Gasoline">Gasoline</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Transmission</label>
                <input
                  type="text"
                  placeholder="e.g. 8-Speed Automatic"
                  value={formData.transmission}
                  onChange={e => setFormData({ ...formData, transmission: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Los Angeles, CA"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Main Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Description & Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Vehicle Description</label>
                <textarea
                  rows="3"
                  placeholder="Provide detailed information about history, condition, package options..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Features & Key Packages</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Carbon Fiber Trim, HUD"
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-slate-800 text-white font-bold px-3 py-2 rounded-lg hover:bg-slate-700"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {featuresList.map((f, idx) => (
                    <span key={idx} className="bg-slate-200 text-slate-800 px-2 py-1 rounded-md text-[11px] font-semibold flex items-center space-x-1">
                      <span>{f}</span>
                      <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-slate-500 hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-6 py-2.5 rounded-xl shadow-md transition-all"
              >
                {editingId ? 'Save Changes' : 'Publish Vehicle Listing'}
              </button>
            </div>
          </form>

          {/* Current Listings List */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Current Marketplace Listings ({vehicles.length})
            </h3>

            <div className="grid grid-cols-1 divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {vehicles.map(car => (
                <div key={car.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img
                      src={car.images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'}
                      alt={car.model}
                      className="w-16 h-12 object-cover rounded-xl"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {car.year} {car.make} {car.model}
                      </h4>
                      <p className="text-xs text-slate-500">
                        ${new Intl.NumberFormat().format(car.price)} • {car.condition} • {car.bodyType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditClick(car)}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit listing"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteVehicle(car.id)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
