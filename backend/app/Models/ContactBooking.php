<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactBooking extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'class_type',
        'schedule_id', 
        'schedule_day',
        'schedule_time',
        'class_name',
        'room',
        'message',
        'user_id' // 🔥 MUST ADD THIS so logged-in users can be attached!
    ];

    // 🔥 MUST ADD THIS relationship so the Admin Panel can fetch the user!
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}