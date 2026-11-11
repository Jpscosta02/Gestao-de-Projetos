<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use GuzzleHttp\Handler\ProxyEnv;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(): JsonResponse{
        $projects = Project::orderBy('created_at','desc')->get();

        return response()->json($projects);
    }

    public function store(Request $request): JsonResponse{
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description'=> 'nullable|string'
        ]);

        $project = Project::create($validated);

        return response()->json($project,201);
    }

    public function update(Request $request,Project $project): JsonResponse{
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description'=> 'nullable|string'
        ]);

        $project->update($validated);

        return response()->json($project);
    }

    public function destroy(Project $project): JsonResponse{
        $project->delete();

        return response()->json([
            'message' => 'Projeto eliminado com sucesso'
        ]);
    }
}
