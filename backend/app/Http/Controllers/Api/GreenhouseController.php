<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Greenhouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GreenhouseController extends Controller
{
    public function index()
    {
        try {
            // Fetch greenhouses only for the authenticated user
            $greenhouses = auth()->user()->greenhouses;
            return response()->json([
                'status' => 'success',
                'data' => $greenhouses
            ]);
        } catch (\Exception $e) {
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
            // Find greenhouse for the authenticated user
            $greenhouse = auth()->user()->greenhouses()->findOrFail($id);
            return response()->json([
                'status' => 'success',
                'data' => $greenhouse
            ]);
        } catch (\Exception $e) {
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
            // Find greenhouse for the authenticated user
            $greenhouse = auth()->user()->greenhouses()->findOrFail($id);
            // In a real application, you would fetch this data from sensors
            $metrics = [
                'temperature' => $greenhouse->temperature ?? 25,
                'humidity' => $greenhouse->humidity ?? 60,
                'soil_moisture' => $greenhouse->soil_moisture ?? 75,
                'light_intensity' => $greenhouse->light_intensity ?? 80,
            ];
            return response()->json([
                'status' => 'success',
                'data' => $metrics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch greenhouse metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 