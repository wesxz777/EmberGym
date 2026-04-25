<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    // 🔥 THE FIX: Use '*' so Laravel applies CORS to ALL doors!
    'paths' => ['*'], 

    'allowed_methods' => ['*'],

    // Your VIP List
    'allowed_origins' => [
        'https://ember-gym.vercel.app',
        'http://localhost:5500',
        'http://localhost:5173',
        'http://localhost:3000'
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // 🔥 Crucial for Sanctum Authentication
    'supports_credentials' => true,

];