<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PaymentSuccessful extends Notification
{
    use Queueable;

    protected $plan;
    protected $amount;

    public function __construct($plan, $amount)
    {
        $this->plan = $plan;
        $this->amount = $amount;
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
            'type' => 'payment_success',
            'message' => "Payment successful! Your {$this->plan} membership (₱{$this->amount}) is now active."
        ];
    }
}