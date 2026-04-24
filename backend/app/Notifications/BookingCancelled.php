<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class BookingCancelled extends Notification
{
    use Queueable;

    protected $className;
    protected $scheduleTime;

    public function __construct($className, $scheduleTime)
    {
        $this->className = $className;
        $this->scheduleTime = $scheduleTime;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'booking', // Keeps the calendar icon
            'message' => "Your booking for {$this->className} at {$this->scheduleTime} has been cancelled."
        ];
    }
}