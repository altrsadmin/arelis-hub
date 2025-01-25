export interface Translations {
  [key: string]: {
    [key: string]: any;
  };
}

export const translations: Translations = {
  pt: {
    navigation: {
      customers: 'Clientes',
      workflows: 'Fluxos',
      connectors: 'Conectores',
      agents: 'Agentes',
      settings: 'Configurações'
    },

    common: {
      search: 'Buscar...',
      save: 'Salvar',
      copy: 'Copiar',
      phone: 'Telefone',
      email: 'Email',
      name: 'Nome',
      description: 'Descrição',
      status: 'Status',
      active: 'Ativo',
      inactive: 'Inativo',
      created: 'Criado em',
      updated: 'Atualizado em',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      activate: 'Ativar',
      deactivate: 'Desativar',
      loading: 'Carregando...',
      noResults: 'Nenhum resultado encontrado',
      confirmDelete: 'Tem certeza que deseja excluir?',
      yes: 'Sim',
      no: 'Não',
      connectionError: 'Erro de conexão',
      checkConnection: 'Verifique sua conexão e tente novamente',
      tryAgain: 'Tentar novamente'
    },

    customers: {
      title: 'Clientes',
      add: 'Adicionar Cliente',
      addFirst: 'Adicionar Primeiro Cliente',
      addFirstDescription: 'Comece adicionando seu primeiro cliente',
      personType: 'Tipo de Pessoa',
      individual: 'Pessoa Física',
      company: 'Pessoa Jurídica',
      tradeName: 'Nome Fantasia',
      completeRegistration: 'Complete seu Cadastro',
      deleteTitle: 'Excluir Cliente',
      deleteConfirm: 'Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.',
      editCustomer: 'Editar Cliente',
      legalName: 'Razão Social',
      name: 'Nome',
      description: 'Gerencie seus clientes e mantenha suas informações atualizadas',
      addDescription: 'Adicione um novo cliente à sua base'
    },

    workflows: {
      title: 'Fluxos',
      add: 'Adicionar Fluxo',
      addFirst: 'Adicionar Primeiro Fluxo',
      addFirstDescription: 'Comece adicionando seu primeiro fluxo de trabalho',
      deleteTitle: 'Excluir Fluxo',
      deleteConfirm: 'Tem certeza que deseja excluir este fluxo? Esta ação não pode ser desfeita.',
      editFlow: 'Editar Fluxo',
      description: 'Gerencie seus fluxos de trabalho',
      addDescription: 'Adicione um novo fluxo de trabalho'
    },

    agents: {
      title: 'Agentes',
      add: 'Adicionar Agente',
      addFirst: 'Adicionar Primeiro Agente',
      addFirstDescription: 'Comece adicionando seu primeiro agente',
      deleteTitle: 'Excluir Agente',
      deleteConfirm: 'Tem certeza que deseja excluir este agente? Esta ação não pode ser desfeita.',
      editAgent: 'Editar Agente',
      description: 'Gerencie seus agentes',
      addDescription: 'Adicione um novo agente',
      activate: 'Ativar Agente',
      deactivate: 'Desativar Agente',
      stats: {
        total: 'Total de Agentes',
        active: 'Agentes Ativos',
        inactive: 'Agentes Inativos'
      }
    },

    connectors: {
      title: 'Conectores',
      add: 'Adicionar Conector',
      addFirst: 'Adicionar Primeiro Conector',
      addFirstDescription: 'Comece adicionando seu primeiro conector',
      deleteTitle: 'Excluir Conector',
      deleteConfirm: 'Tem certeza que deseja excluir este conector? Esta ação não pode ser desfeita.',
      editConnector: 'Editar Conector',
      description: 'Gerencie seus conectores',
      addDescription: 'Adicione um novo conector'
    },

    settings: {
      title: 'Configurações',
      description: 'Gerencie as configurações do sistema',
      
      account: {
        title: 'Conta',
        description: 'Gerencie suas informações de conta'
      },

      regional: {
        title: 'Regional',
        description: 'Configure suas preferências regionais'
      },

      language: {
        title: 'Idioma',
        en: 'Inglês',
        pt: 'Português',
        es: 'Espanhol'
      },

      theme: {
        title: 'Tema',
        light: 'Claro',
        dark: 'Escuro'
      },

      branding: {
        title: 'Marca',
        description: 'Personalize a aparência do sistema',
        beta: 'Marca Beta'
      },

      users: {
        title: 'Usuários',
        description: 'Gerencie os usuários do sistema',
        beta: 'Usuários Beta'
      },

      apiKeys: {
        title: 'Chaves de API',
        description: 'Gerencie suas chaves de API',
        keyName: 'Nome da Chave',
        keyNamePlaceholder: 'Ex: Chave de Produção',
        generateNewKey: 'Gerar Nova Chave',
        myApiKey: 'Minha Chave API',
        mask: '•••••••••sk_1234'
      },

      workflowTypes: {
        title: 'Tipos de Fluxo',
        description: 'Gerencie os tipos de fluxo disponíveis'
      },

      connectorTypes: {
        title: 'Tipos de Conector',
        description: 'Gerencie os tipos de conector disponíveis'
      }
    },

    auth: {
      signIn: 'Entrar',
      signOut: 'Sair',
      invalidCredentials: 'Email ou senha inválidos'
    },

    errors: {
      generic: 'Ocorreu um erro',
      notFound: 'Página não encontrada',
      unauthorized: 'Não autorizado',
      sessionExpired: 'Sessão expirada',
      networkError: 'Erro de conexão',
      validationError: 'Erro de validação'
    }
  },

  en: {
    navigation: {
      customers: 'Customers',
      workflows: 'Workflows',
      connectors: 'Connectors',
      agents: 'Agents',
      settings: 'Settings'
    },

    common: {
      search: 'Search...',
      save: 'Save',
      copy: 'Copy',
      phone: 'Phone',
      email: 'Email',
      name: 'Name',
      description: 'Description',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      created: 'Created',
      updated: 'Updated',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      activate: 'Activate',
      deactivate: 'Deactivate',
      loading: 'Loading...',
      noResults: 'No results found',
      confirmDelete: 'Are you sure you want to delete?',
      yes: 'Yes',
      no: 'No',
      connectionError: 'Connection error',
      checkConnection: 'Check your connection and try again',
      tryAgain: 'Try again'
    },

    customers: {
      title: 'Customers',
      add: 'Add Customer',
      addFirst: 'Add First Customer',
      addFirstDescription: 'Get started by adding your first customer',
      personType: 'Person Type',
      individual: 'Individual',
      company: 'Company',
      tradeName: 'Trade Name',
      completeRegistration: 'Complete Registration',
      deleteTitle: 'Delete Customer',
      deleteConfirm: 'Are you sure you want to delete this customer? This action cannot be undone.',
      editCustomer: 'Edit Customer',
      legalName: 'Legal Name',
      name: 'Name',
      description: 'Manage your customers and keep their information up to date',
      addDescription: 'Add a new customer to your base'
    },

    workflows: {
      title: 'Workflows',
      add: 'Add Workflow',
      addFirst: 'Add First Workflow',
      addFirstDescription: 'Get started by adding your first workflow',
      deleteTitle: 'Delete Workflow',
      deleteConfirm: 'Are you sure you want to delete this workflow? This action cannot be undone.',
      editFlow: 'Edit Workflow',
      description: 'Manage your workflows',
      addDescription: 'Add a new workflow'
    },

    agents: {
      title: 'Agents',
      add: 'Add Agent',
      addFirst: 'Add First Agent',
      addFirstDescription: 'Get started by adding your first agent',
      deleteTitle: 'Delete Agent',
      deleteConfirm: 'Are you sure you want to delete this agent? This action cannot be undone.',
      editAgent: 'Edit Agent',
      description: 'Manage your agents',
      addDescription: 'Add a new agent',
      activate: 'Activate Agent',
      deactivate: 'Deactivate Agent',
      stats: {
        total: 'Total Agents',
        active: 'Active Agents',
        inactive: 'Inactive Agents'
      }
    },

    connectors: {
      title: 'Connectors',
      add: 'Add Connector',
      addFirst: 'Add First Connector',
      addFirstDescription: 'Get started by adding your first connector',
      deleteTitle: 'Delete Connector',
      deleteConfirm: 'Are you sure you want to delete this connector? This action cannot be undone.',
      editConnector: 'Edit Connector',
      description: 'Manage your connectors',
      addDescription: 'Add a new connector'
    },

    settings: {
      title: 'Settings',
      description: 'Manage system settings',
      
      account: {
        title: 'Account',
        description: 'Manage your account information'
      },

      regional: {
        title: 'Regional',
        description: 'Configure your regional preferences'
      },

      language: {
        title: 'Language',
        en: 'English',
        pt: 'Portuguese',
        es: 'Spanish'
      },

      theme: {
        title: 'Theme',
        light: 'Light',
        dark: 'Dark'
      },

      branding: {
        title: 'Branding',
        description: 'Customize system appearance',
        beta: 'Branding Beta'
      },

      users: {
        title: 'Users',
        description: 'Manage system users',
        beta: 'Users Beta'
      },

      apiKeys: {
        title: 'API Keys',
        description: 'Manage your API keys',
        keyName: 'Key Name',
        keyNamePlaceholder: 'E.g. Production Key',
        generateNewKey: 'Generate New Key',
        myApiKey: 'My API Key',
        mask: '•••••••••sk_1234'
      },

      workflowTypes: {
        title: 'Workflow Types',
        description: 'Manage available workflow types'
      },

      connectorTypes: {
        title: 'Connector Types',
        description: 'Manage available connector types'
      }
    },

    auth: {
      signIn: 'Sign In',
      signOut: 'Sign Out',
      invalidCredentials: 'Invalid email or password'
    },

    errors: {
      generic: 'An error occurred',
      notFound: 'Page not found',
      unauthorized: 'Unauthorized',
      sessionExpired: 'Session expired',
      networkError: 'Network error',
      validationError: 'Validation error'
    }
  },

  es: {
    navigation: {
      customers: 'Clientes',
      workflows: 'Flujos',
      connectors: 'Conectores',
      agents: 'Agentes',
      settings: 'Configuración'
    },

    common: {
      search: 'Buscar...',
      save: 'Guardar',
      copy: 'Copiar',
      phone: 'Teléfono',
      email: 'Email',
      name: 'Nombre',
      description: 'Descripción',
      status: 'Estado',
      active: 'Activo',
      inactive: 'Inactivo',
      created: 'Creado',
      updated: 'Actualizado',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      activate: 'Activar',
      deactivate: 'Desactivar',
      loading: 'Cargando...',
      noResults: 'No se encontraron resultados',
      confirmDelete: '¿Estás seguro de que deseas eliminar?',
      yes: 'Sí',
      no: 'No',
      connectionError: 'Error de conexión',
      checkConnection: 'Verifica tu conexión e inténtalo de nuevo',
      tryAgain: 'Intentar de nuevo'
    },

    customers: {
      title: 'Clientes',
      add: 'Agregar Cliente',
      addFirst: 'Agregar Primer Cliente',
      addFirstDescription: 'Comienza agregando tu primer cliente',
      personType: 'Tipo de Persona',
      individual: 'Persona Física',
      company: 'Persona Jurídica',
      tradeName: 'Nombre Comercial',
      completeRegistration: 'Completa tu Registro',
      deleteTitle: 'Eliminar Cliente',
      deleteConfirm: '¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.',
      editCustomer: 'Editar Cliente',
      legalName: 'Razón Social',
      name: 'Nombre',
      description: 'Gestiona tus clientes y mantén su información actualizada',
      addDescription: 'Agrega un nuevo cliente a tu base'
    },

    workflows: {
      title: 'Flujos',
      add: 'Agregar Flujo',
      addFirst: 'Agregar Primer Flujo',
      addFirstDescription: 'Comienza agregando tu primer flujo de trabajo',
      deleteTitle: 'Eliminar Flujo',
      deleteConfirm: '¿Estás seguro de que deseas eliminar este flujo? Esta acción no se puede deshacer.',
      editFlow: 'Editar Flujo',
      description: 'Gestiona tus flujos de trabajo',
      addDescription: 'Agrega un nuevo flujo de trabajo'
    },

    agents: {
      title: 'Agentes',
      add: 'Agregar Agente',
      addFirst: 'Agregar Primer Agente',
      addFirstDescription: 'Comienza agregando tu primer agente',
      deleteTitle: 'Eliminar Agente',
      deleteConfirm: '¿Estás seguro de que deseas eliminar este agente? Esta acción no se puede deshacer.',
      editAgent: 'Editar Agente',
      description: 'Gestiona tus agentes',
      addDescription: 'Agrega un nuevo agente',
      activate: 'Activar Agente',
      deactivate: 'Desactivar Agente',
      stats: {
        total: 'Total de Agentes',
        active: 'Agentes Activos',
        inactive: 'Agentes Inactivos'
      }
    },

    connectors: {
      title: 'Conectores',
      add: 'Agregar Conector',
      addFirst: 'Agregar Primer Conector',
      addFirstDescription: 'Comienza agregando tu primer conector',
      deleteTitle: 'Eliminar Conector',
      deleteConfirm: '¿Estás seguro de que deseas eliminar este conector? Esta acción no se puede deshacer.',
      editConnector: 'Editar Conector',
      description: 'Gestiona tus conectores',
      addDescription: 'Agrega un nuevo conector'
    },

    settings: {
      title: 'Configuración',
      description: 'Gestiona la configuración del sistema',
      
      account: {
        title: 'Cuenta',
        description: 'Gestiona tu información de cuenta'
      },

      regional: {
        title: 'Regional',
        description: 'Configura tus preferencias regionales'
      },

      language: {
        title: 'Idioma',
        en: 'Inglés',
        pt: 'Portugués',
        es: 'Español'
      },

      theme: {
        title: 'Tema',
        light: 'Claro',
        dark: 'Oscuro'
      },

      branding: {
        title: 'Marca',
        description: 'Personaliza la apariencia del sistema',
        beta: 'Marca Beta'
      },

      users: {
        title: 'Usuarios',
        description: 'Gestiona los usuarios del sistema',
        beta: 'Usuarios Beta'
      },

      apiKeys: {
        title: 'Claves de API',
        description: 'Gestiona tus claves de API',
        keyName: 'Nombre de la Clave',
        keyNamePlaceholder: 'Ej: Clave de Producción',
        generateNewKey: 'Generar Nueva Clave',
        myApiKey: 'Mi Clave API',
        mask: '•••••••••sk_1234'
      },

      workflowTypes: {
        title: 'Tipos de Flujo',
        description: 'Gestiona los tipos de flujo disponibles'
      },

      connectorTypes: {
        title: 'Tipos de Conector',
        description: 'Gestiona los tipos de conectores disponibles'
      }
    },

    auth: {
      signIn: 'Iniciar Sesión',
      signOut: 'Cerrar Sesión',
      invalidCredentials: 'Email o contraseña inválidos'
    },

    errors: {
      generic: 'Ocurrió un error',
      notFound: 'Página no encontrada',
      unauthorized: 'No autorizado',
      sessionExpired: 'Sesión expirada',
      networkError: 'Error de conexión',
      validationError: 'Error de validación'
    }
  }
};