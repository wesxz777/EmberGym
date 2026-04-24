<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash; // 🔥 Required for checking and hashing passwords

class UserController extends Controller
{
    public function index()
    {
        return response()->json(DB::select('select * from users'));
    }

    // 🔥 ADDED: Handles the Edit Profile Tab
    public function update(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Your session expired. Please log in again.'], 401);
        }

        $validated = $request->validate([
            'firstName' => 'required|string|max:100',
            'lastName'  => 'required|string|max:100',
            'email'     => 'required|email|unique:users,email,' . $user->id,
            'phone'     => 'required|string|max:20',
        ]);

        // Map the React frontend camelCase to your Laravel snake_case database columns
        $user->first_name = $validated['firstName'];
        $user->last_name = $validated['lastName'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'];
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully.', 
            'user' => $user
        ]);
    }

    // 🔥 ADDED: Handles the Change Password Tab
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current' => 'required',
            'newPw' => 'required|min:8',
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Your session expired. Please log in again.'], 401);
        }

        // Check if current password matches
        if (!Hash::check($request->current, $user->password)) {
            return response()->json(['message' => 'The current password you entered is incorrect.'], 400);
        }

        // Hash and save the new password
        $user->password = Hash::make($request->newPw);
        $user->save();

        return response()->json(['message' => 'Password updated successfully.']);
    }
}