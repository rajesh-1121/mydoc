// Function to fetch and display the user's full name
function fetchAndDisplayUserName() {
    fetch('fetch_user_name.php')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const userName = data.fullName;
            document.getElementById('userInfoName').textContent = `Full Name: ${userName}`;
            // ... other code to update the form if needed ...
        } else {
            console.error('Failed to fetch user name:', data.message);
        }
    })
    .catch(error => console.error('Error fetching user name:', error));
}

function toggleEditMode() {
    // Get all input fields and the select element
    const inputs = document.querySelectorAll('#infoForm input, #infoForm select');
    const isEditable = inputs[0].disabled; // Check if form is currently editable

    // Toggle the disabled property on inputs and select
    inputs.forEach(input => input.disabled = !isEditable);
    document.querySelector('#infoForm select').disabled = !isEditable;

    // Toggle the visibility of the save button
    document.getElementById('saveInfoButton').style.display = isEditable ? 'block' : 'none';
}

function saveUserInfo() {
    // Get the form data
    const form = document.getElementById('infoForm');
    const formData = new FormData(form);

    // Send the form data to the server to update the user info
    fetch('save_user_info.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Information saved successfully!');
            toggleEditMode(); // Turn off edit mode
        } else {
            alert('Failed to save information: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to update the content of the Home section
function updateHomeContent(userName) {
    const homeMessage = `Welcome to MyDoc, ${userName}! Easily book your appointment today!`;
    document.getElementById('dashboardContent').innerHTML = `<h2>${homeMessage}</h2>`;
}


// Function to handle sign out
function signOut() {
    fetch('signout.php')
    .then(response => {
        if (response.ok) {
            window.location.href = 'index.html';
        } else {
            alert('Sign out failed.');
        }
    })
    .catch(error => console.error('Error:', error));
}


// Event listeners for dashboard buttons
document.addEventListener('DOMContentLoaded', function() {

    
    fetchAndDisplayUserName();


    // Event listener for Home button
    document.getElementById('homeBtn').addEventListener('click', function() {
        const userName = document.getElementById('patientFullName').innerText;
        updateHomeContent(userName);
    });

    document.getElementById('infoFormBtn').addEventListener('click', function() {
        // Set the HTML content for the information form
        document.getElementById('dashboardContent').innerHTML = `
            <div id="infoFormContainer">
                <h3 id="userInfoName"><!-- User's Full Name will be loaded here --></h3>
                <button id="editInfoButton">Edit</button>
                <form id="infoForm">
                    <input type="date" name="dob" placeholder="Date of Birth" disabled>
                    <input type="number" name="age" placeholder="Age" disabled>
                    <select name="gender" disabled>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <input type="text" name="city" placeholder="City" disabled>
                    <input type="text" name="state" placeholder="State" disabled>
                    <input type="text" name="country" placeholder="Country" disabled>
                    <select name="previousHealthIssue" disabled>
                        <option value="none">No, I don't have any previous health issues</option>
                        <option value="haveIssues">Yes, I have health issues</option>
                        <option value="noAnswer">Prefer not to answer</option>
                    </select>
                    <input type="submit" id="saveInfoButton" value="Save" style="display: none;">
                </form>
            </div>
        `;
    
        // Load user's full name from the patients table
        fetchAndDisplayUserName();
    
        // Initialize edit mode functionality
        document.getElementById('editInfoButton').addEventListener('click', toggleEditMode);
    
        // Initialize save functionality
        document.getElementById('infoForm').addEventListener('submit', function(event) {
            event.preventDefault();
            saveUserInfo();
        });
    });
    

    document.getElementById('appointmentsBtn').addEventListener('click', function() {
        // HTML for booking an appointment
        document.getElementById('dashboardContent').innerHTML = `
            <button id="bookAppointmentBtn" style="display: none;">Book an Appointment</button>
            <div id="appointmentFormContainer" style="display:none;">
            <form id="appointmentForm">
            <label for="appointmentDate">Choose Date:</label>
            <input type="date" id="appointmentDate" name="date" required>

            <label for="timeSlot">Choose Time Slot:</label>
            <select id="timeSlot" name="timeSlot" required>
                <!-- Time slots will be populated here -->
            </select>

            <label for="reason">Reason for Appointment:</label>
            <select id="reason" name="reason" required>
                <option value="mental">Mental Illness</option>
                <option value="physical">Physical Illness</option>
                <option value="allergy">Allergy</option>
            </select>

            <label for="type">Appointment Type:</label>
            <select id="type" name="type" required>
                <option value="zoom">Zoom</option>
                <option value="offline">Offline</option>
            </select>

            <button type="submit">Submit</button>
        </form>
            </div>
            <div id="bookedAppointments"></div>
        `;
    
        // Load available time slots for the chosen date
        document.getElementById('appointmentDate').addEventListener('change', function() {
            loadAvailableTimeSlots(this.value);
        });
    
        // Handle form submission
        document.getElementById('appointmentForm').addEventListener('submit', function(event) {
            event.preventDefault();
            bookAppointment();
        });
        
    
        // Load booked appointments
        loadBookedAppointments();
        // Event listener for the dynamic "Book an Appointment" button
        document.getElementById('bookAppointmentBtn').addEventListener('click', function() {
            // Show the form when the button is clicked
            document.getElementById('appointmentFormContainer').style.display = 'block';
            this.style.display = 'none';
        });
    });
    
    function loadAvailableTimeSlots(date) {
        fetch('get_available_time_slots.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'date=' + date
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const timeSlotSelect = document.getElementById('timeSlot');
                timeSlotSelect.innerHTML = ''; // Clear existing options
    
                data.timeSlots.forEach(slot => {
                    const option = document.createElement('option');
                    option.value = slot;
                    option.textContent = slot;
                    timeSlotSelect.appendChild(option);
                });
            } else {
                alert('Failed to load time slots: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Sign out button
    document.getElementById('signOutBtn').addEventListener('click', signOut);
});


//functions//////////////////////////////////////////

function loadInformationForm() {
    // Set the HTML content for the information form
    document.getElementById('dashboardContent').innerHTML = `
        <div id="infoFormContainer">
            <h3 id="userInfoName"><!-- User's Full Name will be loaded here --></h3>
            <button id="editInfoButton">Edit</button>
            <form id="infoForm">
                <input type="date" name="dob" placeholder="Date of Birth" disabled>
                <input type="number" name="age" placeholder="Age" disabled>
                <select name="gender" disabled>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <input type="text" name="city" placeholder="City" disabled>
                <input type="text" name="state" placeholder="State" disabled>
                <input type="text" name="country" placeholder="Country" disabled>
                <select name="previousHealthIssue" disabled>
                    <option value="none">No, I don't have any previous health issues</option>
                    <option value="haveIssues">Yes, I have health issues</option>
                    <option value="noAnswer">Prefer not to answer</option>
                </select>
                <input type="submit" id="saveInfoButton" value="Save" style="display: none;">
            </form>
        </div>
    `;

    // Fetch user's full name and other information from the database
    // This function must be defined elsewhere in your code.
    fetchAndDisplayUserInfo();

    // Initialize edit mode functionality
    document.getElementById('editInfoButton').addEventListener('click', toggleEditMode);

    // Initialize save functionality
    document.getElementById('infoForm').addEventListener('submit', function(event) {
        event.preventDefault();
        saveUserInfo();
    });
}

// Function to fetch and display user information in the form
function fetchAndDisplayUserInfo() {
    fetch('get_user_info.php') // This PHP script should return the user's information
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Populate the form with the fetched data
            const form = document.getElementById('infoForm');
            form['dob'].value = data.userInfo.dob;
            form['age'].value = data.userInfo.age;
            form['gender'].value = data.userInfo.gender;
            form['city'].value = data.userInfo.city;
            form['state'].value = data.userInfo.state;
            form['country'].value = data.userInfo.country;
            form['previousHealthIssue'].value = data.userInfo.previousHealthIssue;

            // Display the user's name
            document.getElementById('userInfoName').textContent = `Full Name: ${data.userInfo.name}`;
        } else {
            console.error('Failed to fetch user information:', data.message);
        }
    })
    .catch(error => console.error('Error fetching user information:', error));
}


function bookAppointment() {
    // Get the form data and send it to the server
    const formData = new FormData(document.getElementById('appointmentForm'));

    fetch('book_appointment.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Appointment booked successfully!');
            loadBookedAppointments(); // Reload booked appointments
        } else {
            alert('Failed to book appointment: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function loadBookedAppointments() {
    // Check if there's a booked appointment and set the button/form visibility
    fetch('get_booked_appointments.php', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const appointmentFormContainer = document.getElementById('appointmentFormContainer');
        const bookAppointmentButton = document.getElementById('bookAppointmentBtn');
        const bookedAppointmentsDiv = document.getElementById('bookedAppointments');

        // If an appointment is booked, hide the button and show the appointment
        if (data.status === 'success' && data.appointments.length > 0) {
            appointmentFormContainer.style.display = 'none';
            bookAppointmentButton.style.display = 'none';
            bookedAppointmentsDiv.innerHTML = '<h3>Your Booked Appointments:</h3>';

            // Display each booked appointment
            data.appointments.forEach(appointment => {
                const appointmentInfo = document.createElement('div');
                appointmentInfo.innerHTML = `
                    <p>Date: ${appointment.date}</p>
                    <p>Time Slot: ${appointment.timeSlot}</p>
                    <p>Type: ${appointment.type}</p>
                    <p>Reason: ${appointment.reason}</p>
                    ${appointment.type === 'zoom' ? `<p>Zoom Link: ${appointment.zoomLink}</p>` : ''}
                    <button onclick="cancelAppointment(${appointment.id})">Cancel</button>
                `;
                bookedAppointmentsDiv.appendChild(appointmentInfo);
            });
        } else {
            // No booked appointment, show the button
            bookAppointmentButton.style.display = 'block';
            bookedAppointmentsDiv.innerHTML = ''; // Clear any previous appointments
        }
    })
    .catch(error => console.error('Error:', error));
}

function cancelAppointment(appointmentId) {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
        return; // Do nothing if the user cancels the action
    }

    fetch('cancel_appointment.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'appointmentId=' + appointmentId
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Appointment cancelled successfully.');
            loadBookedAppointments(); // Refresh the list of appointments
        } else {
            alert('Failed to cancel appointment: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while trying to cancel the appointment.');
    });
}