import React, { useState } from 'react';
import { Palette, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useLanguage } from '../../contexts/LanguageContext';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

export default function ConfigBranding() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    primaryColor: '#2afbc6',
    secondaryColor: '#0099ff',
    logo: '',
    favicon: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your save logic here
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: t('navigation.settings'), href: '/settings' },
          { label: t('settings.branding') }
        ]}
      />

      <div className="flex items-center gap-2">
        <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
          <Palette className="h-6 w-6 text-[#0099ff] dark:text-[#2afbc6]" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('settings.branding')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('settings.brandingDescription')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={t('settings.workspaceName')}
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.colors')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('settings.primaryColor')}
                  </label>
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('settings.secondaryColor')}
                  </label>
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('settings.logo')}
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-20 w-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    {formData.logo ? (
                      <img
                        src={formData.logo}
                        alt="Logo"
                        className="h-16 w-16 object-contain"
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Handle file upload
                        }
                      }}
                      fullWidth
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {t('settings.logoHelp')}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('settings.favicon')}
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    {formData.favicon ? (
                      <img
                        src={formData.favicon}
                        alt="Favicon"
                        className="h-8 w-8 object-contain"
                      />
                    ) : (
                      <Upload className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/x-icon,image/png"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Handle file upload
                        }
                      }}
                      fullWidth
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {t('settings.faviconHelp')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            {t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
}