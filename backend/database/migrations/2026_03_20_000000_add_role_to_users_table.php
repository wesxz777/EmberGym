<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 🔥 THE FIX: Check if the column exists before trying to add it
        if (!Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->enum('role', ['member', 'admin', 'manager', 'receptionist', 'trainer', 'super_admin'])
                      ->default('member')
                      ->after('phone');
            });
        }
    }

    public function down(): void
    {
        // Safety check for rollbacks
        if (Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        }
    }
};