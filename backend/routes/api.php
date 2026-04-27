<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

// --- Controllers ---
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactBookingController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\NotificationController;

// Admin Controllers
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminMemberController;
use App\Http\Controllers\Api\Admin\AdminStaffController;
use App\Http\Controllers\Api\Admin\AdminBookingController;
use App\Http\Controllers\Api\Admin\AdminSettingController;
use App\Http\Controllers\Api\Admin\AdminLogController;

/* -------------------------------------------------------------------------- */
/* 1. PUBLIC ROUTES (No Login Required)                                       */
/* -------------------------------------------------------------------------- */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/check-email', [AuthController::class, 'checkEmail']);
Route::get('/check-phone', [AuthController::class, 'checkPhone']);
Route::post('/chatbot', [ChatbotController::class, 'chat']);
Route::post('/contact', [ContactMessageController::class, 'store']);
Route::post('/contact-bookings', [ContactBookingController::class, 'store']);
Route::get('/public/gym-info', [PublicController::class, 'getGymData']);
Route::get('/public/schedule', [PublicController::class, 'getSchedule']); // Moved here for clarity

/* -------------------------------------------------------------------------- */
/* 2. AUTHENTICATED USER ROUTES (Requires Login)                              */
/* -------------------------------------------------------------------------- */
Route::middleware('auth:sanctum')->group(function () {
    // Current User
    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/user/update', [UserController::class, 'update']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);

    // User Bookings & Notifications
    Route::delete('/contact-bookings/{id}', [ContactBookingController::class, 'destroy']);
    Route::get('/my-bookings', [ContactBookingController::class, 'myBookings']);
    Route::get('/notifications', [NotificationController::class, 'index']);

    // Payments
    Route::prefix('payments')->group(function () {
        Route::post('checkout', [PaymentController::class, 'checkout']);
        Route::post('cancel', [PaymentController::class, 'cancelPlan']);
        Route::get('status/{id}', [PaymentController::class, 'getPaymentStatus']);
        Route::get('history', [PaymentController::class, 'getPaymentHistory']);
        Route::get('{id}/receipt', [PaymentController::class, 'downloadReceipt']);
    });
});

/* -------------------------------------------------------------------------- */
/* 3. ADMIN ROUTES (Requires Login + Admin Role)                              */
/* -------------------------------------------------------------------------- */
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    
    Route::get('dashboard', [AdminDashboardController::class, 'index']);
    
    // Members
    Route::apiResource('members', AdminMemberController::class)->except(['store']);
    
    // Staff
    Route::apiResource('staff', AdminStaffController::class);
    
    // Bookings
    Route::apiResource('bookings', AdminBookingController::class)->except(['store']);
    Route::get('bookings/analytics/{id}', [AdminBookingController::class, 'getTemplateAnalytics']);
    
    // Settings & Logs
    Route::get('settings', [AdminSettingController::class, 'index']);
    Route::put('settings/{key}', [AdminSettingController::class, 'update']);
    Route::put('settings/plans/{id}', [AdminSettingController::class, 'updatePlan']);
    Route::get('logs', [AdminLogController::class, 'index']);

    // Concerns (Contact Messages)
    Route::get('concerns', [ContactMessageController::class, 'index']);
    Route::patch('concerns/{id}/resolve', [ContactMessageController::class, 'markResolved']);
});

/* -------------------------------------------------------------------------- */
/* 4. MAINTENANCE (Run once after pushing to Postgres)                        */
/* -------------------------------------------------------------------------- */
Route::get('/force-migrate', function () {
    try {
        Artisan::call('migrate', ['--force' => true]);
        return response()->json(['message' => 'Database tables migrated successfully!']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Only use this once to setup your tables
Route::get('/debug/migrate', function() {
    \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    return response()->json(['message' => 'Migrations ran successfully!']);
});

Route::get('/debug/peek-users', function () {
    return response()->json([
        'total_users' => \App\Models\User::count(),
        'all_user_data' => \App\Models\User::all(['id', 'email', 'role', 'membership_plan'])
    ]);
});

Route::get('/debug/fix-columns', function () {
    try {
        \Illuminate\Support\Facades\Schema::table('users', function ($table) {
            // Check and add 'membership' if missing
            if (!\Illuminate\Support\Facades\Schema::hasColumn('users', 'membership')) {
                $table->string('membership')->nullable();
            }
            // Check and add 'has_purchased_before' if missing
            if (!\Illuminate\Support\Facades\Schema::hasColumn('users', 'has_purchased_before')) {
                $table->boolean('has_purchased_before')->default(false);
            }
            // Check and add 'role' if missing
            if (!\Illuminate\Support\Facades\Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('user');
            }
        });
        return response()->json(['message' => 'Database columns added successfully!']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});


Route::get('/debug/nuke-role-constraint', function () {
    try {
        // This command tells PostgreSQL to destroy the gatekeeper blocking the 'member' role
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check');
        
        return response()->json([
            'status' => 'SUCCESS! The role gatekeeper has been destroyed. You can now save members!'
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to drop constraint: ' . $e->getMessage()]);
    }
});

Route::get('/debug/seed-catalogue', function () {
    try {
        // This forces Laravel to run your class templates seeder in production
        \Illuminate\Support\Facades\Artisan::call('db:seed', [
            '--class' => 'ClassTemplateSeeder', // Adjust this name if your seeder is named differently (e.g., 'FixedGymSeeder')
            '--force' => true 
        ]);
        
        return response()->json([
            'status' => 'SUCCESS! The Class Catalogue has been fully stocked.'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'FAILED',
            'error' => $e->getMessage()
        ]);
    }
});

Route::get('/debug/seed-schedules', function () {
    try {
        // Run the main DatabaseSeeder (which should run your Class schedules seeder)
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
        
        return response()->json([
            'status' => 'SUCCESS! The entire database has been seeded with test classes.'
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()]);
    }
});

Route::get('/debug/xray', function () {
    $status = "Running checks...";
    
    // 1. Proactively try to fix the missing column!
    try {
        \Illuminate\Support\Facades\Schema::table('contact_bookings', function ($table) {
            if (!\Illuminate\Support\Facades\Schema::hasColumn('contact_bookings', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable();
            }
        });
        $status = "SUCCESS: The user_id column has been added to contact_bookings!";
    } catch (\Exception $e) {
        $status = "DB Check Failed (See logs below)";
    }

    // 2. Fetch the last 40 lines of the Laravel crash log
    $logFile = storage_path('logs/laravel.log');
    $logs = file_exists($logFile) ? array_slice(file($logFile), -40) : ['No crash logs found yet.'];

    return response()->json([
        'status' => $status,
        'crash_logs' => $logs
    ]);
});

// Make sure this route exists and points to 'getSchedule'
Route::get('/public/schedule', [App\Http\Controllers\Api\PublicController::class, 'getSchedule']);

Route::get('/debug/make-super-admin', function () {
    try {
        // Use updateOrCreate so if you accidentally refresh the page, it updates instead of crashing
        $admin = \App\Models\User::updateOrCreate(
            ['email' => 'wesley@embergym.com'], // The target email
            [
                'first_name' => 'Wesley',
                'last_name' => 'Caya', // Using the name from your earlier checkout test!
                'password' => bcrypt('akongapalasiWesley@1'), // Safely encrypts the password
                'role' => 'super_admin',
                'phone' => '09123456789', // Placeholder phone
                'membership_plan' => 'Elite',
                'membership_status' => 'active',
                'membership' => 'Elite'
            ]
        );
        
        return response()->json([
            'status' => 'SUCCESS! The Super Admin has been created.',
            'admin' => [
                'email' => $admin->email,
                'role' => $admin->role
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()]);
    }
});

Route::get('/debug/check-bookings', function () {
    // Grab the absolute newest booking from the database
    $lastBooking = \App\Models\ContactBooking::orderBy('id', 'desc')->first();
    
    if (!$lastBooking) {
        return response()->json(['status' => 'Ghost Town: No bookings exist in the database at all.']);
    }

    // Try to find the Gym Class that matches the schedule_id saved in the booking
    $matchingClass = \App\Models\GymClass::find($lastBooking->schedule_id);

    return response()->json([
        '1_status' => 'Booking found!',
        '2_latest_booking_data' => $lastBooking,
        '3_target_schedule_id' => $lastBooking->schedule_id,
        '4_did_it_match_a_class' => $matchingClass ? 'YES! The bridge is connected.' : 'NO! The ID does not match any class.',
        '5_class_details' => $matchingClass
    ]);
});