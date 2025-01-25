import React, { useState, useCallback, useMemo } from 'react';
import { Bot, Search, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';
import { PageLayout } from '../components/layout/PageLayout';
import { useCustomers } from '../lib/hooks/useCustomers';

// Componente principal da página de clientes
const Customers: React.FC = () => {
  // Hooks e estados
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setFormOpen] = useState(false);
  
  // Hook customizado para buscar dados dos clientes
  const { data: customers = [], isLoading: loading } = useCustomers();

  // Callbacks para manipulação de eventos
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleFormOpen = useCallback(() => {
    setFormOpen(true);
  }, []);

  // Filtrar clientes baseado no termo de busca
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  // Renderiza o estado de carregamento
  if (loading) {
    return (
      <PageLayout
        icon={Bot}
        title={t('customers.title')}
        description={t('customers.description')}
      >
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  // Renderiza o estado vazio (sem clientes)
  if (!customers?.length) {
    return (
      <PageLayout
        icon={Bot}
        title={t('customers.title')}
        description={t('customers.description')}
        primaryAction={{
          icon: Plus,
          label: t('customers.create'),
          onClick: handleFormOpen
        }}
        showSearch={true}
        searchValue={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
        searchPlaceholder={t('common.search')}
      >
        {/* Card de Adicionar */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <button
            onClick={handleFormOpen}
            className="group h-full min-h-[280px] bg-white/50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#0099ff] dark:hover:border-[#2afbc6] backdrop-blur-sm transition-all duration-200 p-6 flex flex-col items-center justify-center gap-4"
          >
            <div className="p-3 bg-gray-100/80 dark:bg-gray-700/80 rounded-lg group-hover:bg-[#0099ff]/10 dark:group-hover:bg-[#2afbc6]/10 transition-colors duration-200">
              <Plus className="h-6 w-6 text-gray-400 dark:text-gray-500 group-hover:text-[#0099ff] dark:group-hover:text-[#2afbc6]" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#0099ff] dark:group-hover:text-[#2afbc6]">
                {t('customers.addFirst')}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('customers.addFirstDescription')}
              </p>
            </div>
          </button>
        </div>
      </PageLayout>
    );
  }

  // Renderiza a lista de clientes
  return (
    <PageLayout
      icon={Bot}
      title={t('customers.title')}
      description={t('customers.description')}
      showSearch={true}
      searchValue={searchTerm}
      onSearchChange={(value) => setSearchTerm(value)}
      searchPlaceholder={t('common.search')}
    >
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('customers.activeCustomers')}
          </h3>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
                    <Bot className="h-5 w-5 text-[#0099ff] dark:text-[#2afbc6]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {customer.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Card para Adicionar Novo Cliente */}
          <button
            onClick={handleFormOpen}
            className="group h-full min-h-[280px] bg-white/50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#0099ff] dark:hover:border-[#2afbc6] backdrop-blur-sm transition-all duration-200 p-6 flex flex-col items-center justify-center gap-4"
          >
            <div className="p-3 bg-gray-100/80 dark:bg-gray-700/80 rounded-lg group-hover:bg-[#0099ff]/10 dark:group-hover:bg-[#2afbc6]/10 transition-colors duration-200">
              <Plus className="h-6 w-6 text-gray-400 dark:text-gray-500 group-hover:text-[#0099ff] dark:group-hover:text-[#2afbc6]" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#0099ff] dark:group-hover:text-[#2afbc6]">
                {t('customers.add')}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('customers.addDescription')}
              </p>
            </div>
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Customers;