import React, { useState } from 'react';
import { 
  FileJson, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  CheckCircle2, 
  Code,
  Layout,
  History,
  X,
  Save,
  ChevronRight,
  Settings2,
  GripVertical,
  Type,
  Hash,
  Calendar,
  CheckSquare,
  ChevronDown,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormSchema, FormStep, FormField } from '../types';

interface FormBuilderProps {
  activeSchema: FormSchema;
  onSaveSchema: (schema: FormSchema) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ activeSchema, onSaveSchema }) => {
  const [forms, setForms] = useState<FormSchema[]>([
    activeSchema,
    {
      id: '2',
      name: 'Short-Term Weekend Form',
      version: '1.1.0',
      is_active: false,
      schema: { 
        steps: [
          { id: 's1', label: 'Basic Info', fields: [] }
        ] 
      }
    }
  ]);

  const [editingForm, setEditingForm] = useState<FormSchema | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this form schema?')) {
      setForms(forms.filter(f => f.id !== id));
    }
  };

  const handleClone = (form: FormSchema) => {
    const clonedForm: FormSchema = {
      ...form,
      id: Date.now().toString(),
      name: `${form.name} (Copy)`,
      is_active: false,
      version: '1.0.0'
    };
    setForms([...forms, clonedForm]);
  };

  const handleToggleActive = (id: string) => {
    const targetForm = forms.find(f => f.id === id);
    if (targetForm) {
      onSaveSchema(targetForm);
    }
    setForms(forms.map(f => ({
      ...f,
      is_active: f.id === id
    })));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingForm) {
      let updatedForms;
      if (isCreating) {
        updatedForms = [...forms, { ...editingForm, id: Date.now().toString() }];
      } else {
        updatedForms = forms.map(f => f.id === editingForm.id ? editingForm : f);
      }
      
      setForms(updatedForms);
      
      // If the edited form was the active one, update the global state
      if (editingForm.is_active) {
        onSaveSchema(editingForm);
      }

      setEditingForm(null);
      setIsCreating(false);
    }
  };

  const addStep = () => {
    if (!editingForm) return;
    const newStep: FormStep = {
      id: `step_${Date.now()}`,
      label: `New Step ${editingForm.schema.steps.length + 1}`,
      fields: []
    };
    const newSteps = [...editingForm.schema.steps, newStep];
    setEditingForm({ ...editingForm, schema: { ...editingForm.schema, steps: newSteps } });
    setActiveStepIndex(newSteps.length - 1);
  };

  const removeStep = (index: number) => {
    if (!editingForm) return;
    const newSteps = editingForm.schema.steps.filter((_: any, i: number) => i !== index);
    setEditingForm({ ...editingForm, schema: { ...editingForm.schema, steps: newSteps } });
    if (activeStepIndex >= newSteps.length) setActiveStepIndex(Math.max(0, newSteps.length - 1));
  };

  const addField = (stepIndex: number) => {
    if (!editingForm) return;
    const newField: FormField = {
      id: `field_${Date.now()}`,
      name: `field_${editingForm.schema.steps[stepIndex].fields.length + 1}`,
      label: 'New Field',
      type: 'text',
      required: false
    };
    const newSteps = [...editingForm.schema.steps];
    newSteps[stepIndex].fields.push(newField);
    setEditingForm({ ...editingForm, schema: { ...editingForm.schema, steps: newSteps } });
  };

  const updateField = (stepIndex: number, fieldIndex: number, updates: Partial<FormField>) => {
    if (!editingForm) return;
    const newSteps = [...editingForm.schema.steps];
    newSteps[stepIndex].fields[fieldIndex] = { ...newSteps[stepIndex].fields[fieldIndex], ...updates };
    setEditingForm({ ...editingForm, schema: { ...editingForm.schema, steps: newSteps } });
  };

  const removeField = (stepIndex: number, fieldIndex: number) => {
    if (!editingForm) return;
    const newSteps = [...editingForm.schema.steps];
    newSteps[stepIndex].fields = newSteps[stepIndex].fields.filter((_: any, i: number) => i !== fieldIndex);
    setEditingForm({ ...editingForm, schema: { ...editingForm.schema, steps: newSteps } });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Visual Form Builder</h2>
          <p className="text-slate-500 mt-1">Design your application flow with a simple drag-and-drop interface.</p>
        </div>
        <button 
          onClick={() => {
            setEditingForm({ 
              id: '', 
              name: '', 
              version: '1.0.0', 
              is_active: false, 
              schema: { steps: [{ id: 's1', label: 'Step 1', fields: [] }] } 
            });
            setIsCreating(true);
            setActiveStepIndex(0);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" /> Create New Form
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {forms.map((form) => (
          <motion.div 
            key={form.id}
            whileHover={{ y: -2 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between group"
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                form.is_active ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
              }`}>
                <Layout className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-lg text-slate-900">{form.name}</h4>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider">v{form.version}</span>
                  {form.is_active && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Layout className="w-3 h-3" /> {form.schema.steps.length} Steps
                  </span>
                  <button 
                    onClick={() => handleToggleActive(form.id)}
                    className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${form.is_active ? 'text-slate-300' : 'text-blue-600 hover:text-blue-500'}`}
                    disabled={form.is_active}
                  >
                    {form.is_active ? 'Current Production' : 'Set as Active'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleClone(form)}
                className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all" 
                title="Clone Form"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setEditingForm(form)}
                className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all" 
                title="Edit Form"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleDelete(form.id)}
                className="p-3 bg-slate-50 text-rose-600 rounded-xl hover:bg-rose-50 transition-all" 
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visual Editor Modal */}
      <AnimatePresence>
        {editingForm && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 rounded-2xl text-white">
                    <Layout className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{isCreating ? 'Build New Form' : 'Edit Form Structure'}</h3>
                    <p className="text-slate-500 text-sm">Add steps and fields to customize your application flow.</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setEditingForm(null); setIsCreating(false); }}
                  className="p-2 hover:bg-slate-200 rounded-xl transition-all"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Left: Steps Navigation */}
                <div className="w-1/4 border-r border-slate-100 bg-slate-50/50 p-6 flex flex-col">
                  <div className="mb-6">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Form Name</label>
                    <input 
                      type="text" 
                      value={editingForm.name}
                      onChange={(e) => setEditingForm({...editingForm, name: e.target.value})}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all text-sm font-semibold"
                      placeholder="Enter form name..."
                    />
                  </div>

                  <div className="flex-1 overflow-auto space-y-2">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Steps</h4>
                      <button 
                        onClick={addStep}
                        className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {editingForm.schema.steps.map((step: any, index: number) => (
                      <div 
                        key={step.id}
                        onClick={() => setActiveStepIndex(index)}
                        className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                          activeStepIndex === index 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                            activeStepIndex === index ? 'bg-white/20' : 'bg-slate-100'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="text-sm font-bold truncate">{step.label}</span>
                        </div>
                        {editingForm.schema.steps.length > 1 && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeStep(index); }}
                            className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all ${
                              activeStepIndex === index ? 'text-white' : 'text-red-500'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Step Content Editor */}
                <div className="flex-1 p-10 overflow-auto bg-white">
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-10 flex items-center justify-between border-b border-slate-100 pb-6 gap-6">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Step Label</label>
                        <input 
                          type="text" 
                          value={editingForm.schema.steps[activeStepIndex].label}
                          onChange={(e) => {
                            const newSteps = [...editingForm.schema.steps];
                            newSteps[activeStepIndex].label = e.target.value;
                            setEditingForm({ ...editingForm, schema: { ...editingForm.schema, steps: newSteps } });
                          }}
                          className="text-3xl font-bold text-slate-900 bg-transparent border-none outline-none w-full p-0 focus:ring-0"
                          placeholder="Enter step label..."
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Grid Columns</label>
                          <select 
                            value={editingForm.schema.steps[activeStepIndex].gridCols || 1}
                            onChange={(e) => {
                              const newSteps = [...editingForm.schema.steps];
                              newSteps[activeStepIndex].gridCols = parseInt(e.target.value) as any;
                              setEditingForm({ ...editingForm, schema: { ...editingForm.schema, steps: newSteps } });
                            }}
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                          >
                            <option value={1}>1 Column</option>
                            <option value={2}>2 Columns</option>
                            <option value={3}>3 Columns</option>
                          </select>
                        </div>
                        <button 
                          onClick={() => addField(activeStepIndex)}
                          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all self-end"
                        >
                          <Plus className="w-4 h-4" /> Add Field
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {editingForm.schema.steps[activeStepIndex].fields.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-slate-200" />
                          </div>
                          <p className="text-slate-400 font-medium">No fields in this step. Click "Add Field" to start.</p>
                        </div>
                      ) : (
                        editingForm.schema.steps[activeStepIndex].fields.map((field: any, fIndex: number) => (
                          <motion.div 
                            key={field.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group relative"
                          >
                            <div className="grid grid-cols-12 gap-6 items-end">
                              <div className="col-span-1 flex items-center justify-center">
                                <GripVertical className="w-5 h-5 text-slate-300 cursor-grab" />
                              </div>
                              <div className="col-span-3 space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Field Label</label>
                                <input 
                                  type="text" 
                                  value={field.label}
                                  onChange={(e) => updateField(activeStepIndex, fIndex, { label: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-semibold"
                                />
                              </div>
                              <div className="col-span-2 space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal Name</label>
                                <input 
                                  type="text" 
                                  value={field.name}
                                  onChange={(e) => updateField(activeStepIndex, fIndex, { name: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-semibold"
                                  placeholder="e.g. fullName"
                                />
                              </div>
                              <div className="col-span-2 space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</label>
                                <div className="relative">
                                  <select 
                                    value={field.type}
                                    onChange={(e) => updateField(activeStepIndex, fIndex, { type: e.target.value as any })}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-semibold appearance-none"
                                  >
                                    <option value="text">Text Input</option>
                                    <option value="number">Number</option>
                                    <option value="date">Date Picker</option>
                                    <option value="select">Dropdown</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="file">File Upload</option>
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                              </div>
                              <div className="col-span-2 flex items-center gap-4 h-[46px]">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={field.required}
                                    onChange={(e) => updateField(activeStepIndex, fIndex, { required: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Required</span>
                                </label>
                              </div>
                              <div className="col-span-2 flex justify-end h-[46px]">
                                <button 
                                  onClick={() => removeField(activeStepIndex, fIndex)}
                                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>

                              {/* Additional Options for Select */}
                              {field.type === 'select' && (
                                <div className="col-span-11 col-start-2 mt-2 p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Dropdown Options (Value:Label, one per line)</label>
                                  <textarea 
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-blue-500 transition-all"
                                    rows={3}
                                    value={field.options?.map((o: any) => `${o.value}:${o.label}`).join('\n') || ''}
                                    onChange={(e) => {
                                      const options = e.target.value.split('\n').filter(l => l.includes(':')).map(l => {
                                        const [value, label] = l.split(':');
                                        return { value: value.trim(), label: label.trim() };
                                      });
                                      updateField(activeStepIndex, fIndex, { options });
                                    }}
                                    placeholder="yes:Yes&#10;no:No"
                                  />
                                </div>
                              )}

                              {/* Placeholder & Description */}
                              <div className="col-span-11 col-start-2 mt-2 grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Placeholder</label>
                                  <input 
                                    type="text" 
                                    value={field.placeholder || ''}
                                    onChange={(e) => updateField(activeStepIndex, fIndex, { placeholder: e.target.value })}
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-xs"
                                    placeholder="e.g. Enter your name..."
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description / Tooltip</label>
                                  <input 
                                    type="text" 
                                    value={field.description || ''}
                                    onChange={(e) => updateField(activeStepIndex, fIndex, { description: e.target.value })}
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-xs"
                                    placeholder="Help text for the user..."
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => { setEditingForm(null); setIsCreating(false); }}
                  className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" /> Save Form Structure
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
