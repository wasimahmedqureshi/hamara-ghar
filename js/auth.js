// Authentication Module

// User credentials (in real app, this would be server-side)
const USERS = {
    'family': 'family123',
    'mom': 'mom123',
    'dad': 'dad123',
    'admin': 'admin123'
};

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    
    // Validate credentials
    if (USERS[username] && USERS[username] === password) {
        // Successful login
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('user', username);
        localStorage.setItem('loginTime', new Date().toISOString());
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Failed login
        errorDiv.textContent = 'Invalid username or password!';
        errorDiv.style.color = '#f56565';
        
        // Clear password field
        document.getElementById('password').value = '';
    }
}

// Check if user is authenticated
function checkAuth() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop();
    
    // Redirect to login if not authenticated
    if (!isLoggedIn && currentPage !== 'login.html' && currentPage !== 'index.html') {
        window.location.href = 'login.html';
        return false;
    }
    
    // Update welcome message if on dashboard
    if (isLoggedIn && currentPage === 'dashboard.html') {
        const user = localStorage.getItem('user');
        const welcomeElement = document.getElementById('welcomeMessage');
        if (welcomeElement) {
            welcomeElement.textContent = `Welcome, ${user}! 👋`;
        }
    }
    
    return true;
}

// Logout function
function logout() {
    // Clear all auth data
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    
    // Clear any cached data
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                caches.delete(cacheName);
            });
        });
    }
    
    // Redirect to login
    window.location.href = 'login.html';
}

// Change password function
function changePassword(oldPassword, newPassword) {
    const username = localStorage.getItem('user');
    
    if (USERS[username] === oldPassword) {
        // In real app, this would update server
        USERS[username] = newPassword;
        alert('Password changed successfully!');
        return true;
    } else {
        alert('Old password is incorrect!');
        return false;
    }
}

// Auto logout after inactivity (30 minutes)
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        alert('You have been logged out due to inactivity.');
        logout();
    }, 30 * 60 * 1000); // 30 minutes
}

// Track user activity
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);

// Check auth on every page load
document.addEventListener('DOMContentLoaded', checkAuth);

// Export functions for use in other files
window.handleLogin = handleLogin;
window.logout = logout;
