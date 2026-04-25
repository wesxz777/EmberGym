<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Adding the two missing columns
            $table->string('membership_plan')->nullable();
            $table->string('membership_status')->default('inactive');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Removing them if we ever need to rollback
            $table->dropColumn(['membership_plan', 'membership_status']);
        });
    }
};