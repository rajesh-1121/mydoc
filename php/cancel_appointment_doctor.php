<?php
session_start();
header('Content-Type: application/json');
include 'db_connect.php';

if (!isset($_SESSION['doctorId'])) {
    echo json_encode(["status" => "error", "message" => "Doctor not logged in"]);
    exit();
}

$appointmentId = $_POST['appointmentId'] ?? '';

if (!$appointmentId) {
    echo json_encode(["status" => "error", "message" => "Appointment ID is missing"]);
    exit();
}

// Cancel the appointment
$sql = "UPDATE appointments SET status = 'cancelled' WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $appointmentId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["status" => "success", "message" => "Appointment cancelled successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Appointment cancellation failed or appointment does not exist"]);
}

$stmt->close();
$conn->close();
?>
