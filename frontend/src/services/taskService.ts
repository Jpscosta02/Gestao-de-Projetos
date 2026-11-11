import type { Task, CreateTaskData, UpdateTaskData } from "../types/task";

export async function getTasks(projectId: number): Promise<Task[]> {
  const response = await fetch(`/api/projects/${projectId}/tasks`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao carregar tarefas");
  }

  return response.json();
}

export async function createTask(
  projectId: number,
  data: CreateTaskData,
): Promise<Task> {
  const response = await fetch(`/api/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar Tarefa");
  }

  return response.json();
}

export async function updateTask(
  projectId: number,
  taskId: number,
  data: UpdateTaskData,
): Promise<Task> {
  const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar tarefa");
  }

  return response.json();
}

export async function deleteTask(
  projectId: number,
  taskId: number,
): Promise<void> {
  const response = await fetch(
    `/api/projects/${projectId}/tasks/${taskId}`,{
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
  });

  if (!response.ok) {
    throw new Error('Erro ao eliminar tarefa');
  }
}
