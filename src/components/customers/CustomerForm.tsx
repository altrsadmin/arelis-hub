import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useLanguage } from '../../contexts/LanguageContext';
import { useMutationCache } from '../../lib/hooks/useQueryCache';
import type { Customer, PersonType } from '../../types/customer';
import { IMask } from 'react-imask';

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
  onSuccess: () => void;
}

export function CustomerForm({ isOpen, onClose, customer, onSuccess }: CustomerFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Partial<Customer>>({
    personType: 'individual',
    status: 'active',
  });

  const { mutate, isPending: loading } = useMutationCache<Customer>('customers', {
    id: customer?.id,
    onSuccess: () => {
      onSuccess();
      onClose();
    }
  });

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    } else {
      setFormData({
        personType: 'individual',
        status: 'active',
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate if registration is complete but don't require any fields
    const requiredFields = ['name', 'email', 'phone', 'document'];
    const addressFields = ['street', 'district', 'city', 'state', 'zipCode'];
    
    const hasRequiredFields = requiredFields.every(field => formData[field as keyof Customer]);
    const hasAddress = formData.address && addressFields.every(field => formData.address?.[field as keyof typeof formData.address]);
    
    const additionalFields = formData.personType === 'company' 
      ? ['legalName', 'tradeName']
      : ['socialName'];
    
    const hasAdditionalFields = additionalFields.every(field => formData[field as keyof Customer]);
    
    const hasCompleteRegistration = hasRequiredFields && hasAddress && hasAdditionalFields;

    const customerData = {
      ...formData,
      hasCompleteRegistration
    };

    await mutate(customerData);
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const masked = formData.personType === 'individual'
      ? IMask.createMask({ mask: '000.000.000-00' })
      : IMask.createMask({ mask: '00.000.000/0000-00' });
    
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? t('customers.editCustomer') : t('customers.newCustomer')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <Select
            label={t('customers.personType')}
            value={formData.personType}
            onChange={e => setFormData({ ...formData, personType: e.target.value as PersonType })}
            options={[
              { value: 'individual', label: t('customers.individual') },
              { value: 'company', label: t('customers.company') }
            ]}
            required
            fullWidth
          />

          {formData.personType === 'company' ? (
            <>
              <Input
                label={t('customers.legalName')}
                value={formData.legalName || ''}
                onChange={e => setFormData({ ...formData, legalName: e.target.value })}
                required
                fullWidth
              />
              <Input
                label={t('customers.tradeName')}
                value={formData.tradeName || ''}
                onChange={e => setFormData({ ...formData, tradeName: e.target.value })}
                required
                fullWidth
              />
              <Input
                label={t('customers.name')}
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                helperText={t('customers.legalRepresentative')}
                required
                fullWidth
              />
            </>
          ) : (
            <>
              <Input
                label={t('customers.name')}
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
              <Input
                label={t('customers.socialName')}
                value={formData.socialName || ''}
                onChange={e => setFormData({ ...formData, socialName: e.target.value })}
                fullWidth
              />
            </>
          )}

          <Input
            label={formData.personType === 'individual' ? t('customers.cpf') : t('customers.cnpj')}
            value={formData.document || ''}
            onChange={handleDocumentChange}
            required
            fullWidth
          />

          <Input
            type="email"
            label={t('common.email')}
            value={formData.email || ''}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
            fullWidth
          />

          <Input
            label={t('common.phone')}
            value={formData.phone || ''}
            onChange={handlePhoneChange}
            required
            fullWidth
          />

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              {t('customers.address')}
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input
                  label={t('customers.street')}
                  value={formData.address?.street || ''}
                  onChange={e => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                  fullWidth
                />
              </div>
              
              <Input
                label={t('customers.complement')}
                value={formData.address?.complement || ''}
                onChange={e => setFormData({
                  ...formData,
                  address: { ...formData.address, complement: e.target.value }
                })}
                fullWidth
              />
              
              <Input
                label={t('customers.district')}
                value={formData.address?.district || ''}
                onChange={e => setFormData({
                  ...formData,
                  address: { ...formData.address, district: e.target.value }
                })}
                fullWidth
              />
              
              <Input
                label={t('customers.city')}
                value={formData.address?.city || ''}
                onChange={e => setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value }
                })}
                fullWidth
              />
              
              <Input
                label={t('customers.state')}
                value={formData.address?.state || ''}
                onChange={e => setFormData({
                  ...formData,
                  address: { ...formData.address, state: e.target.value }
                })}
                maxLength={2}
                fullWidth
              />
              
              <Input
                label={t('customers.zipCode')}
                value={formData.address?.zipCode || ''}
                onChange={handleZipCodeChange}
                fullWidth
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {customer ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}