<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\MembershipPlan;
use App\Models\GymClass; // 🔥 MUST ADD THIS IMPORT!
use Illuminate\Http\Request;

class PublicController extends Controller
{
    /**
     * Fetch all public gym data required for the frontend landing pages.
     */
    public function getGymData()
    {
        // 1. Get all global settings (Name, Email, Phone, Address)
        $settings = Setting::pluck('value', 'key');
        
        // 2. Get ONLY the active membership plans
        $activePlans = MembershipPlan::where('is_active', true)
                                     ->orderBy('price', 'asc') // Sorts from cheapest to most expensive
                                     ->get();

        return response()->json([
            'settings' => $settings,
            'plans' => $activePlans
        ]);
    }

    /**
     * 🔥 NEW: Fetch the live schedule for the public frontend!
     */
    public function getSchedule()
    {
        // Fetch upcoming classes, including the template details, trainer names, and current booking counts!
        $schedules = GymClass::with(['template', 'trainer:id,first_name,last_name'])
            ->withCount('bookings')
            ->where('class_date', '>=', now()->toDateString()) // Only show today and future classes
            ->orderBy('class_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();

        return response()->json($schedules);
    }
}