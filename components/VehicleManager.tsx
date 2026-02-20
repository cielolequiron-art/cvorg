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
  Trash2
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

  const filteredVehicles = vehicles.filter(v => 
    `${v.make} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
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
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
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
    </div>
  );
};
