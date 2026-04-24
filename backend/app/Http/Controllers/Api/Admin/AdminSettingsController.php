<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\MembershipPlan;
use Illuminate\Http\Request;

class AdminSettingsController extends Controller
{
    // 1. Fetch everything for the Admin Panel
    public function index()
    {
        return response()->json([
            'settings' => Setting::pluck('value', 'key'),
            'plans' => MembershipPlan::all()
        ]);
    }

    // 2. Update the General Gym Info
    public function updateGeneral(Request $request)
    {
        $data = $request->validate([
            'gym_name' => 'nullable|string',
            'gym_email' => 'nullable|email',
            'gym_phone' => 'nullable|string',
            'gym_address' => 'nullable|string',
        ]);

        foreach ($data as $key => $value) {
            if ($value !== null) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }

        return response()->json(['message' => 'General settings updated successfully.']);
    }

    // 3. Update a specific Membership Tier
    public function updatePlan(Request $request, $id)
    {
        $plan = MembershipPlan::findOrFail($id);
        
        $validated = $request->validate([
            'price' => 'required|numeric',
            'duration_days' => 'required|integer',
            'is_active' => 'required|boolean',
            // If you added weekly_class_limit to your database earlier, uncomment this!
            // 'weekly_class_limit' => 'nullable|integer'
        ]);

        $plan->update($validated);

        return response()->json(['message' => $plan->name . ' updated successfully.']);
    }
}