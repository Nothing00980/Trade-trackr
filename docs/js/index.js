document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('token') !== null;
    const navbarButtons = document.getElementById('profiler');

    if (isLoggedIn) {
        // If user is logged in, display user profile icon
        navbarButtons.innerHTML = '<a class="btn btn-primary display-4" href="/Trade-trackr/user-profile.html">User Profile</a>';
    } else {
        // If user is not logged in, display the Get Started button
        navbarButtons.innerHTML = '<a class="btn btn-primary display-4" href="/Trade-trackr/signin.html">Get Started</a>';
    }
});
