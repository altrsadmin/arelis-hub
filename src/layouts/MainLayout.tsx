import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Bot, Settings as SettingsIcon, Users, Plug, Menu, X, GitBranch, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useClearQueryCache } from '../lib/hooks/useQueryCache';
import { logger } from '../lib/utils/logger';

type Tab = 'customers' | 'workflows' | 'connectors' | 'agents' | 'settings';

// Componente principal de layout
const MainLayout: React.FC = () => {
  // Estados
  const [activeTab, setActiveTab] = useState<Tab>('customers');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { t } = useLanguage();
  const clearCache = useClearQueryCache();

  // Atualiza a aba ativa com base na rota atual
  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'customers';
    if (path && ['customers', 'workflows', 'connectors', 'agents', 'settings'].includes(path)) {
      setActiveTab(path as Tab);
    }
  }, [location]);

  // Handler para logout
  const handleSignOut = async () => {
    try {
      await clearCache();
      await signOut();
      navigate('/login');
    } catch (error) {
      logger.error('Erro ao fazer logout', error as Error);
    }
  };

  // Handler para navegação
  const handleNavigation = (tab: Tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
    setUserMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo e Toggle do Menu */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-[#0099ff] dark:text-[#2afbc6]" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ARELIS HUB
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Links de Navegação */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {[
              { id: 'agents', icon: Bot, label: t('navigation.agents') },
              { id: 'workflows', icon: GitBranch, label: t('navigation.workflows') },
              { id: 'customers', icon: Users, label: t('navigation.customers') },
              { id: 'connectors', icon: Plug, label: t('navigation.connectors') },
              { id: 'settings', icon: SettingsIcon, label: t('navigation.settings') },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => handleNavigation(id as Tab)}
                className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  activeTab === id
                    ? 'bg-[#0099ff]/10 text-[#0099ff] dark:bg-[#2afbc6]/10 dark:text-[#2afbc6]'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Menu do Usuário */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-[#0099ff]/10 dark:bg-[#2afbc6]/10 flex items-center justify-center">
                    <span className="text-[#0099ff] dark:text-[#2afbc6]">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.email}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t('common.online')}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>{t('auth.signOut')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-auto">
        {/* Botão do Menu Mobile */}
        <button
          onClick={() => setSidebarOpen(true)}
          className={`fixed top-4 left-4 z-40 rounded-lg bg-white dark:bg-gray-800 p-2 shadow-lg lg:hidden ${
            isSidebarOpen ? 'hidden' : 'block'
          }`}
        >
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Área de Conteúdo */}
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
