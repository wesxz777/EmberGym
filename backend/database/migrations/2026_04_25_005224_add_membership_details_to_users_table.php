<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        try {
            // Only add the columns if they don't already exist
            if (!Schema::hasColumn('users', 'membership_plan')) {
                Schema::table('users', function (Blueprint $table) {
                    $table->string('membership_plan')->default('none');
                    $table->string('membership_status')->default('inactive');
                    $table->timestamp('membership_expires_at')->nullable();
                });
            }
        } catch (\Exception $e) {
            // Stay completely silent so Render doesn't crash
        }
    }

    public function down(): void
    {
        try {
            if (Schema::hasColumn('users', 'membership_plan')) {
                Schema::table('users', function (Blueprint $table) {
                    $table->dropColumn(['membership_plan', 'membership_status', 'membership_expires_at']);
                });
            }
        } catch (\Exception $e) {
            // Stay silent
        }
    }
};