<?php

use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/mensagem', function () {
    return response()->json([
        'mensagem' => 'Olá! Esta mensagem veio do Laravel.',
        'sucesso' => true,
    ]);
});

Route::get('/projects', [ProjectController::class,'index']);

Route::post('/projects', [ProjectController::class,'store']);

Route::put('/projects/{project}', [ProjectController::class, 'update']);

Route::delete('/projects/{project}', [ProjectController::class,'destroy']);

Route::get('/projects/{project}/tasks',[TaskController::class,'index']);

Route::post('/projects/{project}/tasks',[TaskController::class,'store']);

Route::put('/projects/{project}/tasks/{task}', [TaskController::class, 'update']);

Route::delete('/projects/{project}/tasks/{task}', [TaskController::class, 'destroy']);