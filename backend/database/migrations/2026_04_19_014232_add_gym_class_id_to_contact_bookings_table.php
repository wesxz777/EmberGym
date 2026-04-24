<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_bookings', function (Blueprint $table) {
            // Adds the missing link so members can book specific classes!
            $table->foreignId('gym_class_id')->nullable()->constrained('gym_classes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('contact_bookings', function (Blueprint $table) {
            $table->dropForeign(['gym_class_id']);
            $table->dropColumn('gym_class_id');
        });
    }
};