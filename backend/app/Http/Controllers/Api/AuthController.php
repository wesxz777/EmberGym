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
}