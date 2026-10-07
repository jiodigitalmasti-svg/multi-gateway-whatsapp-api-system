<?php
/**
 * Multi-Gateway WhatsApp API System - Webhook Handler
 * Compatible with cPanel, Apache, Nginx, and Domain Level Hosting
 * Branding: Bharat Web Solutions
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle pre-flight CORS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['status' => 'OK']);
    exit;
}

// Verification Handshake for Meta/WhatsApp Webhook Verification (GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $mode = $_GET['hub_mode'] ?? $_GET['mode'] ?? '';
    $token = $_GET['hub_verify_token'] ?? $_GET['token'] ?? '';
    $challenge = $_GET['hub_challenge'] ?? $_GET['challenge'] ?? '';
    $verifyToken = 'bharat_web_solutions_secret_token';

    if ($mode === 'subscribe' && $token === $verifyToken) {
        http_response_code(200);
        echo $challenge ?: 'VERIFIED';
        exit;
    }

    echo json_encode([
        'status' => 'success',
        'service' => 'Bharat Web Solutions WhatsApp Multi-Gateway Webhook Listener',
        'timestamp' => time(),
        'message' => 'Webhook listener is live and healthy.'
    ]);
    exit;
}

// Handle Inbound WhatsApp Webhook Payloads (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);

    if (!$payload) {
        $payload = $_POST;
    }

    $event = $payload['event'] ?? 'message.received';
    $gatewayId = $payload['gateway_id'] ?? $payload['gateway'] ?? 'alpha';
    $sender = $payload['sender'] ?? $payload['from'] ?? 'Unknown';
    $recipient = $payload['recipient'] ?? $payload['to'] ?? '';
    $messageBody = $payload['message'] ?? $payload['body'] ?? '';
    $messageId = $payload['message_id'] ?? ('MSG_' . uniqid());
    $status = $payload['status'] ?? 'delivered';

    $logEntry = [
        'id' => $messageId,
        'gateway_id' => $gatewayId,
        'event' => $event,
        'sender' => $sender,
        'recipient' => $recipient,
        'message' => $messageBody,
        'status' => $status,
        'received_at' => date('Y-m-d H:i:s'),
        'timestamp' => time()
    ];

    // Optional local flatfile logging for cPanel standalone setups
    $logFile = __DIR__ . '/webhook_logs.json';
    $existingLogs = [];
    if (file_exists($logFile)) {
        $content = file_get_contents($logFile);
        $existingLogs = json_decode($content, true) ?: [];
    }
    array_unshift($existingLogs, $logEntry);
    if (count($existingLogs) > 100) {
        $existingLogs = array_slice($existingLogs, 0, 100);
    }
    @file_put_contents($logFile, json_encode($existingLogs, JSON_PRETTY_PRINT));

    // Response back to Gateway microservice
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'processed' => true,
        'gateway' => $gatewayId,
        'event' => $event,
        'message_id' => $messageId,
        'acknowledgement' => 'Received by Bharat Web Solutions Webhook Engine'
    ]);
    exit;
}
