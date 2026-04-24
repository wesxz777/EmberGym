<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class BookingConfirmed extends Notification
{
    use Queueable;

    protected $className;
    protected $scheduleTime;

    public function __construct($className, $scheduleTime)
    {
        $this->className = $className;
        $this->scheduleTime = $scheduleTime;
    }

    // Tell Laravel to save this to the database, NOT email
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    // Format the data exactly how React expects it
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'booking_success',
            'message' => "You are booked! See you at {$this->className} at {$this->scheduleTime}."
        ];
    }
}