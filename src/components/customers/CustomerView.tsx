import React from 'react';
import { Mail, Phone, MapPin, Building2, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import { useMutationCache } from '../../lib/hooks/useQueryCache';
import type { Customer } from '../../types/customer';

interface CustomerViewProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  onEdit: () => void;
}

export function CustomerView({ isOpen, onClose, customer, onEdit }: CustomerViewProps) {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = React.useState(false);
  
  if (!customer) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer.name}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.close')}
          </Button>
          <Button onClick={onEdit}>
            {t('common.edit')}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            {customer.personType === 'company' ? (
              <Building2 className="h-5 w-5" />
            ) : (
              <User className="h-5 w-5" />
            )}
            <span>
              {customer.personType === 'company' 
                ? t('customers.company')
                : t('customers.individual')}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Mail className="h-5 w-5" />
            <span>{customer.email}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Phone className="h-5 w-5" />
            <span>{customer.phone}</span>
          </div>

          {customer.document && (
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">
                {customer.personType === 'company' ? t('customers.cnpj') : t('customers.cpf')}:
              </span>{' '}
              {customer.document}
            </div>
          )}
        </div>

        {/* Additional Details Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {showDetails ? t('common.hideDetails') : t('common.showDetails')}
        </button>

        {/* Additional Details */}
        {showDetails && (
          <div className="space-y-6 pt-4">
            {/* Company Specific Info */}
            {customer.personType === 'company' && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('customers.companyInfo')}
                </h4>
                {customer.legalName && (
                  <div className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{t('customers.legalName')}:</span>{' '}
                    {customer.legalName}
                  </div>
                )}
                {customer.tradeName && (
                  <div className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{t('customers.tradeName')}:</span>{' '}
                    {customer.tradeName}
                  </div>
                )}
              </div>
            )}

            {/* Individual Specific Info */}
            {customer.personType === 'individual' && customer.socialName && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('customers.personalInfo')}
                </h4>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{t('customers.socialName')}:</span>{' '}
                  {customer.socialName}
                </div>
              </div>
            )}

            {/* Address */}
            {customer.address && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('customers.address')}
                </h4>
                <div className="pl-6 space-y-1 text-gray-600 dark:text-gray-400">
                  <div>{customer.address.street}</div>
                  {customer.address.complement && (
                    <div>{customer.address.complement}</div>
                  )}
                  <div>{customer.address.district}</div>
                  <div>
                    {customer.address.city}, {customer.address.state}
                  </div>
                  <div>{customer.address.zipCode}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}