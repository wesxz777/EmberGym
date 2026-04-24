<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MembershipPlan;

class MembershipPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. The Basic Monthly Plan
        MembershipPlan::create([
            'name' => 'Monthly Basic',
            'price' => 1000.00,
            'duration_days' => 30,
            'features' => ['Gym Access (6 AM - 10 PM)', 'Locker Room Access', 'Free Wi-Fi'],
            'is_active' => true,
        ]);

        // 2. The Premium VIP Plan
        MembershipPlan::create([
            'name' => 'Monthly VIP',
            'price' => 2500.00,
            'duration_days' => 30,
            'features' => ['24/7 Gym Access', 'All Group Classes Included', 'Sauna & Spa Access', 'Free Towel Service'],
            'is_active' => true,
        ]);

        // 3. The Annual Discount Plan
        MembershipPlan::create([
            'name' => 'Annual Elite',
            'price' => 15000.00,
            'duration_days' => 365,
            'features' => ['All VIP Perks', 'Save ₱15,000 yearly', '1 Free Personal Training Session', 'Bring a Friend (Weekends)'],
            'is_active' => true,
        ]);
    }
}