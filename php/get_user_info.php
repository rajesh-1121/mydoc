<?php
session_start();

header('Content-Type: application/json');

// Include your database connection script
require 'db_connect.php';

// Check if the user is logged in and has a valid session user ID
if (!isset($_SESSION['userId'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit();
}

$userId = $_SESSION['userId'];

// Prepare a query to fetch user information
$query = "SELECT p.name, pi.dob, pi.age, pi.gender, pi.city, pi.state, pi.country, pi.previous_health_issue FROM patients p
          JOIN patient_info pi ON p.id = pi.patient_id
          WHERE p.id = ?";

// Prepare and execute the query
if ($stmt = $conn->prepare($query)) {
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $userInfo = $result->fetch_assoc();
        echo json_encode(["status" => "success", "userInfo" => $userInfo]);
    } else {
        echo json_encode(["status" => "error", "message" => "User information not found"]);
    }
    
    $stmt->close();
} else {
    // Handle errors in preparation of statement
    echo json_encode(["status" => "error", "message" => "Error preparing database statement"]);
}

$conn->close();
?>
