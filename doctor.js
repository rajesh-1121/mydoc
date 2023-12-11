document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch and display the doctor's name
    function fetchAndDisplayDoctorName() {
        fetch('fetch_doctor_name.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('username').textContent = data.doctorName;
                updateHomeContent(data.doctorName); // Update home content with doctor's name
            } else {
                console.error('Failed to fetch doctor name:', data.message);
            }
        })
        .catch(error => console.error('Error fetching doctor name:', error));
    }

    // Function to update the home content
    function updateHomeContent(doctorName) {
        const homeMessage = `Welcome, Dr. ${doctorName}!`;
        document.getElementById('dashboardContent').innerHTML = `<h2>${homeMessage}</h2>`;
    }

 // Function to load and display appointments
function loadAppointments() {
    fetch('get_appointments.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        const appointmentsDiv = document.getElementById('dashboardContent');
        if (data.status === 'success') {
            // Check and display active appointments
            if (Array.isArray(data.activeAppointments) && data.activeAppointments.length > 0) {
                appointmentsDiv.innerHTML = '<h2>Active Appointments:</h2>';
                data.activeAppointments.forEach(appointment => {
                    const appointmentElement = createAppointmentElement(appointment);
                    appointmentsDiv.appendChild(appointmentElement);
                });
            } else {
                appointmentsDiv.innerHTML = '<h2>No Active Appointments</h2>';
            }

            // Add divider for appointment history
            const historyDivider = document.createElement('h3');
            historyDivider.textContent = 'Appointment History:';
            appointmentsDiv.appendChild(historyDivider);

            // Check and display appointment history
            if (Array.isArray(data.appointmentHistory) && data.appointmentHistory.length > 0) {
                data.appointmentHistory.forEach(appointment => {
                    const historyElement = createAppointmentElement(appointment, true);
                    appointmentsDiv.appendChild(historyElement);
                });
            } else {
                const noHistoryMsg = document.createElement('p');
                noHistoryMsg.textContent = 'No appointment history.';
                appointmentsDiv.appendChild(noHistoryMsg);
            }
        } else {
            throw new Error(data.message);
        }
    })
    .catch(error => {
        console.error('Error loading appointments:', error);
        document.getElementById('dashboardContent').innerHTML = `<p>Error loading appointments: ${error.message}</p>`;
    });
}

function createAppointmentElement(appointment, isHistory = false) {
    const appointmentElement = document.createElement('div');
    appointmentElement.classList.add(isHistory ? 'appointment-history' : 'appointment');
    appointmentElement.innerHTML = `
        <p>Date: ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
        <p>Time: ${appointment.time_slot}</p>
        <p>Patient ID: ${appointment.patient_id}</p>
        <p>Reason: ${appointment.reason}</p>
        <p>Type: ${appointment.appointment_type}</p>
        ${appointment.zoom_link ? `<p>Zoom Link: <a href="${appointment.zoom_link}" target="_blank">Join Meeting</a></p>` : ''}
        ${isHistory ? '' : '<button onclick="cancelAppointment(' + appointment.id + ')">Cancel</button>'}
    `;

    // Adding a line divider for history
    if (isHistory) {
        const divider = document.createElement('hr');
        appointmentElement.appendChild(divider);
    }

    return appointmentElement;
}

// Function to cancel an appointment
function cancelAppointment(appointmentId) {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
        return; // Do nothing if the user cancels the action
    }

    fetch('cancel_appointment_doctor.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `appointmentId=${appointmentId}`
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            alert('Appointment cancelled successfully.');
            loadAppointments(); // Refresh appointments display
        } else {
            alert(`Failed to cancel appointment: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`An error occurred while trying to cancel the appointment: ${error.message}`);
    });
}


    // Function to handle logout
    function logout() {
        fetch('logout_doctor.php')
        .then(response => {
            if (response.ok) {
                window.location.href = 'index.html';
            } else {
                alert('Logout failed.');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Event listeners
    document.getElementById('homeBtn').addEventListener('click', function() {
        fetchAndDisplayDoctorName();
    });

    document.getElementById('manageAppointmentsBtn').addEventListener('click', loadAppointments);

    // Add logout button
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
    logoutButton.classList.add('menu-button', 'sign-out-button');
    logoutButton.addEventListener('click', logout);
    document.querySelector('.left-section').appendChild(logoutButton);

    // Fetch and display doctor name on load
    fetchAndDisplayDoctorName();
});

