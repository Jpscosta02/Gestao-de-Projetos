import { useState } from "react";
import type { SubmitEvent } from "react";
import type { Task } from "../types/task";
import { createTask } from "../services/taskService";

interface Props {
  projectId: number;
  onTaskCreated: (task: Task) => void;
}
type Priority = Task["priority"];

export default function TaskForm({ projectId, onTaskCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const task = await createTask(projectId, {
        title,
        description,
        priority,
        due_date: dueDate || null,
      });
      onTaskCreated(task);
      setTitle("");
      setDescription("");
      setPriority("normal");
      setDueDate("");
    } catch {
      setError("Não foi possível criar a tarefa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="ui-form" onSubmit={handleSubmit}>
      <div className="ui-form__header">
        <span className="eyebrow">NOVA TAREFA</span>
        <h3>Adicionar tarefa</h3>
        <p>Define o que precisa de ser feito e quando.</p>
      </div>
      <div className="form-field">
        <label htmlFor="new-task-title">
          Título <span aria-hidden="true">*</span>
        </label>
        <input
          id="new-task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ex.: Implementar login"
          required
          maxLength={30}
        />
      </div>
      <div className="form-field">
        <label htmlFor="new-task-description">Descrição</label>
        <textarea
          id="new-task-description"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Detalhes da tarefa…"
        />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="new-task-priority">Prioridade</label>
          <select
            id="new-task-priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
          >
            <option value="low">Baixa</option>
            <option value="normal">Normal</option>
            <option value="high">Alta</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="new-task-date">Data-limite</label>
          <input
            id="new-task-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
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
          {loading ? "A criar…" : "Criar tarefa"}
        </button>
      </div>
    </form>
  );
}
