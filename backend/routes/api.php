<?php
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

// Auth & public
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactBookingController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\GalleryController;

// Admin
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminMemberController;
use App\Http\Controllers\Api\Admin\AdminTrainerController;
use App\Http\Controllers\Api\Admin\AdminStaffController;
use App\Http\Controllers\Api\Admin\AdminBookingController;
use App\Http\Controllers\Api\Admin\AdminSettingController;
use App\Http\Controllers\Api\Admin\AdminLogController;
use App\Http\Controllers\Api\PublicController;

// ─── Public routes (Guests can access these) ──────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::get('/check-email', [AuthController::class, 'checkEmail']);
Route::get('/check-phone', [AuthController::class, 'checkPhone']);
Route::post('/chatbot', [ChatbotController::class, 'chat']);
// --- PUBLIC ROUTES ---
Route::post('/contact', [\App\Http\Controllers\Api\ContactMessageController::class, 'store']);

// The Public Booking Route!
Route::post('/contact-bookings', [ContactBookingController::class, 'store']); 

// ─── Authenticated user (Must be logged in) ───────────────────────────────────
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Consolidated Secure Routes
Route::middleware('auth:sanctum')->group(function () {
    // User Profile
    Route::put('/user/update', [\App\Http\Controllers\Api\UserController::class, 'update']);
    Route::put('/user/password', [\App\Http\Controllers\Api\UserController::class, 'updatePassword']);

    // Bookings (Users can view their own and delete them, but creating is public above)
    Route::delete('/contact-bookings/{id}', [ContactBookingController::class, 'destroy']);
    Route::get('/my-bookings', [ContactBookingController::class, 'myBookings']);
    
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/mark-read', [NotificationController::class, 'markAllAsRead']);
    
});

// Secure Payment Routes
Route::middleware('auth:sanctum')->prefix('payments')->group(function () {
    Route::post('checkout', [PaymentController::class, 'checkout']);
    Route::post('cancel', [PaymentController::class, 'cancelPlan']);
    Route::get('status/{id}', [PaymentController::class, 'getPaymentStatus']);
    Route::get('history', [PaymentController::class, 'getPaymentHistory']);
    Route::get('{id}/receipt', [PaymentController::class, 'downloadReceipt']);
});

// ─── Admin routes ─────────────────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);
    
    Route::get('dashboard', [AdminDashboardController::class, 'index']);

    Route::apiResource('members',  AdminMemberController::class)->except(['store']);
    
    Route::get('staff', [AdminStaffController::class, 'index']);
    Route::post('staff', [AdminStaffController::class, 'store']);
    Route::delete('staff/{id}', [AdminStaffController::class, 'destroy']);
    Route::put('staff/{id}', [AdminStaffController::class, 'update']);
    
    Route::apiResource('bookings', AdminBookingController::class)->except(['store']);

    Route::get('settings',          [AdminSettingController::class, 'index']);
    Route::put('settings/{key}',    [AdminSettingController::class, 'update']);

    Route::get('logs', [AdminLogController::class, 'index']);

    // --- BOOKING HUB ROUTES ---
    // This MUST be above the apiResource, otherwise Laravel gets confused!
    Route::get('bookings/analytics/{id}', [App\Http\Controllers\Api\Admin\AdminBookingController::class, 'getTemplateAnalytics']);
    Route::apiResource('bookings', App\Http\Controllers\Api\Admin\AdminBookingController::class);

    
       // 🔥 MAKE SURE THIS EXACT LINE IS HERE:
    Route::put('settings/plans/{id}', [AdminSettingController::class, 'updatePlan']);

    // --- CONTACT MESSAGES ---
    Route::get('concerns', [\App\Http\Controllers\Api\ContactMessageController::class, 'index']);
    Route::patch('concerns/{id}/resolve', [\App\Http\Controllers\Api\ContactMessageController::class, 'markResolved']);

});

    
 

    Route::get('/public/gym-info', [PublicController::class, 'getGymData']);

    
Route::get('/force-migrate', function () {
    try {
        Artisan::call('migrate', ['--force' => true]);
        return response()->json(['message' => 'Database updated successfully!']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()]);
    }
});

Route::get('/magic-clear', function () {
    \Illuminate\Support\Facades\Artisan::call('optimize:clear');
    return response()->json(['message' => 'Render cache completely destroyed!']);
});

Route::get('/god-mode', function () {
    // 1. Find your specific account
    $user = \App\Models\User::where('email', 'wesleycaya39@embergym.com')->first();
    
    if ($user) {
        // 2. Grant Super Admin powers
        $user->role = 'super_admin';
        $user->save();
        return response()->json(['message' => 'God Mode activated for ' . $user->email . '!']);
    }
    
    return response()->json(['error' => 'User not found! Check the email address.'], 404);
});