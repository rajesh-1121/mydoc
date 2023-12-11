<?php
session_start();
include 'db_connect.php'; // Ensure you have this file for database connection

header('Content-Type: application/json');

if (!isset($_SESSION['doctorId'])) {
    echo json_encode(["status" => "error", "message" => "Doctor not logged in"]);
    exit;
}

$doctorId = $_SESSION['doctorId'];
$sql = "SELECT name FROM doctors WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Query preparation failed"]);
    exit;
}

$stmt->bind_param("i", $doctorId);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(["status" => "success", "doctorName" => $row['name']]);
} else {
    echo json_encode(["status" => "error", "message" => "Doctor not found"]);
}

$stmt->close();
$conn->close();
?>
