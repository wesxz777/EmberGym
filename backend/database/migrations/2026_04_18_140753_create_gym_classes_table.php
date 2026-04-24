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
        Schema::create('gym_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Power Yoga Flow"
            $table->foreignId('trainer_id')->constrained('users')->onDelete('cascade'); // Links to your Staff table
            $table->date('class_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('max_capacity')->default(20);
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gym_classes');
    }

    
};
