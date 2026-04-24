<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AdminLogController extends Controller
{
    public function index()
    {
        $logs = DB::table('admin_logs')
            ->join('users', 'admin_logs.admin_user_id', '=', 'users.id')
            ->select(
                'admin_logs.*',
                'users.first_name',
                'users.last_name',
                'users.email'
            )
            ->orderByDesc('admin_logs.created_at')
            ->paginate(50);

        return response()->json($logs);
    }
}
