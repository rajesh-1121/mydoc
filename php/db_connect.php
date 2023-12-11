<?php
$servername = "localhost";
$username = "id21616895_rj";
$password = "12345@Qwerty";
$dbname = "id21616895_doc";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
