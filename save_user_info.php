<?php
session_start();
header('Content-Type: application/json');

// Enable error reporting for debugging. Remove this line in production.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db_connect.php'; // Make sure this path is correct

// Function to check if the user information already exists
function doesUserInfoExist($conn, $userId) {
    $stmt = $conn->prepare("SELECT * FROM user_info WHERE patient_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->num_rows > 0;
}

// Check if the user is logged in
if (!isset($_SESSION['userId'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit();
}

// Get user ID from session
$userId = $_SESSION['userId'];

// Get user input from the form
$dob = $_POST['dob'] ?? null;
$age = $_POST['age'] ?? null;
$gender = $_POST['gender'] ?? null;
$city = $_POST['city'] ?? null;
$state = $_POST['state'] ?? null;
$country = $_POST['country'] ?? null;
$previousHealthIssue = $_POST['previousHealthIssue'] ?? null;

try {
    // Begin transaction
    $conn->begin_transaction();

    // Check if user info already exists
    if (doesUserInfoExist($conn, $userId)) {
        // User info exists, so update it
        $stmt = $conn->prepare("UPDATE user_info SET dob=?, age=?, gender=?, city=?, state=?, country=?, previous_health_issue=? WHERE patient_id=?");
        $stmt->bind_param("sisssssi", $dob, $age, $gender, $city, $state, $country, $previousHealthIssue, $userId);
    } else {
        // User info does not exist, so insert it
        $stmt = $conn->prepare("INSERT INTO user_info (patient_id, dob, age, gender, city, state, country, previous_health_issue) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isisssss", $userId, $dob, $age, $gender, $city, $state, $country, $previousHealthIssue);
    }

    // Execute the prepared statement
    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    // Commit transaction
    $conn->commit();

    echo json_encode(["status" => "success", "message" => "Information saved successfully"]);
} catch (Exception $e) {
    // An exception has been thrown
    $conn->rollback();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>
