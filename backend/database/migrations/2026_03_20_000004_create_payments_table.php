<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('plan', ['basic', 'pro', 'elite']);
            $table->bigInteger('amount'); // in centavos
            $table->bigInteger('tax_amount');
            $table->bigInteger('total_amount');
            $table->enum('status', ['pending', 'success', 'failed', 'refunded'])->default('pending');
            $table->enum('payment_method', ['card', 'gcash', 'paymaya'])->nullable();
            $table->string('transaction_id')->unique();
            $table->string('card_last_four')->nullable();
            $table->json('billing_address')->nullable();
            $table->string('tin')->nullable(); // Tax ID
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
            $table->index('transaction_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
