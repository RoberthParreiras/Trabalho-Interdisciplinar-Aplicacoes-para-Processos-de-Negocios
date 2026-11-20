// context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/usuarios/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          setUsuario(data.usuario);
        } else {
          setUsuario(null);
        }
      } catch (err) {
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch("http://localhost:3000/usuarios/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUsuario(null);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, carregando, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for cleaner imports
export function useAuth() {
  return useContext(AuthContext);
}
