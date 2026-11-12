import { useEffect, useState } from "react";

import type { Project } from "../types/project";
import type { Task } from "../types/task";

import { deleteTask, getTasks } from "../services/taskService";

import TaskForm from "../components/TaskForm";
import TaskEditForm from "../components/TaskEditForm";

import "../styles/ProjectDetails.css";

interface Props {
  project: Project;
}

export default function ProjectDetails({ project }: Props) {
  // Estados das tarefas
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  //filtros
  const [search, setSearch] = useState("");
  type StatusFilter = "all" | "todo" | "in_progress" | "done";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  type SortOption = "due_date" | "priority" | "title";
  const [sortBy, setSortBy] = useState<SortOption>("due_date");

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
      current.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );

    setEditingTask(null);
  }

  // Eliminar uma tarefa
  async function handleTaskDeleted(taskId: number) {
    const confirmed = window.confirm(
      "Tens a certeza de que queres eliminar esta tarefa?",
    );

    if (!confirmed || deletingTaskId !== null) {
      return;
    }

    setDeleteError("");
    setDeletingTaskId(taskId);

    try {
      await deleteTask(project.id, taskId);

      setTasks((current) => current.filter((task) => task.id !== taskId));

      setEditingTask((current) => (current?.id === taskId ? null : current));
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

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const priorityOrder = ["low", "normal", "high"];

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === "priority") {
      return (
        priorityOrder.indexOf(b.priority) - priorityOrder.indexOf(a.priority)
      );
    }

    if (sortBy === "due_date") {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;

      return a.due_date.localeCompare(b.due_date);
    }

    return 0;
  });

  return (
    <main className="project-details">
      {/* CABEÇALHO */}
      <header className="page-header">
        <div className="page-header-content">
          <h1>Gestão de Tarefas</h1>
          <p>Organiza e acompanha as tarefas dos teus projetos.</p>
        </div>
      </header>

      {/* CRIAÇÃO DE TAREFAS */}
      <section className="create-section">
        <TaskForm
          key={project.id}
          projectId={project.id}
          onTaskCreated={handleTaskCreated}
        />
      </section>

      {/* GESTÃO DE TAREFAS */}
      <section className="tasks-section">
        {/* CABEÇALHO DA SECÇÃO */}
        <header className="section-heading">
          <div className="section-heading-content">
            <h2>{project.name}</h2>
            <p>Consulta e gere as tarefas deste projeto.</p>
          </div>

          <span className="tasks-count">
            {tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}
          </span>
        </header>

        {/* PESQUISA E FILTROS */}
        <div className="tasks-toolbar">
          <div className="task-search">
            <label htmlFor="task-search">Pesquisar tarefas</label>

            <input
              id="task-search"
              type="search"
              placeholder="Pesquisar pelo título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="task-filter">
            <label htmlFor="task-status-filter">Filtrar por estado</label>

            <select
              id="task-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="all">Todas</option>
              <option value="todo">Por fazer</option>
              <option value="in_progress">Em curso</option>
              <option value="done">Concluídas</option>
            </select>
          </div>
          <div className="task-sort">
            <label htmlFor="sortBy">Ordenar por</label>

            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="due_date">Data-limite</option>
              <option value="priority">Prioridade</option>
              <option value="title">Título (A-Z)</option>
            </select>
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="tasks-results">
          {/* CARREGAMENTO */}
          {loading && (
            <p className="tasks-feedback" role="status">
              A carregar tarefas...
            </p>
          )}

          {/* ERROS */}
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

          {/* PROJETO SEM TAREFAS */}
          {!loading && !loadError && tasks.length === 0 && (
            <div className="tasks-empty">
              <h3>Ainda não existem tarefas</h3>
              <p>Cria uma tarefa para começares a organizar o projeto.</p>
            </div>
          )}

          {/* PESQUISA SEM RESULTADOS */}
          {!loading &&
            !loadError &&
            tasks.length > 0 &&
            filteredTasks.length === 0 && (
              <div className="tasks-empty">
                <h3>Nenhuma tarefa encontrada</h3>
                <p>Experimenta alterar a pesquisa ou os filtros.</p>
              </div>
            )}

          {/* LISTA DE TAREFAS */}
          {!loading && !loadError && filteredTasks.length > 0 && (
            <div className="tasks-list">
              {sortedTasks.map((task) => (
                <article className="task-card" key={task.id}>
                  {/* CABEÇALHO DO CARTÃO */}
                  <header className="task-card-header">
                    <h3>{task.title}</h3>

                    <span className={`task-status task-status--${task.status}`}>
                      {statusLabels[task.status]}
                    </span>
                  </header>

                  {/* DESCRIÇÃO */}
                  <div className="task-card-content">
                    <p>{task.description || "Sem descrição"}</p>
                  </div>

                  {/* INFORMAÇÕES */}
                  <div className="task-info">
                    <span
                      className={`task-priority task-priority--${task.priority}`}
                    >
                      Prioridade: {priorityLabels[task.priority]}
                    </span>

                    {task.due_date && (
                      <span className="task-date">
                        Prazo: {task.due_date.split("-").reverse().join("/")}
                      </span>
                    )}
                  </div>

                  {/* AÇÕES */}
                  <footer className="task-actions">
                    <button
                      className="btn-edit"
                      type="button"
                      onClick={() => handleEditTask(task)}
                      disabled={deletingTaskId === task.id}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      type="button"
                      onClick={() => handleTaskDeleted(task.id)}
                      disabled={deletingTaskId !== null}
                    >
                      {deletingTaskId === task.id
                        ? "A eliminar..."
                        : "Eliminar"}
                    </button>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL DE EDIÇÃO */}
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
