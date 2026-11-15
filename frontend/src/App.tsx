import ProjectsPage from "./pages/ProjectsPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading, error } = useAuth();

  console.log("Estado de autenticação:", {
    user,
    loading,
    error,
  });

  if (!user) {
    return <RegisterPage />;
  }

  return <ProjectsPage />;
}

export default App;
