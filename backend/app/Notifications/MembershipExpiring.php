<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MembershipExpiring extends Notification implements ShouldQueue
{
    use Queueable;

    protected int $daysLeft;

    /**
     * The robot passes the number of days (7 or 1) into this constructor.
     */
    public function __construct(int $daysLeft)
    {
        $this->daysLeft = $daysLeft;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Fix the grammar (1 day vs 7 days)
        $dayText = $this->daysLeft === 1 ? '1 day' : $this->daysLeft . ' days';

        return (new MailMessage)
            ->subject('Action Required: Your Membership is Expiring Soon! ⏰')
            ->greeting('Hello ' . $notifiable->first_name . ',')
            ->line('Just a quick heads up! Your Ember Gym membership will expire in exactly **' . $dayText . '**.')
            ->line('Don\'t lose your momentum! Renew your membership now to ensure uninterrupted access to the gym, classes, and your workout history.')
            ->action('Renew Now', url('/membership'))
            ->line('See you at the gym! 💪');
    }

    /**
     * Get the array representation of the notification.
     * This lights up the React Notification Bell!
     */
    public function toArray(object $notifiable): array
    {
        $dayText = $this->daysLeft === 1 ? '1 day' : $this->daysLeft . ' days';
        
        return [
            'type' => 'membership_warning',
            'title' => 'Expiring Soon! ⏰',
            'message' => "Your membership expires in {$dayText}. Renew now to avoid losing access!",
            'action_url' => '/membership'
        ];
    }
}