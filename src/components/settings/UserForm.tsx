import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useLanguage } from '../../contexts/LanguageContext';
import { useMutationCache } from '../../lib/hooks/useQueryCache';
import { useToast } from '../ui/Toast';
import { supabase } from '../../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'pending' | 'inactive';
}

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSuccess: () => void;
}

export function UserForm({ isOpen, onClose, user, onSuccess }: UserFormProps) {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as const,
    status: 'active' as const
  });

  const { mutate: saveUser, isPending: loading } = useMutationCache('users', {
    id: user?.id,
    onSuccess: () => {
      showToast(
        user 
          ? t('settings.users.updated') 
          : t('settings.users.created'),
        'success'
      );
      onSuccess();
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active'
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!user) {
        // Create new user in auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: formData.password,
          user_metadata: {
            name: formData.name,
            role: formData.role
          }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('No user returned from auth');

        // Ensure we're using the UUID from auth.users
        const userId = authData.user.id;

        // Create user record with the same UUID
        await saveUser({
          id: userId, // Use the UUID from auth
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status
        });
      } else {
        // Update existing user
        const updateData: Partial<User> = {
          name: formData.name,
          role: formData.role,
          status: formData.status
        };

        // Update password if provided
        if (formData.password) {
          const { error: authError } = await supabase.auth.admin.updateUserById(user.id, {
            password: formData.password
          });

          if (authError) throw authError;
        }

        await saveUser(updateData);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      showToast(t('settings.users.error'), 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? t('settings.users.edit') : t('settings.users.new')}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label={t('common.name')}
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
          fullWidth
        />

        <Input
          type="email"
          label={t('common.email')}
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={!!user}
          fullWidth
        />

        <Input
          type="password"
          label={t('common.password')}
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          required={!user}
          helperText={user ? t('settings.users.passwordHelp') : undefined}
          fullWidth
        />

        <Select
          label={t('settings.users.role')}
          value={formData.role}
          onChange={e => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
          options={[
            { value: 'user', label: t('settings.users.roles.user') },
            { value: 'admin', label: t('settings.users.roles.admin') }
          ]}
          required
          fullWidth
        />

        <Select
          label={t('common.status')}
          value={formData.status}
          onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'pending' | 'inactive' })}
          options={[
            { value: 'active', label: t('settings.users.status.active') },
            { value: 'pending', label: t('settings.users.status.pending') },
            { value: 'inactive', label: t('settings.users.status.inactive') }
          ]}
          required
          fullWidth
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {user ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}