<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'type', 'duration', 'intensity', 'description', 'image', 'benefits', 'allowed_plans'
    ];

    // Automatically convert the JSON arrays back to PHP arrays
    protected $casts = [
        'benefits' => 'array',
        'allowed_plans' => 'array',
    ];
}