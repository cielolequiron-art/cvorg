import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Wrench,
  MoreVertical,
  DollarSign,
  Image as ImageIcon,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vehicle } from '../types';

export const VehicleManager: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'v1', make: 'Kia', model: 'Sportage', year: 2017, status: 'available', price_per_day: 45 },
    { id: 'v2', make: 'Toyota', model: 'Camry', year: 2020, status: 'rented', price_per_day: 55 },
    { id: 'v3', make: 'Honda', model: 'Civic', year: 2019, status: 'maintenance', price_per_day: 40 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const filteredVehicles = vehicles.filter(v => 
    `${v.make} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      if (isAdding) {
        setVehicles([...vehicles, { ...editingVehicle, id: `v${Date.now()}` }]);
      } else {
        setVehicles(vehicles.map(v => v.id === editingVehicle.id ? editingVehicle : v));
      }
      setEditingVehicle(null);
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this vehicle from the fleet?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Vehicle Fleet</h2>
          <p className="text-slate-500 mt-1">Manage your inventory and availability status.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search fleet..."
              className="w-full lg:w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              setEditingVehicle({ id: '', make: '', model: '', year: new Date().getFullYear(), status: 'available', price_per_day: 0 });
              setIsAdding(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" /> Add Vehicle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <motion.div 
            key={vehicle.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden group"
          >
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                <ImageIcon className="w-12 h-12" />
              </div>
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                vehicle.status === 'available' ? 'bg-emerald-500 text-white' :
                vehicle.status === 'rented' ? 'bg-blue-500 text-white' :
                'bg-amber-500 text-white'
              }`}>
                {vehicle.status}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                  <p className="text-xs text-slate-500 font-medium">ID: {vehicle.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-900">${vehicle.price_per_day}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">per day</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingVehicle(vehicle);
                      setIsAdding(false);
                    }}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(vehicle.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">
                  View History
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {editingVehicle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">{isAdding ? 'Add New Vehicle' : 'Edit Vehicle Details'}</h3>
                <button onClick={() => setEditingVehicle(null)} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Make</label>
                    <input 
                      type="text" 
                      required
                      value={editingVehicle.make}
                      onChange={e => setEditingVehicle({...editingVehicle, make: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model</label>
                    <input 
                      type="text" 
                      required
                      value={editingVehicle.model}
                      onChange={e => setEditingVehicle({...editingVehicle, model: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Year</label>
                    <input 
                      type="number" 
                      required
                      value={editingVehicle.year}
                      onChange={e => setEditingVehicle({...editingVehicle, year: parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price / Day</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="number" 
                        required
                        value={editingVehicle.price_per_day}
                        onChange={e => setEditingVehicle({...editingVehicle, price_per_day: parseInt(e.target.value)})}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
                  <select 
                    value={editingVehicle.status}
                    onChange={e => setEditingVehicle({...editingVehicle, status: e.target.value as any})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold appearance-none"
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl">
                  {isAdding ? 'Add to Fleet' : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
