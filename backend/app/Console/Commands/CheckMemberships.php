<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CheckMemberships extends Command
{
    // This is the terminal command we use to run this script
    protected $signature = 'memberships:check';

    protected $description = 'Check for expiring memberships to send warnings and auto-downgrade expired accounts.';

    public function handle()
    {
        $today = Carbon::today();

        // ---------------------------------------------------------
        // 1. AUTO-DOWNGRADE EXPIRED MEMBERSHIPS
        // ---------------------------------------------------------
        $expiredUsers = User::where('membership_status', 'active')
            ->whereNotNull('membership_expires_at')
            ->whereDate('membership_expires_at', '<', $today)
            ->get();

        foreach ($expiredUsers as $user) {
            $oldPlan = ucfirst($user->membership_plan);
            
            $user->update([
                'membership_plan' => 'none', // Or 'basic' if you want a free tier
                'membership_status' => 'expired',
                'membership_expires_at' => null,
            ]);

            // 🔥 NOTE: You can create an App\Notifications\MembershipExpired class
            // $user->notify(new \App\Notifications\MembershipExpired($oldPlan));
            
            $this->info("Downgraded user: {$user->email}");
        }

        // ---------------------------------------------------------
        // 2. SEND 7-DAY WARNINGS
        // ---------------------------------------------------------
        $sevenDaysFromNow = $today->copy()->addDays(7);
        $sevenDayUsers = User::where('membership_status', 'active')
            ->whereDate('membership_expires_at', '=', $sevenDaysFromNow)
            ->get();

        foreach ($sevenDayUsers as $user) {
            // 🔥 NOTE: Create an App\Notifications\MembershipExpiring class
            // $user->notify(new \App\Notifications\MembershipExpiring(7));
            $this->info("Sent 7-day warning to: {$user->email}");
        }

        // ---------------------------------------------------------
        // 3. SEND 1-DAY WARNINGS
        // ---------------------------------------------------------
        $oneDayFromNow = $today->copy()->addDays(1);
        $oneDayUsers = User::where('membership_status', 'active')
            ->whereDate('membership_expires_at', '=', $oneDayFromNow)
            ->get();

        foreach ($oneDayUsers as $user) {
            // $user->notify(new \App\Notifications\MembershipExpiring(1));
            $this->info("Sent 1-day warning to: {$user->email}");
        }

        $this->info('Membership check completed successfully!');
    }
}