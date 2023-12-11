<?php
session_start();
header('Content-Type: application/json');
include 'db_connect.php';

if (!isset($_SESSION['userId'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit();
}

$patientId = $_SESSION['userId'];
$date = $_POST['date'];
$timeSlot = $_POST['timeSlot'];
$reason = $_POST['reason'];
$type = $_POST['type'];
$zoomLink = $type === 'zoom' ? 'https://zoom.us/random/link' : ''; // Generate Zoom link accordingly

$stmt = $conn->prepare("INSERT INTO appointments (patient_id, appointment_date, time_slot, reason, appointment_type, zoom_link) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isssss", $patientId, $date, $timeSlot, $reason, $type, $zoomLink);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Appointment booked successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error booking appointment"]);
}

$stmt->close();
$conn->close();
?>
