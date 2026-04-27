<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactBooking;
use App\Models\User; // <-- Added User model import
use Illuminate\Http\Request;
use App\Notifications\BookingConfirmed;
use App\Notifications\BookingCancelled;

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

        // 🔥 CRITICAL FIX: Find the user FIRST
        $user = auth('sanctum')->user() ?? User::where('email', $validated['email'])->first();
        
        // 🔥 CRITICAL FIX: If a user exists, attach their ID to the data BEFORE saving
        if ($user) {
            $validated['user_id'] = $user->id;
        }

        // Create the booking with the user_id included
        $booking = ContactBooking::create($validated);
        
        // --- TRIGGER NOTIFICATION ---
        if ($user) {
            $user->notify(new BookingConfirmed($booking->class_name, $booking->schedule_time));
        }

        return response()->json(['message' => 'Booking successful']);
    }

    public function index()
    {
        return response()->json(ContactBooking::latest()->get());
    }

    public function destroy(Request $request, $id)
    {
        // For destroying, we are inside the auth:sanctum middleware, so this works fine!
        $user = $request->user();
        
        // Find the booking
        $booking = ContactBooking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        // --- TRIGGER NOTIFICATION BEFORE DELETING ---
        if ($user) {
            $user->notify(new BookingCancelled($booking->class_name, $booking->schedule_time));
        }

        // Delete the booking
        $booking->delete();

        return response()->json(['message' => 'Booking cancelled successfully']);
    }

    public function myBookings(Request $request)
    {
        $user = $request->user();
        
        // Fetch bookings that match the logged-in user's email
        $bookings = ContactBooking::where('email', $user->email)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }
}