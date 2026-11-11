import { useState } from "react";
import type { SubmitEvent } from "react";
import type { Task } from "../types/task";
import { updateTask } from "../services/taskService";

interface Props {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onCancel: () => void;
}
type Priority = Task["priority"];
type Status = Task["status"];

export default function TaskEditForm({ task, onTaskUpdated, onCancel }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [status, setStatus] = useState<Status>(task.status);
  const [dueDate, setDueDate] = useState(task.due_date ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const updated = await updateTask(task.project_id, task.id, {
        title,
        description,
        priority,
        status,
        due_date: dueDate || null,
      });
      onTaskUpdated(updated);
    } catch {
      setError("Não foi possível editar a tarefa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="ui-form" onSubmit={handleSubmit}>
      <div className="ui-form__header">
        <span className="eyebrow">EDITAR TAREFA</span>
        <h2>Atualizar tarefa</h2>
        <p>Altera as informações e acompanha o estado do trabalho.</p>
      </div>
      <div className="form-field">
        <label htmlFor="edit-task-title">
          Título <span aria-hidden="true">*</span>
        </label>
        <input
          id="edit-task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={30}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="edit-task-description">Descrição</label>
        <textarea
          id="edit-task-description"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="edit-task-priority">Prioridade</label>
          <select
            id="edit-task-priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
          >
            <option value="low">Baixa</option>
            <option value="normal">Normal</option>
            <option value="high">Alta</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="edit-task-status">Estado</label>
          <select
            id="edit-task-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as Status)}
          >
            <option value="todo">Por fazer</option>
            <option value="in_progress">Em curso</option>
            <option value="done">Concluída</option>
          </select>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="edit-task-date">Data-limite</label>
        <input
          id="edit-task-date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
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
