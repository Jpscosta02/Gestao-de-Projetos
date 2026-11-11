import { useState, useEffect } from "react";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import { getTasks } from "../services/taskService";
import TaskForm from "../components/TaskForm";

interface Props {
  project: Project;
}

export default function ProjectDetails({ project }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    getTasks(project.id)
      .then((data) => {
        if (!ignore) {
          setTasks(data);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError("Erro ao carregar Tarefas");
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

  function handleTaskCreated(task: Task) {
    setTasks((current) => [...current, task]);
  }

  return (
    <main className="project-details">
      <header className="page-header">
        <h1>Tarefas</h1>
        <p>Organiza e acompanha todas as tuas tarefas</p>
      </header>

      <section className="create-section">
        <TaskForm projectId={project.id} onTaskCreated={handleTaskCreated} />
      </section>

      <h2>{project.name}</h2>

      {loading && <p>A carregar tarefas...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && tasks.length === 0 && (
        <p>Este projeto ainda não tem tarefas.</p>
      )}

      {!loading &&
        !error &&
        tasks.map((task) => (
          <article className="task-card" key={task.id}>
            <h3>{task.title}</h3>

            <p>{task.description || "Sem descrição"}</p>

            <span>Estado: {task.status}</span>
            <span>Prioridade: {task.priority}</span>
            {task.due_date && (
              <span>Prazo: {task.due_date.split("-").reverse().join("/")}</span>
            )}
          </article>
        ))}
    </main>
  );
}
