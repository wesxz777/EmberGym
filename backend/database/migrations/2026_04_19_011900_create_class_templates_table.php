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
        Schema::create('class_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');             // e.g., "Power Yoga Flow"
            $table->string('type');             // e.g., "Yoga"
            $table->integer('duration');        // in minutes, e.g., 60
            $table->string('intensity');        // e.g., "Medium"
            $table->text('description');
            $table->text('image')->nullable();  // Unsplash image URLs
            $table->json('benefits')->nullable(); // Array of benefits
            $table->json('allowed_plans')->nullable(); // Who can book this?
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_templates');
    }
};
