<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'price', 'duration_days', 'features', 'is_active'
    ];

    // Tells Laravel to automatically convert the JSON features back into a PHP array
    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean',
    ];
}