<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    public function index(Project $project):JsonResponse {
        $tasks = $project->tasks;

        return response()->json($tasks);
    }

    public function store(Request $request, Project $project): JsonResponse{
        $validated = $request->validate([
            'title' => 'required|string|max:30',
            'description'=> 'nullable|string',
            'due_date' => 'date|nullable',
            'priority' => 'required|in:low,normal,high',
            'status' => 'required|in:todo,in_progress,done',
        ]);

        $task = $project->tasks()->create($validated);

        return response()->json($task,201);
    }

    public function update(Request $request,Project $project,Task $task): JsonResponse{
        $validated = $request->validate([
            'title' => 'required|string|max:30',
            'description'=> 'nullable|string',
            'due_date' => 'date|nullable',
            'priority' => 'required|in:low,normal,high',
            'status' => 'required|in:todo,in_progress,done',
        ]);

        if($task->project_id != $project->id){
            abort(404);
        }

        $task->update($validated);

        return response()->json($task);
    }

    public function destroy(Project $project, Task $task){

        if($task->project_id != $project->id){
                abort(404);
            }
            
        $task->delete();

        return response()->json([
            'message' => 'Tarefa eliminada com sucesso'
        ]);
    }
}
