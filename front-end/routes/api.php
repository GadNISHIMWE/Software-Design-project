<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GreenhouseController;
use App\Http\Controllers\Api\PlantController;
use App\Http\Controllers\Api\SensorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('api')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});


// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Greenhouse routes
    Route::apiResource('greenhouses', GreenhouseController::class);
    Route::apiResource('plants', PlantController::class);
    Route::apiResource('sensors', SensorController::class);
}); 