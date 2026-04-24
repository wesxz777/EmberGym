<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $table = 'payments';

    protected $fillable = [
        'user_id',
        'plan',
        'amount',
        'tax_amount',
        'total_amount',
        'status',
        'payment_method',
        'transaction_id',
        'card_last_four',
        'billing_address',
        'tin',
        'paid_at',
    ];

    protected $casts = [
        'billing_address' => 'array',
        'paid_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
