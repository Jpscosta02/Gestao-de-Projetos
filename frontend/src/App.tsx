import ProjectsPage from "./pages/ProjectsPage";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading, error } = useAuth();

  console.log("Estado de autenticação:", {
    user,
    loading,
    error,
  });

  if (loading) {
    return <p>A verificar autenticação...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <>
      <p>
        {user
          ? `Sessão iniciada por ${user.name}`
          : "Nenhum utilizador autenticado"}
      </p>

      <ProjectsPage />
    </>
  );
}

export default App;