<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sensor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SensorController extends Controller
{
    public function index()
    {
        $sensors = Sensor::with('greenhouse')->get();
        return response()->json($sensors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:temperature,humidity,light,soil_moisture',
            'status' => 'required|in:active,inactive,maintenance',
            'greenhouse_id' => 'required|exists:greenhouses,id'
        ]);

        $sensor = Sensor::create($validated);
        return response()->json($sensor, 201);
    }

    public function show(Sensor $sensor)
    {
        return response()->json($sensor->load('greenhouse'));
    }

    public function update(Request $request, Sensor $sensor)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|in:temperature,humidity,light,soil_moisture',
            'status' => 'sometimes|required|in:active,inactive,maintenance',
            'greenhouse_id' => 'sometimes|required|exists:greenhouses,id'
        ]);

        $sensor->update($validated);
        return response()->json($sensor);
    }

    public function destroy(Sensor $sensor)
    {
        $sensor->delete();
        return response()->json(null, 204);
    }
} 