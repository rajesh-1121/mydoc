document.addEventListener('DOMContentLoaded', function() {


    // Function to toggle active class on buttons
    function toggleActiveClass(button) {
        const buttons = document.querySelectorAll('.toggle-buttons button');
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    // Toggling between Login and Signup in Patient Section
    const patientLoginSection = document.getElementById('patientLoginSection');
    const patientSignupSection = document.getElementById('patientSignupSection');
    const patientSignupToggle = document.getElementById('patientSignupToggle');
    const patientLoginToggle = document.getElementById('patientLoginToggle');

    patientSignupToggle.addEventListener('click', function() {
        patientLoginSection.classList.add('hidden');
        patientSignupSection.classList.remove('hidden');
    });

    patientLoginToggle.addEventListener('click', function() {
        patientSignupSection.classList.add('hidden');
        patientLoginSection.classList.remove('hidden');
    });

    // Toggling between Login and Signup in Doctor Section
    const doctorLoginSection = document.getElementById('doctorLoginSection');
    const doctorSignupSection = document.getElementById('doctorSignupSection');
    const doctorSignupToggle = document.getElementById('doctorSignupToggle');
    const doctorLoginToggle = document.getElementById('doctorLoginToggle');

    doctorSignupToggle.addEventListener('click', function() {
        doctorLoginSection.classList.add('hidden');
        doctorSignupSection.classList.remove('hidden');
    });

    doctorLoginToggle.addEventListener('click', function() {
        doctorSignupSection.classList.add('hidden');
        doctorLoginSection.classList.remove('hidden');
    });

// Function to reset forms
function resetForms() {
    // Reset patient login and signup forms
    document.getElementById('patientLoginForm').reset();
    document.getElementById('patientSignupForm').reset();

    // Reset doctor login and signup forms
    document.getElementById('doctorLoginForm').reset();
    document.getElementById('doctorSignupForm').reset();
}

// Function to handle login
function handleLogin(formId, userType) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(form);
            formData.append('userType', userType);

            const actionURL = userType === 'patients' ? 'login_patient.php' : 'login_doctor.php';

            fetch(actionURL, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert('Login successful'); // Placeholder for notification
                    redirectToDashboard(userType); 
                } else {
                    alert('Login failed: ' + data.message); // Placeholder for notification
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred'); // Placeholder for notification
            });
        });
    }
}

// Function to redirect to the appropriate dashboard after login
function redirectToDashboard(userType) {
    if (userType === 'patients') {
        window.location.href = 'user.html'; // Redirect to patient profile page
    } else if (userType === 'doctors') {
        window.location.href = 'doctor.html'; // Redirect to doctor profile page
    }
}


    // Function to handle signup
function handleSignup(formId, userType) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(form);

            // Determine the appropriate action URL based on user type
            const actionURL = userType === 'patients' ? 'register_patient.php' : 'register_doctor.php';

            fetch(actionURL, {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                if (data.trim() === "Signup successful") {
                    alert('Signup successful'); // Placeholder for notification

                    // Redirect to index.html and open the appropriate login section
                    if (userType === 'patients') {
                        window.location.href = 'index.html#patientLoginSection';
                    } else {
                        window.location.href = 'index.html#doctorLoginSection';
                    }
                } else {
                    alert('Signup failed: ' + data); // Placeholder for notification
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred'); // Placeholder for notification
            });
        });
    }
}


    // Initialize form handlers
    handleSignup('patientSignupForm', 'patients');
    handleLogin('patientLoginForm', 'patients');
    handleSignup('doctorSignupForm', 'doctors');
    handleLogin('doctorLoginForm', 'doctors');
});
