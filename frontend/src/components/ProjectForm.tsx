import { useState } from "react";
import type { SubmitEvent } from "react";
import type { Project } from "../types/project";
import { createProject } from "../services/projectService";

interface Props {
  onProjectCreated: (project: Project) => void;
}
export default function ProjectForm({ onProjectCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const project = await createProject({ name, description });
      onProjectCreated(project);
      setName("");
      setDescription("");
    } catch {
      setError("Não foi possível criar o projeto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="ui-form" onSubmit={handleSubmit}>
      <div className="ui-form__header">
        <span className="eyebrow">NOVO REGISTO</span>
        <h2>Criar projeto</h2>
        <p>Dá um nome ao projeto e acrescenta uma descrição.</p>
      </div>
      <div className="form-field">
        <label htmlFor="new-project-name">
          Nome do projeto <span aria-hidden="true">*</span>
        </label>
        <input
          id="new-project-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Website pessoal"
          required
          maxLength={255}
        />
      </div>
      <div className="form-field">
        <label htmlFor="new-project-description">Descrição</label>
        <textarea
          id="new-project-description"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="O que pretendes desenvolver?"
        />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        <button
          className="ui-btn ui-btn--primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "A criar…" : "Criar projeto"}
        </button>
      </div>
    </form>
  );
}
