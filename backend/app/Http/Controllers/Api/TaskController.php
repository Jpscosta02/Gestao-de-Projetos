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
            'priority' => 'required|in:low,normal,high'
        ]);

        $task = $project->tasks()->create($validated);

        return response()->json($task,201);
    }
}
