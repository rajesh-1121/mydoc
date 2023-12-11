<?php
session_start();
header('Content-Type: application/json');
include 'db_connect.php';

if (!isset($_SESSION['userId'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit();
}

$userId = $_SESSION['userId'];
$sql = "SELECT full_name FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(["status" => "success", "fullName" => $row['full_name']]);
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Database query preparation failed"]);
}
$conn->close();
?>