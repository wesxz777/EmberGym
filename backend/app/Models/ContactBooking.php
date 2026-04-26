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
    'gym_class_id', // 🔥 MUST BE HERE!
    'schedule_day',
    'schedule_time',
    'class_name',
    'room',
    'message',
];
}
