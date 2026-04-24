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
        Schema::table('gym_classes', function (Blueprint $table) {
            // Link to the Catalogue menu
            $table->foreignId('class_template_id')->nullable()->constrained('class_templates')->onDelete('cascade');
            // Add the physical room
            $table->string('room')->default('Main Studio');
        });
    }

    public function down(): void
    {
        Schema::table('gym_classes', function (Blueprint $table) {
            $table->dropForeign(['class_template_id']);
            $table->dropColumn('class_template_id');
            $table->dropColumn('room');
        });
    }
};
