import { useEffect, useState } from "react";
import type { Project } from "../types/project";
import { deleteProject, getProjects } from "../services/projectService";
import ProjectForm from "../components/ProjectForm";
import ProjectEditForm from "../components/ProjectEditForm";
import ProjectDetails from "./ProjectDetails";
import "../styles/ProjectsPage.css";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(
    null,
  );
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    let ignore = false;
    getProjects()
      .then((data) => {
        if (!ignore) setProjects(data);
      })
      .catch(() => {
        if (!ignore) setLoadError("Não foi possível carregar os projetos.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!editingProject && !selectedProject) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEditingProject(null);
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editingProject, selectedProject]);

  function handleProjectCreated(project: Project) {
    setProjects((current) => [project, ...current]);
    setShowCreateForm(false);
    setActionError("");
  }

  function handleProjectUpdated(updatedProject: Project) {
    setProjects((current) =>
      current.map((project) =>
        project.id === updatedProject.id ? updatedProject : project,
      ),
    );
    setSelectedProject((current) =>
      current?.id === updatedProject.id ? updatedProject : current,
    );
    setEditingProject(null);
  }

  async function handleProjectDeleted(id: number) {
    if (
      deletingProjectId !== null ||
      !window.confirm(
        "Tens a certeza de que queres eliminar este projeto e as suas tarefas?",
      )
    )
      return;
    setActionError("");
    setDeletingProjectId(id);
    try {
      await deleteProject(id);
      setProjects((current) => current.filter((project) => project.id !== id));
      setSelectedProject((current) => (current?.id === id ? null : current));
      setEditingProject((current) => (current?.id === id ? null : current));
    } catch {
      setActionError("Não foi possível eliminar o projeto.");
    } finally {
      setDeletingProjectId(null);
    }
  }

  return (
    <main className="app-shell projects-page">
      <div className="app-container">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">WORKSPACE / VISÃO GERAL</span>
            <h1>
              Os teus projetos<span className="heading-accent">.</span>
            </h1>
            <p>
              Um espaço simples para organizar projetos e acompanhar o que falta
              fazer.
            </p>
          </div>
          <button
            className="ui-btn ui-btn--primary"
            type="button"
            onClick={() => setShowCreateForm((value) => !value)}
          >
            <span aria-hidden="true">{showCreateForm ? "×" : "+"}</span>{" "}
            {showCreateForm ? "Fechar formulário" : "Novo projeto"}
          </button>
        </header>

        <section className="summary-grid" aria-label="Resumo dos projetos">
          <div className="summary-card">
            <span>Total de projetos</span>
            <strong>{projects.length}</strong>
            <small>Projetos registados</small>
          </div>
          <div className="summary-card">
            <span>Projetos ativos</span>
            <strong>
              {projects.filter((project) => project.status === "active").length}
            </strong>
            <small>Em desenvolvimento</small>
          </div>
          <div className="summary-card summary-card--highlight">
            <span>Outros estados</span>
            <strong>
              {projects.filter((project) => project.status !== "active").length}
            </strong>
            <small>Projetos não ativos</small>
          </div>
        </section>

        {showCreateForm && (
          <section className="create-panel" aria-label="Criar novo projeto">
            <ProjectForm onProjectCreated={handleProjectCreated} />
          </section>
        )}

        <section
          className="projects-section"
          aria-labelledby="projects-heading"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">ÁREA DE TRABALHO</span>
              <h2 id="projects-heading">Projetos</h2>
            </div>
            <span className="section-count">
              {projects.length} {projects.length === 1 ? "projeto" : "projetos"}
            </span>
          </div>

          {loading && (
            <div className="ui-feedback" role="status">
              A carregar projetos…
            </div>
          )}
          {loadError && (
            <div className="ui-feedback ui-feedback--error" role="alert">
              {loadError}
            </div>
          )}
          {actionError && (
            <div className="ui-feedback ui-feedback--error" role="alert">
              {actionError}
            </div>
          )}

          {!loading && !loadError && projects.length === 0 && (
            <div className="empty-state">
              <span className="empty-state__icon" aria-hidden="true">
                ▤
              </span>
              <h3>Ainda não existem projetos</h3>
              <p>
                Cria o teu primeiro projeto para começares a organizar as
                tarefas.
              </p>
              <button
                className="ui-btn ui-btn--primary"
                type="button"
                onClick={() => setShowCreateForm(true)}
              >
                Criar projeto
              </button>
            </div>
          )}

          {!loading && !loadError && projects.length > 0 && (
            <div className="projects-grid">
              {projects.map((project) => (
                <article className="project-card" key={project.id}>
                  <div className="project-card__top">
                    <span className="project-card__symbol" aria-hidden="true">
                      ▦
                    </span>
                    <span
                      className={`status-pill status-pill--${project.status === "active" ? "active" : "neutral"}`}
                    >
                      {project.status === "active" ? "Ativo" : project.status}
                    </span>
                  </div>
                  <div className="project-card__content">
                    <h3>{project.name}</h3>
                    <p>
                      {project.description ||
                        "Este projeto ainda não tem descrição."}
                    </p>
                  </div>
                  <div className="project-card__footer">
                    <button
                      className="ui-btn ui-btn--primary ui-btn--small"
                      type="button"
                      onClick={() => setSelectedProject(project)}
                    >
                      Ver tarefas <span aria-hidden="true">↗</span>
                    </button>
                    <button
                      className="ui-btn ui-btn--ghost ui-btn--small"
                      type="button"
                      onClick={() => setEditingProject(project)}
                      disabled={deletingProjectId === project.id}
                    >
                      Editar
                    </button>
                    <button
                      className="ui-btn ui-btn--danger ui-btn--small"
                      type="button"
                      onClick={() => handleProjectDeleted(project.id)}
                      disabled={deletingProjectId !== null}
                    >
                      {deletingProjectId === project.id
                        ? "A eliminar…"
                        : "Eliminar"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {editingProject && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditingProject(null);
          }}
        >
          <div
            className="modal-content modal-content--form"
            role="dialog"
            aria-modal="true"
            aria-label="Editar projeto"
          >
            <ProjectEditForm
              key={editingProject.id}
              project={editingProject}
              onProjectUpdated={handleProjectUpdated}
              onCancel={() => setEditingProject(null)}
            />
          </div>
        </div>
      )}

      {selectedProject && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedProject(null);
          }}
        >
          <div
            className="modal-content modal-content--wide"
            role="dialog"
            aria-modal="true"
            aria-label={`Tarefas de ${selectedProject.name}`}
          >
            <div className="modal-toolbar">
              <span>DETALHES DO PROJETO</span>
              <button
                className="icon-button"
                type="button"
                aria-label="Fechar detalhes"
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>
            </div>
            <ProjectDetails
              key={selectedProject.id}
              project={selectedProject}
            />
          </div>
        </div>
      )}
    </main>
  );
}
