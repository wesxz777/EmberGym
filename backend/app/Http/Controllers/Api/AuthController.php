<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request) 
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users', 
            'phone' => 'required|string|unique:users',             
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['message' => 'User created successfully'], 201);
    }

    public function login(Request $request)
    {
        // 1. Check that they actually sent an email and password
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Look for the user in the database
        $user = User::where('email', $request->email)->first();

        // 3. If the user doesn't exist, OR the password doesn't match the scrambled one
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.'
            ], 401); // 401 means "Unauthorized"
        }

        // 4. Success! Generate the VIP Badge (Sanctum Token)
        $token = $user->createToken('ember_gym_token')->plainTextToken;

        // 5. Send the badge and user data back to React
        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function checkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $exists = User::where('email', $request->email)->exists();

        return response()->json([
            'available' => !$exists,
            'message' => $exists ? 'Email already in use' : 'Email is available'
        ], 200);
    }

    public function checkPhone(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $exists = User::where('phone', $request->phone)->exists();

        return response()->json([
            'available' => !$exists,
            'message' => $exists ? 'Phone number already in use' : 'Phone number is available'
        ], 200);
    }

    public function updateProfile(Request $request)
{
    $user = $request->user();
    
    $validated = $request->validate([
        'firstName' => 'required|string|max:255',
        'lastName'  => 'required|string|max:255',
        'email'     => 'required|email|unique:users,email,' . $user->id,
        'phone'     => 'nullable|string|max:50',
    ]);

    $user->update([
        'first_name' => $validated['firstName'],
        'last_name'  => $validated['lastName'],
        'email'      => $validated['email'],
        'phone'      => $validated['phone'],
    ]);

    return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
}

    public function updatePassword(Request $request)
{
    $request->validate([
        'current' => 'required',
        'newPw'   => 'required|min:8',
    ]);

    $user = $request->user();

    // Check if the current password is correct
    if (!Hash::check($request->current, $user->password)) {
        return response()->json(['message' => 'Current password does not match.'], 422);
    }

    // Update to new password
    $user->update([
        'password' => Hash::make($request->newPw),
    ]);

    return response()->json(['message' => 'Password updated successfully.']);
}
}