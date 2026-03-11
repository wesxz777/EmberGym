<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactBooking;
use Illuminate\Http\Request;

class ContactBookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|max:255',
            'phone'         => 'required|string|max:50',
            'class_type'    => 'required|string|max:100',
            'schedule_id'   => 'required|integer',
            'schedule_day'  => 'required|string|max:20',
            'schedule_time' => 'required|string|max:10',
            'class_name'    => 'required|string|max:255',
            'room'          => 'nullable|string|max:100',
            'message'       => 'nullable|string|max:2000',
        ]);

        $booking = ContactBooking::create($validated);

        return response()->json([
            'message' => 'Booking created successfully',
            'booking' => $booking,
        ], 201);
    }

    public function index()
    {
        return response()->json(ContactBooking::latest()->get());
    }
}
