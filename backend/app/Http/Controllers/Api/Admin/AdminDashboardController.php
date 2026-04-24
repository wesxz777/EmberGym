<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ContactBooking;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // 1. Get Quick Stats
        // I kept your specific User::where('role', 'member') check here because it's more accurate!
        $totalMembers = User::where('role', 'member')->count();
        $totalBookings = ContactBooking::count();
        $bookingsToday = ContactBooking::whereDate('created_at', Carbon::today())->count();
        
        $recentBookings = ContactBooking::orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // 2. Generate Dynamic Chart Data
        $chartData = [
            'week' => [],
            'month' => [],
            'year' => []
        ];

        // Last 7 Days (Week)
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $chartData['week'][] = [
                'name' => $date->format('D'), // Mon, Tue, Wed
                'bookings' => ContactBooking::whereDate('created_at', $date->toDateString())->count()
            ];
        }

        // This Month (Divided into 4 Weeks)
        $startOfMonth = Carbon::now()->startOfMonth();
        for ($i = 0; $i < 4; $i++) {
            $startWeek = $startOfMonth->copy()->addDays($i * 7);
            $endWeek = $startWeek->copy()->addDays(6);
            if ($i === 3) $endWeek = Carbon::now()->endOfMonth(); // Catch remaining days in week 4
            
            $chartData['month'][] = [
                'name' => 'Week ' . ($i + 1),
                'bookings' => ContactBooking::whereBetween('created_at', [$startWeek->startOfDay(), $endWeek->endOfDay()])->count()
            ];
        }

        // This Year (12 Months)
        for ($i = 1; $i <= 12; $i++) {
            $date = Carbon::create(null, $i, 1);
            $chartData['year'][] = [
                'name' => $date->format('M'), // Jan, Feb, Mar
                'bookings' => ContactBooking::whereYear('created_at', Carbon::now()->year)
                                            ->whereMonth('created_at', $i)
                                            ->count()
            ];
        }

        // 3. Return EVERYTHING to React
        return response()->json([
            'total_members'   => $totalMembers,
            'total_bookings'  => $totalBookings,
            'bookings_today'  => $bookingsToday,
            'recent_bookings' => $recentBookings,
            'chart_data'      => $chartData, // This will now successfully reach React!
        ]);
    }
}