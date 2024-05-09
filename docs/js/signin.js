const backendURL = 'http://localhost:80';

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form data
    const formData = new FormData(this);

    // Convert form data to JSON
    const userData = {};
    formData.forEach((value, key) => {
        userData[key] = value;
    });

    // Make POST request to backend server
    fetch(`${backendURL}/auth/user/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle successful response
        if (data.success) {
            alert('Signup successful!');
            window.location.href = './../login.html' // Display success alert
        } else {
            alert(data.error); // Display error alert
        }
    })
    .catch(error => {
        // Handle network or server error
        console.error('Error:', error);
        alert('An error occurred. Please try again later.'); // Display generic error alert
    });
});
