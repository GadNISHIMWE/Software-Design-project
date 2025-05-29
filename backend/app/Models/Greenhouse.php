<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Greenhouse extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'size',
        'status',
        'user_id',
        'temperature',
        'humidity',
        'soil_moisture',
        'light_intensity'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plants()
    {
        return $this->hasMany(Plant::class);
    }

    public function sensors()
    {
        return $this->hasMany(Sensor::class);
    }

    public function systems()
    {
        return $this->hasMany(\App\Models\GreenhouseSystem::class);
    }
} 