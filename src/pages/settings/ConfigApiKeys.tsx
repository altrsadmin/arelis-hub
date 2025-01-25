import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';

interface ApiKey {
  id: string;
  key: string;
  created_at: string;
  last_used_at: string | null;
}

export default function ConfigApiKeys() {
  const [apiKey, setApiKey] = useState<ApiKey | null>(null);
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [newKey, setNewKey] = useState('');
  const { showToast } = useToast();
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadApiKey();
  }, []);

  const handleDeleteKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      showToast('API key deleted successfully', 'success');
      loadApiKey();
    } catch (err) {
      console.error('Error deleting API key:', err);
      showToast('Failed to delete API key', 'error');
    }
  };
  const loadApiKey = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('provider', 'openai')
        .maybeSingle();

      if (error) throw error;
      setApiKey(data);
    } catch (err) {
      console.error('Error loading API key:', err);
      showToast('Failed to load API key', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const keyData = {
        key: newKey,
        provider: 'openai',
        user_id: user.id
      };

      if (apiKey) {
        const { error } = await supabase
          .from('api_keys')
          .update(keyData)
          .eq('id', apiKey.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('api_keys')
          .insert([keyData]);

        if (error) throw error;
      }

      await loadApiKey();
      setNewKey('');
      showToast('API key saved successfully', 'success');
    } catch (err) {
      console.error('Error saving API key:', err);
      showToast('Failed to save API key', 'error');
    }
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
      <Breadcrumbs
        items={[
          { label: 'Settings', href: '/settings' },
          { label: 'API Keys' }
        ]}
      />

      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          OpenAI API Key
        </h3>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {apiKey ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current API Key:
              </span>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {showKey ? apiKey.key : '••••••••••••••••'}
                </code>
                <Button
                  variant="ghost"
                  onClick={() => handleDeleteKey(apiKey.id)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  {t('common.delete')}
                </Button>
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Created: {new Date(apiKey.created_at).toLocaleDateString()}
              {apiKey.last_used_at && (
                <div>
                  Last used: {new Date(apiKey.last_used_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No API key configured yet
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              label="New API Key"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              placeholder="sk-..."
              required
              fullWidth
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-8 text-gray-400 hover:text-gray-600"
            >
              {showKey ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              {apiKey ? 'Update Key' : 'Save Key'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}