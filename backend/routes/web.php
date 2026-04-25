<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::get('/force-migrate', function () {
    try {
        // 🔥 Notice the :fresh added here! 🔥
        Artisan::call('migrate:fresh', ['--force' => true]);
        return response()->json(['message' => 'Database completely rebuilt successfully!']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()]);
    }
});