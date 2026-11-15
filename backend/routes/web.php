<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/login',[AuthController::class, 'Login'])->middleware('guest');

Route::post('/register',[AuthController::class, 'Register'])->middleware('guest');

Route::post('/logout',[AuthController::class, 'Logout'])->middleware('auth');