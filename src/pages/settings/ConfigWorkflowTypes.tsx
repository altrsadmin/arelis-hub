import React, { useState } from 'react';
import { Bot, Plus, Trash2, Edit2, X, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface WorkflowField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'select';
  required: boolean;
  options?: { value: string; label: string; }[];
}

interface WorkflowType {
  id: string;
  name: string;
  description: string;
  fields: WorkflowField[];
}

export default function ConfigWorkflowTypes() {
  const [types, setTypes] = useState<WorkflowType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<WorkflowType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    fields: WorkflowField[];
  }>({
    name: '',
    description: '',
    fields: []
  });

  React.useEffect(() => {
    loadWorkflowTypes();
  }, []);

  const loadWorkflowTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workflow_types')
        .select('*');

      if (error) throw error;
      setTypes(data || []);
    } catch (err) {
      console.error('Error loading workflow types:', err);
      setError('Failed to load workflow types');
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
          .from('workflow_types')
          .update(typeData)
          .eq('id', editingType.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('workflow_types')
          .insert([typeData]);

        if (error) throw error;
      }

      await loadWorkflowTypes();
      resetForm();
    } catch (err) {
      console.error('Error saving workflow type:', err);
      setError('Error saving workflow type');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('common.confirm'))) return;
    
    try {
      const { error } = await supabase
        .from('workflow_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadWorkflowTypes();
    } catch (err) {
      console.error('Error deleting workflow type:', err);
      setError('Error deleting workflow type');
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

  const updateField = (index: number, field: Partial<WorkflowField>) => {
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
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-[#0099ff] dark:bg-[#2afbc6] animate-[bounce_0.7s_infinite]" />
          <div className="w-2 h-2 rounded-full bg-[#0099ff] dark:bg-[#2afbc6] animate-[bounce_0.7s_0.1s_infinite]" />
          <div className="w-2 h-2 rounded-full bg-[#0099ff] dark:bg-[#2afbc6] animate-[bounce_0.7s_0.2s_infinite]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('settings.workflowTypes')}
          </h3>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={Plus}
        >
          {t('common.create')}
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
                {t('common.fields')}:
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
                      ({field.type}{field.required ? ', ' + t('common.required') : ''})
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
                  {editingType ? t('workflows.editWorkflow') : t('workflows.newWorkflow')}
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
                  label={t('common.name')}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  fullWidth
                />

                <Input
                  label={t('common.description')}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                  fullWidth
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('common.fields')}
                    </h4>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addField}
                      icon={Plus}
                      size="sm"
                    >
                      {t('common.add')}
                    </Button>
                  </div>

                  {formData.fields.map((field, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          {t('common.field')} {index + 1}
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
                          label={t('common.name')}
                          value={field.name}
                          onChange={e => updateField(index, { name: e.target.value })}
                          required
                        />
                        <Input
                          label={t('common.label')}
                          value={field.label}
                          onChange={e => updateField(index, { label: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('common.type')}
                          </label>
                          <select
                            value={field.type}
                            onChange={e => updateField(index, { type: e.target.value as any })}
                            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="text">{t('common.text')}</option>
                            <option value="password">{t('common.password')}</option>
                            <option value="select">{t('common.select')}</option>
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
                              {t('common.required')}
                            </span>
                          </label>
                        </div>
                      </div>

                      {field.type === 'select' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('common.options')} ({t('common.onePerLine')})
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
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    icon={Save}
                  >
                    {editingType ? t('common.update') : t('common.create')}
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