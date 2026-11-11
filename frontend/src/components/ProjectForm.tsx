import { useState } from "react";
import type { SubmitEvent } from "react";
import type { Project } from "../types/project";
import { createProject } from "../services/projectService";
import "../styles/ProjectForm.css";

interface Props {
  onProjectCreated: (project: Project) => void;
}

export default function ProjectForm({ onProjectCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

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
    <form className="project-form" onSubmit={handleSubmit}>
      <h2>Novo projeto</h2>
      <p className="form-subtitle">
        Preenche os dados para começares um novo projeto.
      </p>

      <div className="form-group">
        <label htmlFor="name">Nome do projeto</label>
        <input
          id="name"
          type="text"
          placeholder="Ex.: Gestor de Tarefas"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={255}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          placeholder="Descreve brevemente o teu projeto..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {error && (
        <p className='"form-error"' role="alert">
          {error}
        </p>
      )}

      <button className="btn-create" type="submit" disabled={loading}>
        {loading ? "A guardar..." : "Criar projeto"}
      </button>
    </form>
  );
}
