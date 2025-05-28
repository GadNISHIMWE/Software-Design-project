<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PlantController extends Controller
{
    public function index()
    {
        $plants = Plant::with('greenhouse')->get();
        return response()->json($plants);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'species' => 'required|string|max:255',
            'planting_date' => 'required|date',
            'harvest_date' => 'nullable|date|after:planting_date',
            'status' => 'required|in:growing,harvested,failed',
            'greenhouse_id' => 'required|exists:greenhouses,id'
        ]);

        $plant = Plant::create($validated);
        return response()->json($plant, 201);
    }

    public function show(Plant $plant)
    {
        return response()->json($plant->load('greenhouse'));
    }

    public function update(Request $request, Plant $plant)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'species' => 'sometimes|required|string|max:255',
            'planting_date' => 'sometimes|required|date',
            'harvest_date' => 'nullable|date|after:planting_date',
            'status' => 'sometimes|required|in:growing,harvested,failed',
            'greenhouse_id' => 'sometimes|required|exists:greenhouses,id'
        ]);

        $plant->update($validated);
        return response()->json($plant);
    }

    public function destroy(Plant $plant)
    {
        $plant->delete();
        return response()->json(null, 204);
    }
} 