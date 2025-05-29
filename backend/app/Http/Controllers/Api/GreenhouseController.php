<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Greenhouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class GreenhouseController extends Controller
{
    public function index()
    {
        try {
            Log::info('GreenhouseController index method reached.');
            Log::info('Fetching greenhouses for authenticated user');
            
            if (!Auth::check()) {
                Log::warning('Greenhouses index: Unauthenticated access.');
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthenticated.'
                ], 401);
            }

            $user = Auth::user();
            
            // Fetch greenhouses only for the authenticated user
            $greenhouses = $user->greenhouses;
            
            Log::info('Greenhouses fetched', ['count' => $greenhouses->count(), 'data' => $greenhouses->toArray()]);
            
            return response()->json([
                'status' => 'success',
                'data' => $greenhouses
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch greenhouses', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch greenhouses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            Log::info('Fetching single greenhouse', ['id' => $id]);
            
            if (!Auth::check()) {
                Log::warning('Greenhouses show: Unauthenticated access.');
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthenticated.'
                ], 401);
            }

            $user = Auth::user();
            
            // Find greenhouse for the authenticated user and load systems relationship
            $greenhouse = $user->greenhouses()->with('systems')->findOrFail($id);
            
            Log::info('Greenhouse fetched successfully', ['id' => $greenhouse->id]);
            
            return response()->json([
                'status' => 'success',
                'data' => $greenhouse
            ]);
        } catch (\Exception $e) {
            Log::error('Greenhouse not found or failed to fetch', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Greenhouse not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'status' => 'required|string|in:active,inactive,maintenance',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $greenhouse = Greenhouse::create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Greenhouse created successfully',
                'data' => $greenhouse
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create greenhouse',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'location' => 'sometimes|required|string|max:255',
                'status' => 'sometimes|required|string|in:active,inactive,maintenance',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $greenhouse = Greenhouse::findOrFail($id);
            $greenhouse->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Greenhouse updated successfully',
                'data' => $greenhouse
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update greenhouse',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $greenhouse = Greenhouse::findOrFail($id);
            $greenhouse->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Greenhouse deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete greenhouse',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getMetrics($id)
    {
        try {
            Log::info('Fetching metrics for greenhouse', ['id' => $id]);
            
            if (!Auth::check()) {
                Log::warning('Metrics fetch: Unauthenticated access.');
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthenticated.'
                ], 401);
            }

            $user = Auth::user();
            
            // Find greenhouse for the authenticated user
            $greenhouse = $user->greenhouses()->findOrFail($id);
            
            // Get the latest sensor readings for this greenhouse
            $sensors = $greenhouse->sensors()->with('latestReading')->get();
            
            // Initialize metrics with default values
            $metrics = [
                'temperature' => 25,
                'humidity' => 60,
                'soil_moisture' => 75,
                'light_intensity' => 80,
            ];
            
            // Update metrics with actual sensor readings if available
            foreach ($sensors as $sensor) {
                if ($sensor->latestReading) {
                    switch ($sensor->type) {
                        case 'temperature':
                            $metrics['temperature'] = $sensor->latestReading->value;
                            break;
                        case 'humidity':
                            $metrics['humidity'] = $sensor->latestReading->value;
                            break;
                        case 'soil_moisture':
                            $metrics['soil_moisture'] = $sensor->latestReading->value;
                            break;
                        case 'light_intensity':
                            $metrics['light_intensity'] = $sensor->latestReading->value;
                            break;
                    }
                }
            }
            
            // Update greenhouse with latest metrics (optional, depending on your data model)
            // $greenhouse->update([
            //     'temperature' => $metrics['temperature'],
            //     'humidity' => $metrics['humidity'],
            //     'soil_moisture' => $metrics['soil_moisture'],
            //     'light_intensity' => $metrics['light_intensity'],
            // ]);
            
            Log::info('Metrics fetched successfully', ['id' => $id, 'metrics' => $metrics]);
            
            return response()->json([
                'status' => 'success',
                'data' => $metrics,
                'timestamp' => now()->toIso8601String()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch greenhouse metrics: ' . $e->getMessage(), ['id' => $id]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch greenhouse metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function controlSystem(Request $request, $id)
    {
        try {
            Log::info('Attempting system control', ['id' => $id, 'request' => $request->all()]);

            $validator = Validator::make($request->all(), [
                'system' => 'required|string|in:ventilation,irrigation,lighting',
                'action' => 'required|string|in:on,off,auto',
                'value' => 'nullable|numeric|min:0|max:100'
            ]);

            if ($validator->fails()) {
                Log::warning('System control validation failed', ['errors' => $validator->errors(), 'request' => $request->all()]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Find greenhouse for the authenticated user
            $user = auth()->user();
            
            if (!$user) {
                Log::warning('System control: No authenticated user');
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthenticated.'
                ], 401);
            }

            $greenhouse = $user->greenhouses()->findOrFail($id);
            
            // Get the system to control
            $system = $greenhouse->systems()->where('type', $request->system)->first();
            
            if (!$system) {
                Log::warning('System not found for greenhouse', ['greenhouse_id' => $id, 'system_type' => $request->system]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'System not found'
                ], 404);
            }

            // Update system status
            $system->update([
                'status' => $request->action,
                'value' => $request->value ?? $system->value,
                'last_updated' => now()
            ]);

            // Log the control action
            Log::info('Greenhouse system control successful', [
                'greenhouse_id' => $id,
                'system' => $request->system,
                'action' => $request->action,
                'value' => $request->value,
                'user_id' => $user->id
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'System control updated successfully',
                'data' => $system
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to control greenhouse system: ' . $e->getMessage(), ['id' => $id, 'request' => $request->all()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to control greenhouse system',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 