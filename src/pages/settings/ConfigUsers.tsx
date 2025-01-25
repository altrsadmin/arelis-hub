import React, { useState } from 'react';
import { Users2, Plus, Mail, Shield, Trash2, Edit2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useQueryCache, useMutationCache, useDeleteCache } from '../../lib/hooks/useQueryCache';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { UserForm } from '../../components/settings/UserForm';
import { UserView } from '../../components/settings/UserView';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
}

export default function ConfigUsers() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data: users, isLoading: loading, refetch } = useQueryCache<User>('users');

  const { mutate: deleteRecord, isPending: deleting } = useDeleteCache('users', {
    onSuccess: () => {
      showToast(t('settings.users.deleted'), 'success');
      setUserToDelete(null);
      refetch();
    }
  });

  const handleDelete = async (user: User) => {
    setUserToDelete(user);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      default: return 'danger';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: t('navigation.settings'), href: '/settings' },
          { label: t('settings.users.title') }
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
            <Users2 className="h-6 w-6 text-[#0099ff] dark:text-[#2afbc6]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('settings.users.title')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('settings.users.description')}
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedUser(null);
            setShowForm(true);
          }}
          icon={Plus}
        >
          {t('settings.users.new')}
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('common.name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('settings.users.role')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('common.status')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  {t('settings.users.noUsers')}
                </td>
              </tr>
            ) : users?.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {t(`settings.users.roles.${user.role}`)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusColor(user.status)}>
                    {t(`settings.users.status.${user.status}`)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      icon={Edit2}
                      onClick={() => handleEdit(user)}
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      variant="ghost"
                      icon={Trash2}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => handleDelete(user)}
                    >
                      {t('common.delete')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={() => {
          refetch();
          setShowForm(false);
          setSelectedUser(null);
        }}
      />

      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (userToDelete) {
            deleteRecord(userToDelete.id);
          }
        }}
        title={t('settings.users.deleteTitle')}
        message={t('settings.users.deleteConfirm')}
        loading={deleting}
      />
    </div>
  );
}