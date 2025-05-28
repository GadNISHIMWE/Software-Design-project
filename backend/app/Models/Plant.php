<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'species',
        'planting_date',
        'harvest_date',
        'status',
        'greenhouse_id'
    ];

    protected $casts = [
        'planting_date' => 'datetime',
        'harvest_date' => 'datetime'
    ];

    public function greenhouse()
    {
        return $this->belongsTo(Greenhouse::class);
    }
} 