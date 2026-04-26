<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GymClass extends Model
{
    use HasFactory;

    // 🔥 FIXED: Everything is safely inside the brackets now!
    protected $fillable = [
        'name', 
        'trainer_id', 
        'class_date', 
        'start_time', 
        'end_time', 
        'max_capacity',
        'class_template_id', 
        'room'
    ];

    public function trainer()
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    public function bookings()
    {
        return $this->hasMany(ContactBooking::class, 'gym_class_id');
    }

    public function template()
    {
        return $this->belongsTo(ClassTemplate::class, 'class_template_id');
    }
}