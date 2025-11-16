import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

// Mock users for demonstration
const mockUsers = [
  { id: '1', email: 'admin@cms.gov', password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: '2', email: 'officer@cms.gov', password: 'officer123', name: 'Officer Smith', role: 'officer' },
  { id: '3', email: 'citizen@example.com', password: 'citizen123', name: 'John Doe', role: 'citizen' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('cms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    // Mock login logic
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('cms_user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cms_user');
  };

  const register = async (name, email, password) => {
    // Mock registration logic
    const existingUser = mockUsers.find(u => u.email === email);
    
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      role: 'citizen',
    };

    setUser(newUser);
    localStorage.setItem('cms_user', JSON.stringify(newUser));
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

