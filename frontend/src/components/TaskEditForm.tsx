
import { useState } from "react";
import type { SubmitEvent } from "react";

import type { Task } from "../types/task";
import { updateTask } from "../services/taskService";

import "../styles/taskEditForm.css";

interface Props {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onCancel: () => void;
}

type Priority = Task["priority"];
type Status = Task["status"];

export default function TaskEditForm({
  task,
  onTaskUpdated,
  onCancel,
}: Props) {
  // Dados do formulário
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [status, setStatus] = useState<Status>(task.status);
  const [dueDate, setDueDate] = useState(task.due_date ?? "");

  // Estado da operação
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const updatedTask = await updateTask(task.project_id, task.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        due_date: dueDate || null,
      });

      onTaskUpdated(updatedTask);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      setError("Não foi possível guardar as alterações da tarefa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="ui-form task-edit-form" onSubmit={handleSubmit}>
      {/* Cabeçalho */}
      <header className="task-edit-form__header">
        <span className="eyebrow">GESTÃO DE TAREFAS</span>

        <h2>Editar tarefa</h2>

        <p>
          Atualiza as informações, define a prioridade
          e acompanha o progresso da tarefa.
        </p>
      </header>

      {/* Campos do formulário */}
      <div className="task-edit-form__fields">

        <div className="form-field">
          <label htmlFor="edit-task-title">
            Nome da tarefa
            <span className="required-mark" aria-hidden="true">*</span>
          </label>

          <input
            id="edit-task-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex.: Desenvolver frontend"
            maxLength={30}
            required
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label htmlFor="edit-task-description">
            Descrição
          </label>

          <textarea
            id="edit-task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descreve brevemente a tarefa..."
            rows={4}
            disabled={loading}
          />
        </div>

        {/* Prioridade e estado */}
        <div className="task-edit-form__row">

          <div className="form-field">
            <label htmlFor="edit-task-priority">
              Prioridade
            </label>

            <select
              id="edit-task-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as Priority)
              }
              disabled={loading}
            >
              <option value="low">Baixa</option>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="edit-task-status">
              Estado
            </label>

            <select
              id="edit-task-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as Status)
              }
              disabled={loading}
            >
              <option value="todo">Por fazer</option>
              <option value="in_progress">Em curso</option>
              <option value="done">Concluída</option>
            </select>
          </div>

        </div>

        {/* Data-limite */}
        <div className="form-field">
          <label htmlFor="edit-task-date">
            Data-limite
          </label>

          <input
            id="edit-task-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            disabled={loading}
          />

          <span className="task-edit-form__hint">
            Este campo é opcional.
          </span>
        </div>

      </div>

      {/* Mensagens de erro */}
      {error && (
        <div className="task-edit-form__error" role="alert">
          {error}
        </div>
      )}

      {/* Botões */}
      <footer className="task-edit-form__actions">
        <button
          type="button"
          className="ui-btn ui-btn--subtle"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="ui-btn ui-btn--primary"
          disabled={loading || !title.trim()}
        >
          {loading ? "A guardar..." : "Guardar alterações"}
        </button>
      </footer>
    </form>
  );
}
