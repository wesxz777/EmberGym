<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Ember Gym API is running!']);
});

Route::get('/force-migrate', function () {
    try {
        // This will strictly drop all tables and rebuild them with your new membership columns
        Artisan::call('migrate:fresh', ['--force' => true]);
        return response()->json(['message' => 'Database completely rebuilt successfully!']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()]);
    }
});