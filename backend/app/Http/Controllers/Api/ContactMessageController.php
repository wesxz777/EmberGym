<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    // 1. PUBLIC: Store a new message from the website
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);

        ContactMessage::create($validated);

        return response()->json(['message' => 'Your message has been sent successfully. Our team will contact you soon!'], 201);
    }

    // 2. ADMIN: Get all messages (sorted with unread first)
    public function index()
    {
        $messages = ContactMessage::orderByRaw("FIELD(status, 'unread', 'read', 'resolved')")
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }

    // 3. ADMIN: Mark a message as resolved
    public function markResolved($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->update(['status' => 'resolved']);

        return response()->json(['message' => 'Message marked as resolved.']);
    }
}