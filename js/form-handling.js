document.addEventListener('DOMContentLoaded', function() {
    // Function to reset forms
    function resetForms() {
        // Reset patient login and signup forms
        document.getElementById('patientLoginForm').reset();
        document.getElementById('patientSignupForm').reset();

        // Reset doctor login and signup forms
        document.getElementById('doctorLoginForm').reset();
        document.getElementById('doctorSignupForm').reset();
    }

    // Function to show notification
function showNotification(message, isSuccess = true) {
    const notification = document.createElement('div');
    notification.className = isSuccess ? 'notification success' : 'notification error';
    notification.textContent = message;

    document.body.appendChild(notification);

    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 5000);
}



    // Modified handleLogin function
    function handleLogin(formId, actionURL, userType) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(form);

                fetch(actionURL, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        showNotification('Login successful', true);
                        redirectToDashboard(userType);
                    } else {
                        showNotification('Login failed: ' + data.message, false);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showNotification('An error occurred', false);
                });
            });
        }
    }

    // Function to handle signup submissions
function handleSignup(formId, actionURL, userType) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(form);

            fetch(actionURL, {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(responseText => {
                // Assuming the responseText includes a success message or an error message
                if (responseText.includes("successful")) {
                    showNotification('Signup successful', true);
                    window.location.href = 'index.html'; // Redirect to login page
                } else {
                    showNotification(responseText, false); // Show error or other message from server
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred during signup', false);
            });
        });
    }
}


    // Function to redirect to the appropriate dashboard after login
    function redirectToDashboard(userType) {
        // Set a flag in localStorage upon successful login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', userType); // Store user type for redirection

        if (userType === 'patient') {
            window.location.href = 'user.html'; // Redirect to patient profile page
        } else if (userType === 'doctor') {
            window.location.href = 'doctor.html'; // Redirect to doctor profile page
        }
    }
// Function to reset forms
function resetForms() {
    // Reset patient login and signup forms
    document.getElementById('patientLoginForm')?.reset();
    document.getElementById('patientSignupForm')?.reset();

    // Reset doctor login and signup forms
    document.getElementById('doctorLoginForm')?.reset();
    document.getElementById('doctorSignupForm')?.reset();
}

// Initialize form handlers
handleLogin('patientLoginForm', 'php/login_patient.php', 'patient');
handleSignup('patientSignupForm', 'php/register_patient.php', 'patient');
handleLogin('doctorLoginForm', 'php/login_doctor.php', 'doctor');
handleSignup('doctorSignupForm', 'php/register_doctor.php', 'doctor');

// Reset forms on page load
resetForms();

// Reset forms when the page is revisited or gains focus
window.addEventListener('focus', resetForms());

});

