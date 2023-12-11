// Function to check login status on page load
function checkLoginStatus() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const userType = localStorage.getItem('userType');
        // Redirect based on user type
        redirectToDashboard(userType);
    }
}

// Call checkLoginStatus on page load of index.html
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

// Function to handle sign out
function signOut() {
    // Add code to handle server-side sign out, if applicable

    // Clear the isLoggedIn flag and userType
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');

    // Redirect to the index.html (login page) after sign out
    window.location.href = 'index.html';
}

// Function to redirect to the appropriate dashboard
// This is a simplified version; modify as needed based on your application's routing logic
function redirectToDashboard(userType) {
    if (userType === 'patients') {
        window.location.href = 'user.html'; // Redirect to patient profile page
    } else if (userType === 'doctors') {
        window.location.href = 'doctor.html'; // Redirect to doctor profile page
    }
}
