import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

// Mock users for demonstration
const mockUsers = [
  
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
  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Invalid email or password",
      };
    }

    // Expected response from backend:
    // { user: {...}, token: "JWT_TOKEN_HERE" }

    const loggedUser = data.user;
    const jwtToken = data.token;

    // Save in state
    setUser(loggedUser);

    // Save in localStorage
    localStorage.setItem("cms_user", JSON.stringify(loggedUser));
    localStorage.setItem("cms_token", jwtToken);

    return { success: true };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem('cms_user');
    localStorage.removeItem('cms_token');
    setUser(null);
  };

const register = async (name, email, password) => {
  try {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    // If backend sends user-exist error
    if (!res.ok) {
      return {
        success: false,
        error: data.message || "User already exists",
      };
    }

    // Successful registration
    return {
      success: true,
      message: data.message || "Registration successful",
    };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
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

