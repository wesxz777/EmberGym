<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ember Gym Receipt</title>
    <style>
        body { font-family: 'Helvetica', Arial, sans-serif; color: #333; margin: 0; padding: 20px; }
        .header { width: 100%; border-bottom: 2px solid #ea580c; padding-bottom: 20px; margin-bottom: 30px; }
        .header td { vertical-align: top; }
        .title { color: #ea580c; font-size: 32px; font-weight: bold; margin: 0; letter-spacing: 1px; }
        .receipt-title { font-size: 24px; color: #1f2937; margin: 0; text-align: right; text-transform: uppercase; }
        .info-text { color: #6b7280; font-size: 12px; margin: 3px 0; }
        .customer-box { margin-bottom: 40px; }
        .customer-title { font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-bottom: 5px; }
        .customer-name { font-size: 18px; font-weight: bold; color: #1f2937; margin: 0 0 5px 0; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .table th { border-bottom: 2px solid #e5e7eb; padding: 10px 5px; text-align: left; color: #4b5563; text-transform: uppercase; font-size: 12px; }
        .table td { border-bottom: 1px solid #f3f4f6; padding: 15px 5px; }
        .item-name { font-weight: bold; font-size: 16px; color: #1f2937; margin: 0; }
        .item-desc { color: #6b7280; font-size: 12px; margin: 5px 0 0 0; }
        .amount { text-align: right; font-family: monospace; font-size: 14px; }
        .totals-container { width: 100%; }
        .totals { width: 50%; float: right; border-collapse: collapse; }
        .totals td { padding: 8px 5px; font-size: 14px; color: #4b5563; }
        .totals .amount { color: #1f2937; }
        .totals .discount { color: #16a34a; }
        .totals .total-row td { border-top: 1px solid #e5e7eb; font-weight: bold; font-size: 18px; color: #1f2937; padding-top: 15px; }
        .totals .total-row .amount { color: #ea580c; }
        .footer { clear: both; text-align: center; margin-top: 80px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        .footer p { color: #6b7280; font-size: 14px; margin: 5px 0; }
        .footer .strong { font-weight: bold; color: #4b5563; }
    </style>
</head>
<body>

    <table class="header">
        <tr>
            <td>
                <h1 class="title">EMBER GYM</h1>
                <p class="info-text">JP Rizal Extension, West Rembo</p>
                <p class="info-text">Taguig City, Metro Manila, 1215</p>
                <p class="info-text">info@embergym.ph</p>
            </td>
            <td style="text-align: right;">
                <h2 class="receipt-title">Receipt</h2>
                <p class="info-text" style="font-family: monospace;">TXN: {{ $payment->transaction_id }}</p>
                <p class="info-text">Date: {{ \Carbon\Carbon::parse($payment->paid_at)->format('F j, Y') }}</p>
            </td>
        </tr>
    </table>

    <div class="customer-box">
        <div class="customer-title">Billed To:</div>
        <p class="customer-name">{{ $user->first_name }} {{ $user->last_name }}</p>
        <p class="info-text">{{ $user->email }}</p>
        @if($user->phone)
            <p class="info-text">{{ $user->phone }}</p>
        @endif
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <p class="item-name">Ember Gym Membership - {{ strtoupper($payment->plan) }}</p>
                    <p class="item-desc">1 Month Access Validation</p>
                </td>
                <td class="amount">PHP {{ number_format($payment->amount / 100, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="totals-container">
        <table class="totals">
            <tr>
                <td>Subtotal (Base Price)</td>
                <td class="amount">PHP {{ number_format($payment->amount / 100, 2) }}</td>
            </tr>
            <tr>
                <td>Discount (50%)</td>
                <td class="amount discount">- PHP {{ number_format(($payment->amount / 100) * 0.5, 2) }}</td>
            </tr>
            <tr>
                <td>Tax (12% VAT)</td>
                <td class="amount">PHP {{ number_format($payment->tax_amount / 100, 2) }}</td>
            </tr>
            <tr class="total-row">
                <td>Total Paid</td>
                <td class="amount">PHP {{ number_format($payment->total_amount / 100, 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <p class="strong">Thank you for your business!</p>
        <p>Your {{ strtoupper($payment->plan) }} membership is now active.</p>
    </div>

</body>
</html>