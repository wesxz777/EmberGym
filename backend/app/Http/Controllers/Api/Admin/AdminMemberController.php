<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminMemberController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        // Base Query: Fetch users based on the 'member' role
        $query = User::where('role', 'member');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $members = $query->latest()->paginate(10);

        // Safe Chart Data for the toggle (Week, Month, Year)
        $chartData = [
            'week' => [],
            'month' => [],
            'year' => []
        ];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $chartData['week'][] = [
                'name' => $date->format('D'),
                'joined' => User::where('role', 'member')->whereDate('created_at', $date)->count()
            ];
        }

        for ($i = 3; $i >= 0; $i--) {
            $start = Carbon::now()->startOfWeek()->subWeeks($i);
            $end = $start->copy()->endOfWeek();
            $chartData['month'][] = [
                'name' => 'Week ' . (4 - $i),
                'joined' => User::where('role', 'member')->whereBetween('created_at', [$start, $end])->count()
            ];
        }

        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->startOfMonth()->subMonths($i);
            $chartData['year'][] = [
                'name' => $date->format('M'),
                'joined' => User::where('role', 'member')->whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)->count()
            ];
        }

        // Return only what works
        return response()->json([
            'members' => $members,
            'chart_data' => $chartData
        ]);
    }

    public function show($id)
    {
        $member = User::where('role', 'member')->findOrFail($id);
        return response()->json($member);
    }

    public function update(Request $request, $id)
    {
        $member = User::where('role', 'member')->findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:100',
            'last_name'  => 'sometimes|string|max:100',
            'email'      => 'sometimes|email|unique:users,email,' . $id,
// 🔥 Add the regex rule to keep member phone numbers strictly +63 formatted!
            'phone' => ['sometimes', 'string', 'regex:/^\+63\d{10}$/', 'unique:users,phone,' . $id],
            'status'     => 'sometimes|in:active,suspended',
        ]);

        $member->update($validated);

        return response()->json($member);
    }

    public function destroy($id)
    {
        try {
            $member = User::where('role', 'member')->findOrFail($id);
            $member->delete();
            return response()->json(['message' => 'Member deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Backend Error: ' . $e->getMessage()], 500);
        }
    }
}