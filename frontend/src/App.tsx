
import { Routes, Route, Navigate } from "react-router";

import ProjectsPage from "./pages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading, error } = useAuth();

  // Aguardar pela verificação da sessão
  if (loading) {
    return <p>A verificar autenticação...</p>;
  }

  // Tratar erros de comunicação
  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <Routes>
      {/* Página inicial */}
      <Route
        path="/"
        element={
          <Navigate
            to={user ? "/projects" : "/login"}
            replace
          />
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/projects" replace />
            : <LoginPage />
        }
      />

      {/* Registo */}
      <Route
        path="/register"
        element={
          user
            ? <Navigate to="/projects" replace />
            : <RegisterPage />
        }
      />

      {/* Projetos - rota protegida */}
      <Route
        path="/projects"
        element={
          user
            ? <ProjectsPage />
            : <Navigate to="/login" replace />
        }
      />

      {/* Endereços desconhecidos */}
      <Route
        path="*"
        element={
          <Navigate
            to={user ? "/projects" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;
