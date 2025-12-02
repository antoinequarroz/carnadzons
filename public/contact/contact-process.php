<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données invalides']);
    exit;
}

$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$message = isset($data['message']) ? trim($data['message']) : '';
$timestamp = isset($data['timestamp']) ? $data['timestamp'] : 0;

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs obligatoires']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Adresse email invalide']);
    exit;
}

$timeSpent = (microtime(true) * 1000 - $timestamp) / 1000;
if ($timeSpent < 3) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Soumission trop rapide']);
    exit;
}

if (strlen($message) > 5000) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Message trop long']);
    exit;
}

$suspiciousPatterns = [
    '/\[url=/i',
    '/\[link=/i',
    '/<a href=/i',
    '/http:\/\//i',
    '/https:\/\//i',
];

foreach ($suspiciousPatterns as $pattern) {
    if (preg_match($pattern, $message)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Contenu suspect détecté']);
        exit;
    }
}

$to = 'contact@carnadzons.ch';
$subject = 'Nouveau message depuis le site Carnadzons';

$emailMessage = "Vous avez reçu un nouveau message depuis le formulaire de contact:\n\n";
$emailMessage .= "Nom: " . $name . "\n";
$emailMessage .= "Email: " . $email . "\n";
$emailMessage .= "Téléphone: " . $phone . "\n\n";
$emailMessage .= "Message:\n" . $message . "\n";

$headers = "From: noreply@carnadzons.ch\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $subject, $emailMessage, $headers)) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi du message']);
}
?>
