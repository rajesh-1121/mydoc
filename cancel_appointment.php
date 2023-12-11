<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['userId'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit();
}

include 'db_connect.php'; // Make sure this path is correct.

$appointmentId = $_POST['appointmentId'] ?? null;

if ($appointmentId === null) {
    echo json_encode(["status" => "error", "message" => "No appointment ID provided"]);
    exit();
}

// Verify that the appointment belongs to the logged-in user
$userId = $_SESSION['userId'];
$stmt = $conn->prepare("SELECT * FROM appointments WHERE id = ? AND patient_id = ?");
$stmt->bind_param("ii", $appointmentId, $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "Appointment not found or does not belong to the user"]);
    exit();
}

// Cancel the appointment
$stmt = $conn->prepare("UPDATE appointments SET status = 'cancelled' WHERE id = ?");
$stmt->bind_param("i", $appointmentId);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Appointment cancelled successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to cancel appointment"]);
}

$stmt->close();
$conn->close();
?>
