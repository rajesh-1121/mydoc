<?php
session_start();
header('Content-Type: application/json');

include 'db_connect.php'; // Adjust this path as needed

if (!isset($_SESSION['userId'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit();
}

$userId = $_SESSION['userId'];

// Query to get user's booked appointments
$query = "SELECT * FROM appointments WHERE patient_id = ? AND status = 'booked'";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$appointments = [];
while($row = $result->fetch_assoc()) {
    $appointments[] = [
        'id' => $row['id'],
        'date' => $row['appointment_date'],
        'timeSlot' => $row['time_slot'],
        'type' => $row['appointment_type'],
        'reason' => $row['reason'],
        'zoomLink' => $row['zoom_link']
    ];
}

echo json_encode(["status" => "success", "appointments" => $appointments]);

$stmt->close();
$conn->close();
?>
