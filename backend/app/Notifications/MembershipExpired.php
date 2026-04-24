<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MembershipExpired extends Notification implements ShouldQueue
{
    use Queueable;

    protected string $planName;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $planName)
    {
        $this->planName = $planName;
    }

    /**
     * Get the notification's delivery channels.
     * We use 'mail' for emails, and 'database' for the React Notification Bell!
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
        return (new MailMessage)
            ->subject('Your Ember Gym Membership Has Expired')
            ->greeting('Hello ' . $notifiable->first_name . ',')
            ->line('Your ' . $this->planName . ' membership has officially expired.')
            ->line('We loved having you crush your goals with us. To keep your momentum going and regain access to the gym and classes, renew your membership today!')
            ->action('Renew Membership', url('/membership')) // Make sure this matches your React URL
            ->line('Keep the fire burning! 🔥');
    }

    /**
     * Get the array representation of the notification.
     * This is what gets sent to your React NotificationBell!
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'membership_expired',
            'title' => 'Membership Expired',
            'message' => "Your {$this->planName} membership has expired. Click here to renew!",
            'action_url' => '/membership'
        ];
    }
}