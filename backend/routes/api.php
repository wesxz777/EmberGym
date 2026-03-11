<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController; // This brings in your controller
use App\Http\Controllers\Api\ContactBookingController;

// This is the map! When a POST request hits /api/register, it runs your register code.
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/contact-bookings', [ContactBookingController::class, 'store']);
Route::get('/contact-bookings', [ContactBookingController::class, 'index']);

// (Optional) Laravel usually includes this default route, you can leave it here
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});