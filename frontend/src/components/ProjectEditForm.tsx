import { useState } from "react";
import type { SubmitEvent } from "react";
import type { Project } from "../types/project";
import { updateProject } from "../services/projectService";
import "../styles/ProjectEditForm.css";

interface Props {
  project: Project;
  onProjectUpdated: (project: Project) => void;
  onCancel: () => void;
}

export default function ProjectForm({
  project,
  onProjectUpdated,
  onCancel,
}: Props) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const updatedProject = await updateProject(project.id, {
        name,
        description,
      });

      onProjectUpdated(updatedProject);
      onCancel();
    } catch {
      setError("Não foi possível editar o projeto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="project-edit-form" onSubmit={handleSubmit}>
      <h2>Editar Projeto</h2>

      <div>
        <label htmlFor="name">Nome do projeto</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={255}
        />
      </div>

      <div>
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {error && <p role="alert">{error}</p>}
      <div className="project-edit-actions">
        <button type="submit" className="btn-edit" disabled={loading}>
          {loading ? "A guardar..." : "Editar projeto"}
        </button>

        <button
          type="button"
          className="btn-cancel"
          disabled={loading}
          onClick={() => onCancel()}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
