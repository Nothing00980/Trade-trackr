const backendURL = 'https://user-data-management-backend.vercel.app';

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form data
    const formData = new FormData(this);

    // Convert form data to JSON
    const loginData = {};
    formData.forEach((value, key) => {
        loginData[key] = value;
    });

    // Make POST request to backend server
    fetch(`${backendURL}/auth/user/login`, { // Use the backend URL variable here
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
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
            // Store user details and token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.userDetails.username);
            localStorage.setItem('email', data.userDetails.email);
            // Redirect user to dashboard or home page
            window.location.href = '/Trade-trackr/user-profile.html'; // Redirect to dashboard page
        } else {
            alert(data.message); // Display error alert
        }
    })
    .catch(error => {
        // Handle network or server error
        console.error('Error:', error);
        alert('An error occurred. Please try again later.'); // Display generic error alert
    });
});
