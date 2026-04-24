<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GymClass extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'trainer_id', 'class_date', 'start_time', 'end_time', 'max_capacity'
    ];

    // A class belongs to a specific trainer (from your users table)
    public function trainer()
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    // Optional: If your ContactBooking model handles the reservations, we link it here!
    public function bookings()
    {
        return $this->hasMany(ContactBooking::class, 'gym_class_id');
    }
    // Add this to your $fillable array:
    // 'class_template_id', 'room'

    // Add this new relationship method:
    public function template()
    {
        return $this->belongsTo(ClassTemplate::class, 'class_template_id');
    }


    
}