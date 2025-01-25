import React, { useState } from 'react';
import { Plug, Plus, Trash2, Edit2, X, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';

interface ConnectorField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'select';
  required: boolean;
  options?: { value: string; label: string; }[];
}

interface ConnectorType {
  id: string;
  name: string;
  description: string;
  fields: ConnectorField[];
}

export default function ConfigConnectorTypes() {
  const [types, setTypes] = useState<ConnectorType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ConnectorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    fields: ConnectorField[];
  }>({
    name: '',
    description: '',
    fields: []
  });

  React.useEffect(() => {
    loadConnectorTypes();
  }, []);

  const loadConnectorTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('connector_types')
        .select('*');

      if (error) throw error;
      setTypes(data || []);
    } catch (err) {
      console.error('Error loading connector types:', err);
      setError('Failed to load connector types');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const typeData = {
        name: formData.name,
        description: formData.description,
        fields: formData.fields,
        user_id: user.id
      };

      if (editingType) {
        const { error } = await supabase
          .from('connector_types')
          .update(typeData)
          .eq('id', editingType.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('connector_types')
          .insert([typeData]);

        if (error) throw error;
      }

      await loadConnectorTypes();
      resetForm();
    } catch (err) {
      console.error('Error saving connector type:', err);
      setError('Error saving connector type');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this connector type?')) return;
    
    try {
      const { error } = await supabase
        .from('connector_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadConnectorTypes();
    } catch (err) {
      console.error('Error deleting connector type:', err);
      setError('Error deleting connector type');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      fields: []
    });
    setEditingType(null);
    setIsModalOpen(false);
  };

  const addField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          name: '',
          label: '',
          type: 'text',
          required: false
        }
      ]
    }));
  };

  const updateField = (index: number, field: Partial<ConnectorField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => 
        i === index ? { ...f, ...field } : f
      )
    }));
  };

  const removeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Plug className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Connector Types
          </h3>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={Plus}
        >
          New Type
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {types.map(type => (
          <div
            key={type.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  {type.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {type.description}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingType(type);
                    setFormData({
                      name: type.name,
                      description: type.description,
                      fields: type.fields
                    });
                    setIsModalOpen(true);
                  }}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(type.id)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Fields:
              </h5>
              {type.fields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {field.label}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({field.type}{field.required ? ', required' : ''})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={resetForm} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {editingType ? 'Edit Connector Type' : 'New Connector Type'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  fullWidth
                />

                <Input
                  label="Description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                  fullWidth
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Fields
                    </h4>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addField}
                      icon={Plus}
                      size="sm"
                    >
                      Add Field
                    </Button>
                  </div>

                  {formData.fields.map((field, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          Field {index + 1}
                        </h5>
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Name"
                          value={field.name}
                          onChange={e => updateField(index, { name: e.target.value })}
                          required
                        />
                        <Input
                          label="Label"
                          value={field.label}
                          onChange={e => updateField(index, { label: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Type
                          </label>
                          <select
                            value={field.type}
                            onChange={e => updateField(index, { type: e.target.value as any })}
                            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="text">Text</option>
                            <option value="password">Password</option>
                            <option value="select">Select</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={e => updateField(index, { required: e.target.checked })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Required
                            </span>
                          </label>
                        </div>
                      </div>

                      {field.type === 'select' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Options (one per line, format: value|label)
                          </label>
                          <textarea
                            value={field.options?.map(opt => `${opt.value}|${opt.label}`).join('\n') || ''}
                            onChange={e => {
                              const options = e.target.value.split('\n')
                                .map(line => {
                                  const [value, label] = line.split('|');
                                  return { value, label: label || value };
                                })
                                .filter(opt => opt.value);
                              updateField(index, { options });
                            }}
                            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    icon={Save}
                  >
                    {editingType ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}