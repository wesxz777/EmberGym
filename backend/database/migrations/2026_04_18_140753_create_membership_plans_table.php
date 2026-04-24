<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('membership_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "VIP Annual"
            $table->decimal('price', 8, 2); // e.g., 2500.00
            $table->integer('duration_days'); // e.g., 30 for monthly, 365 for annual
            $table->json('features')->nullable(); // Array of perks like ["Free Locker", "24/7 Access"]
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membership_plans');
    }
};
