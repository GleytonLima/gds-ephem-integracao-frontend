// Serviço para gerenciar o banco de dados IndexedDB

export interface User {
  id?: number;
  integrationId?: number;
  name: string;
  email: string;
  phone: string;
  country: string;
}

const DB_NAME = 'gds-ephem-db';
const DB_VERSION = 1;
const USER_STORE = 'users';

// Inicializa o banco de dados
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Erro ao abrir o banco de dados:', event);
      reject('Não foi possível abrir o banco de dados');
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Criar store de usuários se não existir
      if (!db.objectStoreNames.contains(USER_STORE)) {
        const userStore = db.createObjectStore(USER_STORE, { keyPath: 'id', autoIncrement: true });
        userStore.createIndex('email', 'email', { unique: true });
      }
    };
  });
};

// Adicionar um novo usuário
export const addUser = async (user: User): Promise<number> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USER_STORE], 'readwrite');
    const store = transaction.objectStore(USER_STORE);
    
    const request = store.add(user);
    
    request.onsuccess = (event) => {
      const id = (event.target as IDBRequest<number>).result;
      resolve(id);
    };
    
    request.onerror = (event) => {
      console.error('Erro ao adicionar usuário:', event);
      reject('Não foi possível adicionar o usuário');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Obter todos os usuários
export const getAllUsers = async (): Promise<User[]> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USER_STORE], 'readonly');
    const store = transaction.objectStore(USER_STORE);
    
    const request = store.getAll();
    
    request.onsuccess = (event) => {
      const users = (event.target as IDBRequest<User[]>).result;
      resolve(users);
    };
    
    request.onerror = (event) => {
      console.error('Erro ao obter usuários:', event);
      reject('Não foi possível obter os usuários');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Obter um usuário pelo ID
export const getUserById = async (id: number): Promise<User | null> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USER_STORE], 'readonly');
    const store = transaction.objectStore(USER_STORE);
    
    const request = store.get(id);
    
    request.onsuccess = (event) => {
      const user = (event.target as IDBRequest<User | undefined>).result;
      resolve(user || null);
    };
    
    request.onerror = (event) => {
      console.error('Erro ao obter usuário:', event);
      reject('Não foi possível obter o usuário');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Atualizar um usuário
export const updateUser = async (user: User): Promise<void> => {
  if (!user.id) {
    throw new Error('ID do usuário é obrigatório para atualização');
  }
  
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USER_STORE], 'readwrite');
    const store = transaction.objectStore(USER_STORE);
    
    const request = store.put(user);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = (event) => {
      console.error('Erro ao atualizar usuário:', event);
      reject('Não foi possível atualizar o usuário');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Excluir um usuário
export const deleteUser = async (id: number): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USER_STORE], 'readwrite');
    const store = transaction.objectStore(USER_STORE);
    
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = (event) => {
      console.error('Erro ao excluir usuário:', event);
      reject('Não foi possível excluir o usuário');
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
}; 