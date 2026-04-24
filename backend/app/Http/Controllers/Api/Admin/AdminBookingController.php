<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\GymClass;
use App\Models\ClassTemplate;
use App\Models\ContactBooking;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    // 1. Fetch the Menu & Master Timetable
    public function index()
    {
        // Get the catalogue (Power Yoga, HIIT, etc.)
        $templates = ClassTemplate::all();

        // Get the actual scheduled instances, attaching the template and trainer data!
        $scheduled_classes = GymClass::with(['template', 'trainer:id,first_name,last_name'])
            ->withCount('bookings')
            ->orderBy('class_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();

        return response()->json([
            'templates' => $templates,
            'scheduled_classes' => $scheduled_classes
        ]);
    }

    // 2. Schedule a New Class (Using the Template Menu)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_template_id' => 'required|exists:class_templates,id',
            'trainer_id'        => 'required|exists:users,id',
            'room'              => 'required|string|max:100', // e.g., Studio A
            'class_date'        => 'required|date',
            'start_time'        => 'required',
            'end_time'          => 'required|after:start_time',
            'max_capacity'      => 'required|integer|min:1'
        ]);

        $gymClass = GymClass::create($validated);

        return response()->json(['message' => 'Class scheduled successfully!', 'class' => $gymClass]);
    }

    // 3. View Specific Timetable & Attendee Roster
    public function show($id)
    {
        $gymClass = GymClass::with(['template', 'trainer', 'bookings.user'])->findOrFail($id);
        return response()->json(['gym_class' => $gymClass]);
    }

    // 4. THE ANALYTICS HUB: Get data for a specific Class Type (e.g., just "Power Yoga")
    public function getTemplateAnalytics($id)
    {
        $template = ClassTemplate::findOrFail($id);

        // Fetch all scheduled times for this specific class
        $schedules = GymClass::where('class_template_id', $id)
            ->with('trainer:id,first_name,last_name')
            ->withCount('bookings')
            ->orderBy('class_date', 'desc') // Show most recent first
            ->get();

        // --- THE MATH: Calculate Attendance Trends ---
        $sevenDaysAgo = now()->subDays(7);
        $thirtyDaysAgo = now()->subDays(30);
        $oneYearAgo = now()->subYear();

        $stats = [
            'last_7_days' => $schedules->where('class_date', '>=', $sevenDaysAgo)->sum('bookings_count'),
            'last_30_days' => $schedules->where('class_date', '>=', $thirtyDaysAgo)->sum('bookings_count'),
            'last_365_days' => $schedules->where('class_date', '>=', $oneYearAgo)->sum('bookings_count'),
        ];

        return response()->json([
            'template' => $template,
            'schedules' => $schedules,
            'analytics' => $stats
        ]);
    }

    // 5. Cancel a Scheduled Class
    public function destroy($id)
    {
        $gymClass = GymClass::findOrFail($id);
        ContactBooking::where('gym_class_id', $id)->delete(); 
        $gymClass->delete();

        return response()->json(['message' => 'Class cancelled successfully.']);
    }
}