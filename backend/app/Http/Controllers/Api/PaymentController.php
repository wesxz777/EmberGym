<?php

namespace App\Http\Controllers\Api;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Notifications\PaymentSuccessful;
use App\Notifications\MembershipCancelled;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class PaymentController
{
    /**
     * Store a new payment (checkout)
     */
    public function checkout(Request $request)
    {
        $user = Auth::user();

        // Validate request
        $validator = Validator::make($request->all(), [
            'plan' => 'required|in:basic,pro,elite',
            'card_number' => 'required|string|regex:/^\d{13,19}$/',
            'card_expiry' => 'required|regex:/^\d{2}\/\d{2}$/',
            'card_cvv' => 'required|regex:/^\d{3,4}$/',
            'cardholder_name' => 'required|string|max:255',
            'billing_name' => 'required|string|max:255',
            'billing_address' => 'required|string|max:255',
            'billing_city' => 'required|string|max:100',
            'billing_postal_code' => 'required|string|max:20',
            'billing_country' => 'required|string|max:100',
            'tin' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Check if user already has an active membership for this plan
        if (
            $user->membership_plan === $request->plan &&
            $user->membership_status === 'active' &&
            $user->membership_expires_at
        ) {
            $expiryDate = $user->membership_expires_at instanceof \DateTime
                ? $user->membership_expires_at
                : new \DateTime($user->membership_expires_at);

            if ($expiryDate > now()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You already have an active ' . ucfirst($request->plan) . ' membership. Please wait until it expires to purchase again or upgrade to a higher plan.',
                    'expiry_date' => $expiryDate->format('Y-m-d'),
                ], 422);
            }
        }

        try {
            // Extract card details
            $cardLastFour = substr($request->card_number, -4);

            // Build billing address
            $billingAddress = [
                'name' => $request->billing_name,
                'address' => $request->billing_address,
                'city' => $request->billing_city,
                'postal_code' => $request->billing_postal_code,
                'country' => $request->billing_country,
            ];

            // Calculate amounts (prices in centavos)
            $planPrices = [
                'basic' => 99900,  // ₱999.00
                'pro' => 149900,    // ₱1499.00
                'elite' => 199900,  // ₱1999.00
            ];

            $baseAmount = $planPrices[$request->plan];
            $discount = (int) ($baseAmount * 0.5); // 50% discount
            $subtotal = $baseAmount - $discount;
            $taxAmount = (int) ($subtotal * 0.12); // 12% VAT
            $totalAmount = $subtotal + $taxAmount;

            // TODO: Integrate with payment gateway (Stripe/PayMongo)
            // For now, we'll simulate successful payment
            $transactionId = 'TXN_' . Str::random(16);
            $paymentStatus = 'success'; // In real implementation, validate with payment gateway

            // Create payment record
            $payment = Payment::create([
                'user_id' => $user->id,
                'plan' => $request->plan,
                'amount' => $baseAmount,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'status' => $paymentStatus,
                'payment_method' => 'card',
                'transaction_id' => $transactionId,
                'card_last_four' => $cardLastFour,
                'billing_address' => $billingAddress,
                'tin' => $request->tin,
                'paid_at' => now(),
            ]);

            // Update user membership
            if ($paymentStatus === 'success') {
                $user->update([
                    // 🔥 ADDED: The Missing Link to promote the user for the Admin Panel!
                    'role' => 'member', 
                    'membership' => ucfirst($request->plan), 
                    'has_purchased_before' => true, 
                    
                    // Original fields
                    'membership_plan' => $request->plan,
                    'membership_status' => 'active',
                    // 🔥 UPDATED: Locked to exactly 30 days!
                    'membership_expires_at' => now()->addDays(30), 
                ]);

                // --- ADDED NOTIFICATION LOGIC ---
                // Convert centavos back to standard format for the message (e.g., 1499.00)
                $displayAmount = number_format($totalAmount / 100, 2);
                $user->notify(new PaymentSuccessful(ucfirst($request->plan), $displayAmount));
                // --------------------------------

                // TODO: Send confirmation email

                return response()->json([
                    'success' => true,
                    'message' => 'Payment processed successfully',
                    'transaction_id' => $transactionId,
                    'payment_id' => $payment->id,
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment failed',
                    'transaction_id' => $transactionId,
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cancel user's membership plan
     */
    public function cancelPlan(Request $request)
    {
        $user = Auth::user();

        // Check if user has an active plan
        if (!$user->membership_plan || $user->membership_plan === 'none' || $user->membership_status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'You do not have an active membership to cancel.',
            ], 422);
        }

       try {
            // --- ADDED: Save the old plan name before overwriting it ---
            $planName = ucfirst($user->membership_plan);

            // Cancel the plan
            $user->update([
                'membership_plan' => 'none',
                'membership_status' => 'cancelled',
                'membership_expires_at' => null,
            ]);

            // --- ADDED NOTIFICATION LOGIC ---
            $user->notify(new MembershipCancelled($planName));
            // --------------------------------

            return response()->json([
                'success' => true,
                'message' => 'Your membership plan has been cancelled successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while cancelling your plan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get payment status
     */
    public function getPaymentStatus($id)
    {
        $user = Auth::user();
        $payment = Payment::where('id', $id)->where('user_id', $user->id)->first();

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'payment' => [
                'id' => $payment->id,
                'plan' => $payment->plan,
                'amount' => $payment->amount,
                'tax_amount' => $payment->tax_amount,
                'total_amount' => $payment->total_amount,
                'status' => $payment->status,
                'transaction_id' => $payment->transaction_id,
                'paid_at' => $payment->paid_at,
            ],
        ], 200);
    }

    /**
     * Get user's payment history
     */
    public function getPaymentHistory(Request $request)
    {
        $user = Auth::user();

        $payments = Payment::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'payments' => $payments->items(),
            'pagination' => [
                'total' => $payments->total(),
                'per_page' => $payments->perPage(),
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
            ],
        ], 200);
    }

    /**
     * Generate and download the PDF Receipt
     */
    public function downloadReceipt($id)
    {
        $user = Auth::user();
        
        // Find the payment and ensure it belongs to this user
        $payment = Payment::where('id', $id)->where('user_id', $user->id)->first();

        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Payment not found'], 404);
        }

        // Generate the PDF using a Blade view
        $pdf = Pdf::loadView('receipt', [
            'payment' => $payment,
            'user' => $user
        ]);

        // OPTIONAL: Save a permanent copy to the backend server (storage/app/receipts)
        Storage::put("receipts/{$payment->transaction_id}.pdf", $pdf->output());

        // Return the PDF as a downloadable file to React
        return $pdf->download("EmberGym_Receipt_{$payment->transaction_id}.pdf");
    }
}