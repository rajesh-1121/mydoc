<?php
session_start();

// Destroy the session.
session_destroy();

// Send a response back to the script
echo json_encode(['status' => 'success']);
