<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminStaffController extends Controller
{
    // 1. FETCH ALL TEAM MEMBERS (Supports our Tabs!)
    public function index(Request $request)
    {
        $search = $request->input('search');
        $roleFilter = $request->input('role'); 

        // Get everyone who works here
        $query = User::whereIn('role', ['super_admin', 'admin', 'trainer', 'staff', 'receptionist']);

        // Apply Search
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply Tab Filter (e.g., only show trainers)
        if ($roleFilter && $roleFilter !== 'all') {
            $query->where('role', $roleFilter);
        }

        $staff = $query->latest()->paginate(10);

        return response()->json(['staff' => $staff]);
    }

    // 2. CREATE NEW STAFF (Super Admin Only + Domain Enforcer)
    public function store(Request $request)
    {
        $currentUser = $request->user();

        // Security Check 1: Are they a Super Admin?
        if ($request->role === 'super_admin' && auth()->user()->role !== 'super_admin') {
        return response()->json([
            'message' => 'Unauthorized. Only Super Admins can create other Super Admins.'
        ], 403);
    }

        // 🔥 Make sure the "$validated =" part is exactly like this!
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'role'       => 'required|in:admin,trainer,staff,receptionist',
            'phone' => ['required', 'string', 'regex:/^\+63\d{10}$/'],
            'password'   => 'required|string|min:8|confirmed',
            'email'      => [
                'required',
                'email',
                'unique:users,email',
                function ($attribute, $value, $fail) {
                    if (!str_ends_with(strtolower($value), '@embergym.com')) {
                        $fail('All staff emails must end with @embergym.com');
                    }
                },
            ],
        ]);

        // Now Laravel knows what $validated is when creating the user!
        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'role'       => $validated['role'],
            'phone'      => $validated['phone'],
            'email'      => $validated['email'],
            'password'   => \Illuminate\Support\Facades\Hash::make($validated['password']),
        ]);

        return response()->json(['message' => 'Team member created successfully.', 'staff' => $user]);
    }

    // 3. REMOVE STAFF (Hierarchical Security)
    public function destroy(Request $request, $id)
    {
        $currentUser = $request->user();
        $targetUser = User::findOrFail($id);

        // Security Check 1: Only Admins and Super Admins can fire people
        if (!in_array($currentUser->role, ['super_admin', 'admin'])) {
            return response()->json(['message' => 'Unauthorized to remove staff.'], 403);
        }

        // Security Check 2: The Boss Rule (Admins cannot delete Super Admins)
        if ($targetUser->role === 'super_admin' && auth()->user()->role !== 'super_admin') {
        return response()->json([
            'message' => 'Unauthorized. You do not have permission to delete a Super Admin.'
        ], 403);
    }

        // Security Check 3: Prevent deleting yourself
        if ($currentUser->id === $targetUser->id) {
            return response()->json(['message' => 'You cannot remove your own account while logged in.'], 400);
        }

        // Optional: If Trainers have bookings, delete them first to prevent DB errors
        \App\Models\ContactBooking::where('user_id', $id)->delete(); 
        $targetUser->contactBookings()->delete();
        $targetUser->delete();

        return response()->json(['message' => 'Team member removed successfully.']);
    }

    

    // 4. EDIT STAFF (Hierarchical Security)
    public function update(Request $request, $id)
    {
        $currentUser = $request->user();
        $targetUser = User::findOrFail($id);

        // Security Check 1: Only Admins and Super Admins can edit
        if (!in_array($currentUser->role, ['super_admin', 'admin'])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Security Check 2: The Boss Rule (Admins cannot edit Super Admins)
        if ($currentUser->role === 'admin' && $targetUser->role === 'super_admin') {
            return response()->json(['message' => 'Access Denied: You cannot edit a Super Admin.'], 403);
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'role'       => 'required|in:admin,trainer,staff,receptionist',
            // Ignore the current user's ID for uniqueness checks so they can keep their own email/phone!
            'phone' => ['required', 'string', 'regex:/^\+63\d{10}$/', 'unique:users' . ($id ? ",phone,$id" : '')],
            'email'      => [
                'required',
                'email',
                'unique:users,email,' . $id,
                function ($attribute, $value, $fail) {
                    if (!str_ends_with(strtolower($value), '@embergym.com')) {
                        $fail('All staff emails must end with @embergym.com');
                    }
                },
            ],
        ]);

        $targetUser->update($validated);

        return response()->json(['message' => 'Staff member updated successfully.']);
    }

    
}