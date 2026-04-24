<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class MembershipCancelled extends Notification
{
    use Queueable;

    protected $planName;

    public function __construct($planName)
    {
        $this->planName = $planName;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'payment', // Keeps the credit card icon
            'message' => "Your {$this->planName} Membership plan has been successfully cancelled."
        ];
    }
}