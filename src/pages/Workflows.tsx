import React, { useState, useCallback, useMemo } from 'react';
import { Bot, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';
import { PageLayout } from '../components/layout/PageLayout';
import { useWorkflows } from '../lib/hooks/useWorkflows';

// Componente principal da página de workflows
const Workflows: React.FC = () => {
  // Hooks e estados
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid
  
  // Hook customizado para buscar dados dos workflows
  const { 
    data: workflows = [], 
    totalCount,
    isLoading: loading,
    isFetching,
    isPreviousData 
  } = useWorkflows({
    page: currentPage,
    limit: itemsPerPage,
    filter: searchTerm
  });

  // Callbacks para manipulação de eventos
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Volta para a primeira página ao pesquisar
  }, []);

  const handleFormOpen = useCallback(() => {
    setFormOpen(true);
  }, []);

  const handleNextPage = useCallback(() => {
    if (!isPreviousData && currentPage * itemsPerPage < totalCount) {
      setCurrentPage(old => old + 1);
    }
  }, [currentPage, totalCount, isPreviousData]);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(old => Math.max(old - 1, 1));
  }, []);

  // Cálculos para paginação
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const showPagination = totalPages > 1;

  // Renderiza o estado de carregamento
  if (loading && !isFetching) {
    return (
      <PageLayout
        icon={Bot}
        title={t('workflows.title')}
        description={t('workflows.description')}
      >
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  // Renderiza o estado vazio (sem workflows)
  if (!workflows?.length && !isFetching) {
    return (
      <PageLayout
        icon={Bot}
        title={t('workflows.title')}
        description={t('workflows.description')}
        primaryAction={{
          icon: Plus,
          label: t('workflows.create'),
          onClick: handleFormOpen
        }}
        showSearch={true}
        searchValue={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
        searchPlaceholder={t('common.search')}
      >
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
                {t('workflows.add')}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('workflows.addDescription')}
              </p>
            </div>
          </button>
        </div>
      </PageLayout>
    );
  }

  // Renderiza a lista de workflows
  return (
    <PageLayout
      icon={Bot}
      title={t('workflows.title')}
      description={t('workflows.description')}
      primaryAction={{
        icon: Plus,
        label: t('workflows.create'),
        onClick: handleFormOpen
      }}
      showSearch={true}
      searchValue={searchTerm}
      onSearchChange={(value) => setSearchTerm(value)}
      searchPlaceholder={t('common.search')}
    >
      <div className="space-y-8">
        {/* Lista de Workflows */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 rounded-lg">
                    <Bot className="h-5 w-5 text-[#0099ff] dark:text-[#2afbc6]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {workflow.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {workflow.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Card para Adicionar Novo Workflow */}
          <button
            onClick={handleFormOpen}
            className="group h-full min-h-[280px] bg-white/50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#0099ff] dark:hover:border-[#2afbc6] backdrop-blur-sm transition-all duration-200 p-6 flex flex-col items-center justify-center gap-4"
          >
            <div className="p-3 bg-gray-100/80 dark:bg-gray-700/80 rounded-lg group-hover:bg-[#0099ff]/10 dark:group-hover:bg-[#2afbc6]/10 transition-colors duration-200">
              <Plus className="h-6 w-6 text-gray-400 dark:text-gray-500 group-hover:text-[#0099ff] dark:group-hover:text-[#2afbc6]" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#0099ff] dark:group-hover:text-[#2afbc6]">
                {t('workflows.add')}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('workflows.addDescription')}
              </p>
            </div>
          </button>
        </div>

        {/* Paginação */}
        {showPagination && (
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {t('common.showing')} <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>{' '}
                {t('common.to')}{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, totalCount)}
                </span>{' '}
                {t('common.of')}{' '}
                <span className="font-medium">{totalCount}</span>{' '}
                {t('common.results')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                icon={ChevronLeft}
              >
                {t('common.previous')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage * itemsPerPage >= totalCount || isPreviousData}
                icon={ChevronRight}
              >
                {t('common.next')}
              </Button>
            </div>
          </div>
        )}

        {/* Indicador de carregamento */}
        {isFetching && (
          <div className="flex justify-center pt-4">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Workflows;