<?php
session_start();
header('Content-Type: application/json');
include 'db_connect.php';

if (!isset($_SESSION['doctorId'])) {
    echo json_encode(["status" => "error", "message" => "Doctor not logged in"]);
    exit();
}

$doctorId = $_SESSION['doctorId'];
$sql = "SELECT specialist FROM doctors WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $doctorId);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $specialist = $row['specialist'];

    // Fetch active appointments
    $sqlActive = "SELECT * FROM appointments WHERE reason = ? AND status = 'booked'";
    $stmtActive = $conn->prepare($sqlActive);
    $stmtActive->bind_param("s", $specialist);
    $stmtActive->execute();
    $activeAppointments = $stmtActive->get_result()->fetch_all(MYSQLI_ASSOC);

    // Fetch appointment history
    $sqlHistory = "SELECT * FROM appointments WHERE reason = ? AND status != 'booked'";
    $stmtHistory = $conn->prepare($sqlHistory);
    $stmtHistory->bind_param("s", $specialist);
    $stmtHistory->execute();
    $appointmentHistory = $stmtHistory->get_result()->fetch_all(MYSQLI_ASSOC);

    echo json_encode(["status" => "success", "activeAppointments" => $activeAppointments, "appointmentHistory" => $appointmentHistory]);
} else {
    echo json_encode(["status" => "error", "message" => "Doctor's specialty not found"]);
}

$stmt->close();
$conn->close();
?>
