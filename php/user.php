<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Dashboard</title>
    <link rel="stylesheet" href="styles.css">
    <!-- Additional CSS and JS files can be included here -->
</head>
<body>
<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['userId'])) {
    // Redirect to login page if not logged in
    header("Location: login_patient.php");
    exit();
}

// Assuming the full name is stored in session, else you will need to fetch it from the database
$patientFullName = isset($_SESSION['fullName']) ? $_SESSION['fullName'] : 'Unknown User';
?>

<header>
    <div class="header-container">
        <img src="mydoc1.png" alt="Logo" class="logo">
        <div class="user-info">
            <span id="patientFullName"><?php echo htmlspecialchars($patientFullName); ?></span>
        </div>
    </div>
</header>

<div class="dashboard">
    <div class="left-section">
        <button class="menu-button" id="homeBtn">Home</button>
        <button class="menu-button" id="infoFormBtn">Information Form</button>
        <button class="menu-button" id="appointmentsBtn">Appointments</button>
        <button id="signOutBtn" class="sign-out-button">Sign Out</button>
    </div>

    <div class="right-section" id="dashboardContent">
        <!-- Content will be dynamically loaded here based on the button clicked -->
    </div>
</div>

<footer>
    <p>Patient's Dashboard.</p>
</footer>
<script src="js/user.js"></script>
</body>
</html>
