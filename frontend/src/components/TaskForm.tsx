import type { Task } from "../types/task";
import { useState } from "react";
import type { SubmitEvent } from "react";
import { createTask } from "../services/taskService";

interface Props {
  projectId: number;
  onTaskCreated: (task: Task) => void;
}

type Priority = "low" | "normal" | "high";

export default function TaskForm({ projectId, onTaskCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [due_date, setDue_date] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const newTask = await createTask(projectId, {
        title,
        description,
        priority,
        due_date: due_date || null,
      });

      onTaskCreated(newTask);
      setTitle("");
      setDescription("");
      setPriority("normal");
      setDue_date("");
    } catch {
      setError("Não foi possível criar a tarefa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <h2>Nova Tarefa</h2>
      <p className="form-subtitle">
        Preenche os dados para criares uma nova tarefa.
      </p>

      <div className="form-group">
        <label htmlFor="title">Nome da tarefa</label>
        <input
          id="title"
          type="text"
          placeholder="Ex.: Ir ao GYM"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={30}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          placeholder="Descreve brevemente a tarefa..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="priority">Prioridade</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "low" | "normal" | "high")
          }
        >
          <option value="low">Baixa</option>
          <option value="normal">Normal</option>
          <option value="high">Alta</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Data-limite</label>

        <input
          type="date"
          id="dueDate"
          value={due_date}
          onChange={(e) => setDue_date(e.target.value)}
        />
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button className="btn-create" type="submit" disabled={loading}>
        {loading ? "A guardar..." : "Criar Tarefa"}
      </button>
    </form>
  );
}
