
import { useEffect, useState } from "react";

import type { Project } from "../types/project";
import type { Task } from "../types/task";

import { deleteTask, getTasks } from "../services/taskService";

import TaskForm from "../components/TaskForm";
import TaskEditForm from "../components/TaskEditForm";

interface Props {
  project: Project;
}

export default function ProjectDetails({ project }: Props) {
  // Estados das tarefas
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Estados de carregamento e erros
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  // Carregar tarefas sempre que o projeto mudar
  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setLoadError("");
    setDeleteError("");
    setEditingTask(null);
    setTasks([]);

    getTasks(project.id)
      .then((data) => {
        if (!ignore) {
          setTasks(data);
        }
      })
      .catch(() => {
        if (!ignore) {
          setLoadError("Não foi possível carregar as tarefas.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [project.id]);

  // Adicionar uma nova tarefa à lista
  function handleTaskCreated(newTask: Task) {
    setTasks((current) => [...current, newTask]);
    setLoadError("");
  }

  // Abrir o modal de edição
  function handleEditTask(task: Task) {
    setEditingTask(task);
  }

  // Fechar o modal de edição
  function handleCancelEditTask() {
    setEditingTask(null);
  }

  // Atualizar uma tarefa na lista
  function handleTaskUpdated(updatedTask: Task) {
    setTasks((current) =>
      current.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );

    setEditingTask(null);
  }

  // Eliminar uma tarefa
  async function handleTaskDeleted(taskId: number) {
    const confirmed = window.confirm(
      "Tens a certeza de que queres eliminar esta tarefa?"
    );

    if (!confirmed || deletingTaskId !== null) {
      return;
    }

    setDeleteError("");
    setDeletingTaskId(taskId);

    try {
      await deleteTask(project.id, taskId);

      setTasks((current) =>
        current.filter((task) => task.id !== taskId)
      );

      setEditingTask((current) =>
        current?.id === taskId ? null : current
      );
    } catch {
      setDeleteError("Não foi possível eliminar a tarefa.");
    } finally {
      setDeletingTaskId(null);
    }
  }

  // Apresentar os estados em português
  const statusLabels: Record<Task["status"], string> = {
    todo: "Por fazer",
    in_progress: "Em curso",
    done: "Concluída",
  };

  const priorityLabels: Record<Task["priority"], string> = {
    low: "Baixa",
    normal: "Normal",
    high: "Alta",
  };

  return (
    <main className="project-details">
      {/* Cabeçalho */}
      <header className="page-header">
        <h1>Tarefas</h1>
        <p>Organiza e acompanha todas as tuas tarefas.</p>
      </header>

      {/* Formulário de criação */}
      <section className="create-section">
        <TaskForm
          key={project.id}
          projectId={project.id}
          onTaskCreated={handleTaskCreated}
        />
      </section>

      {/* Lista de tarefas */}
      <section className="tasks-section">
        <h2>{project.name}</h2>

        {loading && <p>A carregar tarefas...</p>}

        {loadError && (
          <p className="form-error" role="alert">
            {loadError}
          </p>
        )}

        {deleteError && (
          <p className="form-error" role="alert">
            {deleteError}
          </p>
        )}

        {!loading && !loadError && tasks.length === 0 && (
          <p>Este projeto ainda não tem tarefas.</p>
        )}

        {!loading &&
          !loadError &&
          tasks.map((task) => (
            <article className="task-card" key={task.id}>
              <h3>{task.title}</h3>

              <p>{task.description || "Sem descrição"}</p>

              <div className="task-info">
                <span>
                  Estado: {statusLabels[task.status]}
                </span>

                <span>
                  Prioridade: {priorityLabels[task.priority]}
                </span>

                {task.due_date && (
                  <span>
                    Prazo: {task.due_date.split("-").reverse().join("/")}
                  </span>
                )}
              </div>

              <div className="task-actions">
                <button
                  type="button"
                  onClick={() => handleEditTask(task)}
                  disabled={deletingTaskId === task.id}
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => handleTaskDeleted(task.id)}
                  disabled={deletingTaskId !== null}
                >
                  {deletingTaskId === task.id
                    ? "A eliminar..."
                    : "Eliminar"}
                </button>
              </div>
            </article>
          ))}
      </section>

      {/* Modal de edição */}
      {editingTask && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-label="Editar tarefa"
          >
            <TaskEditForm
              key={editingTask.id}
              task={editingTask}
              onTaskUpdated={handleTaskUpdated}
              onCancel={handleCancelEditTask}
            />
          </div>
        </div>
      )}
    </main>
  );
}
