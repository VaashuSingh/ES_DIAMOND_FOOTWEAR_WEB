// Function to clear token from local storage
const clearToken = () => {
  sessionStorage.removeItem("token");
};

// Listen for beforeunload event to clear token on tab close or page refresh
window.addEventListener("beforeunload", clearToken);

// Function to logout user after a period of inactivity
const logoutAfterInactivity = () => {
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  let inactivityTimer;

  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      clearToken();
      // Redirect to logout page or display a message
      // window.location.href = "/logout";
    }, INACTIVITY_TIMEOUT);
  };

  // Reset timer on user activity
  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("keydown", resetTimer);

  // Initialize timer on page load
  resetTimer();
};

// Call logoutAfterInactivity function after login
logoutAfterInactivity();
