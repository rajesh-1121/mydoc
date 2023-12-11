document.addEventListener('DOMContentLoaded', function() {
    // Toggling between Patient and Doctor Sections
    const patientSection = document.getElementById('patientSection');
    const doctorSection = document.getElementById('doctorSection');
    const toPatientSectionBtn = document.getElementById('toPatientSection');
    const toDoctorSectionBtn = document.getElementById('toDoctorSection');

    // Set Patient button as active by default
    toPatientSectionBtn.classList.add('active');

    // Function to toggle active class on buttons
    function toggleActiveClass(button) {
        const buttons = document.querySelectorAll('.toggle-buttons button');
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    // Function to toggle sections
    function toggleSection(button, showSection, hideSection) {
        hideSection.classList.add('hidden');
        showSection.classList.remove('hidden');
        toggleActiveClass(button);
    }

    toPatientSectionBtn.addEventListener('click', function() {
        toggleSection(this, patientSection, doctorSection);
    });

    toDoctorSectionBtn.addEventListener('click', function() {
        toggleSection(this, doctorSection, patientSection);
    });

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
    
    
});
