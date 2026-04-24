<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\MembershipPlan;
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
}