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
            'gym_class_id'  => 'required|integer', // 🔥 UPDATED: Matches the frontend and database!
            'schedule_day'  => 'required|string|max:20',
            'schedule_time' => 'required|string|max:10',
            'class_name'    => 'required|string|max:255',
            'room'          => 'nullable|string|max:100',
            'message'       => 'nullable|string|max:2000',
        ]);

        // Create the booking
        $booking = ContactBooking::create($validated);

        // Since this is a public route, $request->user() is null. 
        // We proactively check Sanctum, or fallback to checking if the email belongs to a user.
        $user = auth('sanctum')->user() ?? User::where('email', $validated['email'])->first();
        
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