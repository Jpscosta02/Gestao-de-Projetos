import { useEffect, useState } from "react";
import type { Project } from "../types/project";
import { getProjects } from "../services/projectService";
import ProjectForm from "../components/ProjectForm";
import ProjectEditForm from "../components/ProjectEditForm";
import { deleteProject } from "../services/projectService";
import "../styles/ProjectsPage.css";
import ProjectDetails from "./ProjectDetails";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setError("Erro ao carregar Projetos"))
      .finally(() => setLoading(false));
  }, []);

  function handleProjectCreated(project: Project) {
    setProjects((current) => [project, ...current]);
  }

  function editProject(project: Project) {
    setEditingProject(project);
  }

  async function handleProjectDeleted(id: number) {
    try {
      const confirmed = window.confirm(
        "Tens a certeza de que queres eliminar este projeto?",
      );

      if (!confirmed) {
        return;
      }

      await deleteProject(id);

      setSelectedProject((current) =>
          current?.id === id ? null : current
      );

      setProjects((current) => current.filter((project) => project.id !== id));
    } catch {
      setError("Não foi possível eliminar o projeto.");
    }
  }

  function handleProjectUpdated(updatedProject: Project) {
    setProjects((current) =>
      current.map((project) => {
        if (project.id === updatedProject.id) {
          return updatedProject;
        }

        return project;
      }),
    );
    setEditingProject(null);
  }

  function handleCancelEdit() {
    setEditingProject(null);
  }

  function handleCloseDetails(){
    setSelectedProject(null);
  }

  return (
    <main className="projects-page">
      <header className="page-header">
        <h1>Gestor de Projetos</h1>
        <p>Organiza e acompanha todos os teus projetos.</p>
      </header>

      <section className="create-section">
        <ProjectForm onProjectCreated={handleProjectCreated} />
      </section>

      <section className="projects-section">
        <h2>Os meus projetos</h2>

        {loading && <p>A carregar...</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && projects.length === 0 && (
          <p>Ainda não existem projetos.</p>
        )}

        <div className="projects-grid">
          {!loading &&
            !error &&
            projects.map((project) => (
              <article className="project-card" key={project.id}>
                <h3>{project.name}</h3>
                <p>{project.description || "Sem descrição"}</p>

                <span className="project-status">{project.status}</span>

                <div className="project-actions">
                  <button
                    className="btn-edit"
                    onClick={() => editProject(project)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => handleProjectDeleted(project.id)}
                  >
                    Eliminar
                  </button>
                  <button onClick={() => setSelectedProject(project)}>
                      Ver tarefas
                  </button>
                </div>
              </article>
            ))}
        </div>
      </section>

      {editingProject && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProjectEditForm
              key={editingProject.id}
              project={editingProject}
              onProjectUpdated={handleProjectUpdated}
              onCancel={handleCancelEdit}
            />
          </div>
        </div>
      )}

      {selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProjectDetails 
              project={selectedProject}
            />
            <button onClick={handleCloseDetails}>
                Fechar
            </button>
          </div>
        </div>
      )}
      
    </main>
  );
}
