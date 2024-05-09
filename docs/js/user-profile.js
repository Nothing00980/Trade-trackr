document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user details from localStorage
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    // Display user details in the UI
    document.getElementById('username').innerText = username;
    document.getElementById('email').innerText = email;

    // Add event listener to logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        // Clear all localStorage items
        localStorage.clear();
        // Redirect user to the sign-in page
        window.location.href = './../index.html';
    });
});

function goBack(){
    window.location.href = "./../index.html";
}
