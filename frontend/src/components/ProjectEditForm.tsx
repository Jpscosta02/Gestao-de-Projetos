import { useState } from "react";
import type { SubmitEvent } from "react";
import type { Project } from "../types/project";
import { updateProject } from "../services/projectService";

interface Props {
  project: Project;
  onProjectUpdated: (project: Project) => void;
  onCancel: () => void;
}
export default function ProjectEditForm({
  project,
  onProjectUpdated,
  onCancel,
}: Props) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const updated = await updateProject(project.id, { name, description });
      onProjectUpdated(updated);
    } catch {
      setError("Não foi possível editar o projeto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="ui-form" onSubmit={handleSubmit}>
      <div className="ui-form__header">
        <span className="eyebrow">EDITAR PROJETO</span>
        <h2>Detalhes do projeto</h2>
        <p>Atualiza as informações e guarda as alterações.</p>
      </div>
      <div className="form-field">
        <label htmlFor="edit-project-name">
          Nome do projeto <span aria-hidden="true">*</span>
        </label>
        <input
          id="edit-project-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={255}
        />
      </div>
      <div className="form-field">
        <label htmlFor="edit-project-description">Descrição</label>
        <textarea
          id="edit-project-description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        <button
          className="ui-btn ui-btn--subtle"
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          className="ui-btn ui-btn--primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "A guardar…" : "Guardar alterações"}
        </button>
      </div>
    </form>
  );
}
