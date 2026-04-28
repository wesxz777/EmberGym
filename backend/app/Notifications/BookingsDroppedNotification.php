<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class BookingsDroppedNotification extends Notification
{
    use Queueable;

    protected $cancelledCount;

    /**
     * Create a new notification instance.
     */
    public function __construct($cancelledCount)
    {
        $this->cancelledCount = $cancelledCount;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable)
    {
        return ['database']; // Saves to the notifications table so React can fetch it
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable)
    {
        $word = $this->cancelledCount === 1 ? 'class' : 'classes';
        
        return [
            // Using "booking" in the type so your React frontend gives it the Calendar icon!
            'type' => 'booking_cancelled', 
            'message' => "Due to your membership cancellation, your {$this->cancelledCount} upcoming booked {$word} have also been cancelled."
        ];
    }
}