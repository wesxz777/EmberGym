<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // 🔥 ADD THIS LINE
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // 🔥 ADD HasFactory HERE   
    protected $table = 'users';

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'role',
        'membership_plan',
        'membership_expires_at',
        'membership_status',
        'membership',     // Keep one
        'has_purchased_before'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'membership_expires_at' => 'datetime',
        'email_verified_at' => 'datetime',
    ];

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}