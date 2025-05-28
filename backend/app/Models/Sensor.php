<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'status',
        'last_reading',
        'greenhouse_id'
    ];

    protected $casts = [
        'last_reading' => 'datetime'
    ];

    public function greenhouse()
    {
        return $this->belongsTo(Greenhouse::class);
    }
} 