import React from 'react';
import { Settings as CogIcon, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useLanguage } from '../contexts/LanguageContext';
import { useConnection } from '../contexts/ConnectionContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CogIcon as SettingsIcon,
  Key,
  Bot,
  Plug,
  Globe,
  Building2,
  User,
  ChevronDown,
  Users2,
  Palette,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { IMask } from 'react-imask';
import type { CustomerAddress } from '../types/customer';
import type { PersonType } from '../types/customer';
import { Select } from '../components/ui/Select';

interface AccountFormData {
  personType: PersonType;
  legalName: string;
  tradeName: string;
  socialName: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  bio: string;
  address?: CustomerAddress;
  showBillingDetails: boolean;
}

interface SettingsSection {
  id: string;
  icon: typeof Key;
  title: string;
  description: string;
  path?: string;
  beta?: boolean;
}

export default function Settings() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const { isConnected, isChecking } = useConnection();

  const [formData, setFormData] = useState<AccountFormData>({
    personType: 'company',
    legalName: '',
    tradeName: '',
    socialName: '',
    name: '',
    document: '',
    email: '',
    phone: '',
    bio: '',
    showBillingDetails: false
  });
  const [regionalFormData, setRegionalFormData] = useState({
    dateFormat: 'dmy',
    timeFormat: '24h'
  });

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const masked = IMask.createMask({
      mask: formData.personType === 'company' ? '00.000.000/0000-00' : '000.000.000-00'
    });
    setFormData(prev => ({
      ...prev,
      document: masked.resolve(value)
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const masked = IMask.createMask({ mask: '(00) 00000-0000' });
    setFormData(prev => ({
      ...prev,
      phone: masked.resolve(value)
    }));
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const masked = IMask.createMask({ mask: '00000-000' });
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        zipCode: masked.resolve(value)
      }
    }));
  };

  const handleSave = async () => {
    try {
      // Add your save logic here
      showToast('Account information updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update account information', 'error');
    }
  };

  const sections: SettingsSection[] = [
    {
      id: 'regional',
      icon: Globe,
      title: t('settings.regional.title'),
      description: t('settings.regional.description')
    },
    {
      id: 'branding',
      icon: Palette,
      title: t('settings.branding.title'),
      description: t('settings.branding.description'),
      beta: true
    },
    {
      id: 'users',
      icon: Users2,
      title: t('settings.users.title'),
      description: t('settings.users.description'),
      beta: true
    },
    {
      id: 'api-keys',
      icon: Key,
      title: t('settings.apiKeys.title'),
      description: t('settings.apiKeys.description')
    },
    {
      id: 'agent-types',
      icon: Bot,
      title: t('settings.workflowTypes.title'),
      description: t('settings.workflowTypes.description'),
      path: 'workflow-types'
    },
    {
      id: 'connector-types',
      icon: Plug,
      title: t('settings.connectorTypes.title'),
      description: t('settings.connectorTypes.description')
    }
  ];

  // Renderiza estado de carregamento ou erro de conexão
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <EmptyState
        icon={CogIcon}
        title={t('common.connectionError')}
        description={t('common.checkConnection')}
        action={
          <Button onClick={() => window.location.reload()}>
            {t('common.tryAgain')}
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <CogIcon className="h-6 w-6 text-[#0099ff] dark:text-[#2afbc6]" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('settings.title')}
          </h2>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:w-64">
            <Input
              icon={Search}
              placeholder={t('common.search')}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <div
            key={section.id}
            className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md hover:border-[#0099ff] dark:hover:border-[#2afbc6] border border-transparent p-6 space-y-4 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-[#0099ff] dark:group-hover:text-[#2afbc6]">
                  {section.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {section.description}
                </p>
              </div>
              <section.icon className="h-5 w-5 text-gray-400 group-hover:text-[#0099ff] dark:group-hover:text-[#2afbc6]" />
            </div>
          </div>
        ))}
      </div>

      {/* Account Profile */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
            <User className="h-6 w-6 text-[#0099ff] dark:text-[#2afbc6]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('settings.account')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('settings.accountDescription')}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="grid grid-cols-1 gap-4">
              <Select
                label={t('customers.personType')}
                value={formData.personType}
                onChange={e => setFormData({ ...formData, personType: e.target.value as PersonType })}
                options={[
                  { value: 'individual', label: t('customers.individual') },
                  { value: 'company', label: t('customers.company') }
                ]}
                fullWidth
              />

              {formData.personType === 'company' ? (
                <>
                  <Input
                    label={t('customers.tradeName')}
                    value={formData.tradeName}
                    onChange={e => setFormData({ ...formData, tradeName: e.target.value })}
                    fullWidth
                  />
                </>
              ) : (
                <>
                  <Input
                    label={t('customers.socialName')}
                    value={formData.socialName}
                    onChange={e => setFormData({ ...formData, socialName: e.target.value })}
                    fullWidth
                  />
                </>
              )}

              <Input
                type="email"
                label={t('common.email')}
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                fullWidth
              />
              <Input
                label={t('common.phone')}
                value={formData.phone}
                onChange={handlePhoneChange}
                fullWidth
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={handleSave}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      </div>

      {/* Regional Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
              <Globe className="h-6 w-6 text-[#0099ff] dark:text-[#2afbc6]" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('settings.regional')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('settings.regionalDescription')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {t('settings.language.title')}
            </h4>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'pt' | 'es')}
              options={[
                { value: 'en', label: t('settings.language.en') },
                { value: 'pt', label: t('settings.language.pt') },
                { value: 'es', label: t('settings.language.es') }
              ]}
              fullWidth
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {t('settings.theme.title')}
            </h4>
            <Select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
              options={[
                { value: 'light', label: t('settings.theme.light') },
                { value: 'dark', label: t('settings.theme.dark') }
              ]}
              fullWidth
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {t('settings.dateFormat.title')}
            </h4>
            <Select
              value={regionalFormData.dateFormat}
              onChange={(e) => setRegionalFormData({ ...regionalFormData, dateFormat: e.target.value })}
              options={[
                { value: 'dmy', label: t('settings.dateFormat.dmy') },
                { value: 'mdy', label: t('settings.dateFormat.mdy') },
                { value: 'ymd', label: t('settings.dateFormat.ymd') }
              ]}
              fullWidth
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {t('settings.timeFormat.title')}
            </h4>
            <Select
              value={regionalFormData.timeFormat}
              onChange={(e) => setRegionalFormData({ ...regionalFormData, timeFormat: e.target.value })}
              options={[
                { value: '24h', label: t('settings.timeFormat.format24') },
                { value: '12h', label: t('settings.timeFormat.format12') }
              ]}
              fullWidth
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={() => {
            // Save regional settings
            showToast(t('settings.saved'), 'success');
          }}>
            {t('common.save')}
          </Button>
        </div>
      </div>

      {/* Complete Registration Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
                <Building2 className="h-6 w-6 text-[#0099ff] dark:text-[#2afbc6]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('customers.completeRegistration')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('settings.billingDetailsHelp')}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => setFormData(prev => ({ ...prev, showBillingDetails: !prev.showBillingDetails }))}
              icon={formData.showBillingDetails ? ChevronDown : ChevronRight}
            />
          </div>
        </div>

        {formData.showBillingDetails && <div className="space-y-6">
          {/* Additional Information */}
          <div className="grid grid-cols-1 gap-4">
            {formData.personType === 'company' ? (
              <>
                <Input
                  label={t('customers.legalName')}
                  value={formData.legalName}
                  onChange={e => setFormData({ ...formData, legalName: e.target.value })}
                  fullWidth
                />
                <Input
                  label={t('customers.cnpj')}
                  value={formData.document}
                  onChange={handleDocumentChange}
                  fullWidth
                />
              </>
            ) : (
              <>
                <Input
                  label={t('customers.name')}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  fullWidth
                />
                <Input
                  label={t('customers.cpf')}
                  value={formData.document}
                  onChange={handleDocumentChange}
                  fullWidth
                />
              </>
            )}
          </div>

          {/* Billing Address */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              {t('settings.billingAddress')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label={t('customers.street')}
                  value={formData.address?.street}
                  onChange={e => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                  fullWidth
                />
              </div>
              <Input
                label={t('customers.complement')}
                value={formData.address?.complement}
                onChange={e => setFormData({
                  ...formData,
                  address: { ...formData.address, complement: e.target.value }
                })}
                fullWidth
              />
              <Input
                label={t('customers.district')}
                value={formData.address?.district}
                onChange={e => setFormData({
                  ...formData,
                  address: { ...formData.address, district: e.target.value }
                })}
                fullWidth
              />
              <Input
                label={t('customers.city')}
                value={formData.address?.city}
                onChange={e => setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value }
                })}
                fullWidth
              />
              <Input
                label={t('customers.state')}
                value={formData.address?.state}
                onChange={e => setFormData({
                  ...formData,
                  address: { ...formData.address, state: e.target.value }
                })}
                maxLength={2}
                fullWidth
              />
              <Input
                label={t('customers.zipCode')}
                value={formData.address?.zipCode}
                onChange={handleZipCodeChange}
                fullWidth
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={handleSave}>
              {t('common.save')}
            </Button>
          </div>
        </div>}
      </div>

      {/* API Keys Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
            <Key className="h-6 w-6 text-[#0099ff] dark:text-[#2afbc6]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('settings.apiKeys')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('settings.apiKeysDescription')}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* New Key Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('settings.keyName')}
              placeholder={t('settings.keyNamePlaceholder')}
              fullWidth
            />
            <div className="flex items-end">
              <Button onClick={() => {
                // Generate new key logic here
                showToast(t('settings.keyGenerated'), 'success');
              }}>
                {t('settings.generateNewKey')}
              </Button>
            </div>
          </div>

          {/* Keys List */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  My API Key
                </h4>
                <code className="text-sm font-mono mt-1 text-gray-600 dark:text-gray-400">
                  •••••••••sk_1234
                </code>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText('sk_1234');
                  showToast(t('settings.keyCopied'), 'success');
                }}
              >
                {t('common.copy')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sections.map(section => (
          <Link
            to={`/settings/${section.id}`}
            key={section.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
                  <section.icon className="h-6 w-6 text-[#0099ff] dark:text-[#2afbc6]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-[#0099ff] dark:group-hover:text-[#2afbc6] transition-colors">
                    {String(section.title)}
                    {(section.id === 'users' || section.id === 'branding') && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {String(t('settings.beta.title'))}
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {String(section.description)}
                  </p>
                  {section.id === 'branding' && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                      {String(t('settings.tips.branding'))}
                    </p>
                  )}
                  {section.id === 'users' && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                      {String(t('settings.tips.users'))}
                    </p>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#0099ff] dark:group-hover:text-[#2afbc6] transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}