import api from './api.config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

// Chaves para armazenamento no localStorage
const TOKEN_KEY = '@gds-ephem:token';
const USER_KEY = '@gds-ephem:user';

// Credenciais mockadas para autenticação
const MOCK_EMAIL = 'admin@test.com';
const MOCK_PASSWORD = 'gds2025';
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicm9sZSI6ImFkbWluIn0';
const MOCK_USER = {
  id: 1,
  name: 'Administrador',
  email: MOCK_EMAIL,
  role: 'admin'
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Simulação de autenticação
    return new Promise((resolve, reject) => {
      // Simular um pequeno atraso para parecer uma chamada real
      setTimeout(() => {
        if (credentials.email === MOCK_EMAIL && credentials.password === MOCK_PASSWORD) {
          const response = {
            token: MOCK_TOKEN,
            user: MOCK_USER
          };
          
          // Armazenar token e informações do usuário
          localStorage.setItem(TOKEN_KEY, response.token);
          localStorage.setItem(USER_KEY, JSON.stringify(response.user));
          
          resolve(response);
        } else {
          reject(new Error('Credenciais inválidas'));
        }
      }, 800);
    });
    
    // Quando o backend estiver pronto, descomente o código abaixo
    // const response = await api.post('/api-integracao/v1/auth/login', credentials);
    // localStorage.setItem(TOKEN_KEY, response.data.token);
    // localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    // return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return Promise.reject(error);
  }
};

export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getUser = (): AuthResponse['user'] | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Configurar o interceptor para adicionar o token em todas as requisições
export const setupAuthInterceptor = (): void => {
  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        //TODO: descomentar quando o backend estiver pronto
        //config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para lidar com erros de autenticação (401)
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token expirado ou inválido, fazer logout
        logout();
        // Redirecionar para a página de login
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}; 