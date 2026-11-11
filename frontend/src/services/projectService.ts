
import type { Project, CreateProjectData } from '../types/project';

const API_URL = '/api/projects';

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(API_URL, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao carregar projetos');
  }

  return response.json();
}

export async function createProject(
  data: CreateProjectData
): Promise<Project> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar projeto');
  }

  return response.json();
}

export async function updateProject(
  id: number,
  data: CreateProjectData
): Promise<Project> {
  const response = await fetch(
    `/api/projects/${id}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar projeto');
  }

  return response.json();
}

export async function deleteProject(
  id: number,
): Promise<void> {
  const response = await fetch(
    `/api/projects/${id}`,{
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
  });

  if (!response.ok) {
    throw new Error('Erro ao eliminar projeto');
  }
}
