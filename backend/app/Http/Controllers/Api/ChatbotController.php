<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    private string $systemPrompt = <<<'PROMPT'
You are a customer service assistant for Ember Gym. Answer using ONLY the information provided.

### STYLE GUIDELINES:
- Use bold text for emphasis on gym names, classes, or prices.
- Use `###` for section headers if the answer is long.
- Use bullet points for lists (trainers, classes, etc.).
- Use a table for Membership plans.
- Always be professional and concise.

### CRITICAL RULES:
1. Answer ONLY the specific question asked. 
2. Do NOT provide extra information (like trainers or hours) unless specifically requested.
3. If the user asks for the address, give ONLY the address.
4. Use ONLY the information provided below.

### GYM DATA:
ADDRESS: JP Rizal Extension, West Rembo, Taguig City, Metro Manila, 1215.

TRAINERS (only these 3):
1. Joanna Kristel Hernandez - Yoga Specialist, 8 years exp, 150+ clients, RYT-500 certified
2. Antonio Estor Jr. - HIIT Expert, 10 years exp, 200+ clients, NASM-CPT certified
3. Igor Ducay - Strength Coach, 12 years exp, 180+ clients, HOPE certified

HOURS: M-F 5AM-10PM, Sat 6AM-9PM, Sun 7AM-8PM. 
PHONE: (555) 123-4567. 
EMAIL: emergym@gmail.com

MEMBERSHIPS: Basic ₱999 (2 classes/week), Pro ₱1,499 (unlimited), Elite ₱1,999 (unlimited + 24/7)

CLASSES: Power Yoga, HIIT Blast, Strength Builder, Cardio Cycling, Core Pilates, Boxing, CrossFit, Zumba
PROMPT;

    public function chat(Request $request)
    {
        try {
            if (session_status() === PHP_SESSION_ACTIVE) {
                session_write_close();
            }
            set_time_limit(0);

            // 🔥 FIX 1: Force Laravel to treat this as a JSON API, preventing HTML redirects
            $request->headers->set('Accept', 'application/json');

            // 🔥 FIX 2: Loosen the validation to stop instant crashes
            $request->validate([
                'messages' => 'required|array|min:1',
            ]);

            $formattedMessages = [
                ['role' => 'system', 'content' => $this->systemPrompt]
            ];

            foreach ($request->messages as $msg) {
                // Safely grab the content, even if React named the variables differently
                $formattedMessages[] = [
                    'role' => $msg['role'] ?? 'user',
                    'content' => $msg['content'] ?? json_encode($msg),
                ];
            }

            $payload = [
                'model' => 'llama3-8b-8192',
                'messages' => $formattedMessages,
                'stream' => true,
                'temperature' => 0.1,
                'max_tokens' => 1024,
            ];

            $response = new StreamedResponse(function () use ($payload) {
                $ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
                curl_setopt($ch, CURLOPT_TIMEOUT, 180);
                
                $apiKey = env('GROQ_API_KEY');
                curl_setopt($ch, CURLOPT_HTTPHEADER, [
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $apiKey
                ]);
                
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
                curl_setopt($ch, CURLOPT_POST, true);

                curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($curl, $data) {
                    $lines = explode("\n", trim($data));
                    foreach($lines as $line) {
                        if (strpos($line, 'data: ') === 0) {
                            $jsonString = substr($line, 6);
                            if (trim($jsonString) === '[DONE]') continue;
                            
                            $parsed = json_decode($jsonString, true);
                            if (isset($parsed['choices'][0]['delta']['content'])) {
                                $chunk = $parsed['choices'][0]['delta']['content'];
                                $fakeOllama = json_encode(['message' => ['content' => $chunk]]);
                                echo "data: " . $fakeOllama . "\n\n"; 
                            }
                        }
                    }
                    if (ob_get_level() > 0) ob_flush();
                    flush();
                    return strlen($data);
                });

                curl_exec($ch);
                curl_close($ch);
            });

            $response->headers->set('Content-Type', 'text/event-stream');
            $response->headers->set('Cache-Control', 'no-cache');
            $response->headers->set('Connection', 'keep-alive');
            $response->headers->set('X-Accel-Buffering', 'no');

            return $response;

        } catch (\Throwable $e) {
            // 🔥 FIX 3: THE ULTIMATE TRAP. Catch ANY fatal error and print it cleanly!
            return response()->json([
                'CRASH_REPORT' => $e->getMessage(),
                'FILE' => $e->getFile(),
                'LINE' => $e->getLine()
            ], 500);
        }
    }
}