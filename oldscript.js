document.addEventListener("DOMContentLoaded", function() {
    const x = document.getElementById("demo");
  
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
      }
    }
  
    function showPosition(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
  
    //   x.innerHTML = `Latitude: ${latitude}<br>Longitude: ${longitude}`;

      const userAgent = navigator.userAgent;
      console.log(userAgent); 
  
      // Store in cookies
      document.cookie = `latitude=${latitude}; path=/; max-age=3600`; // Cookie expires in 1 hour
      document.cookie = `longitude=${longitude}; path=/; max-age=3600`;
      console.log("Latitude and Longitude stored in cookies.");
    }
  
    function showError(error) {
      if (error.code === 1) {
        x.innerHTML = "User denied the request for Geolocation.";
      } else if (error.code === 2) {
        x.innerHTML = "Location information is unavailable.";
      } else if (error.code === 3) {
        x.innerHTML = "The request to get user location timed out.";
      } else {
        x.innerHTML = "An unknown error occurred.";
      }
    }
  
    // Call getLocation on page load
    getLocation();
  });

  function getQueryParams() {
    const queryParams = new URLSearchParams(window.location.search);
    let params = {};

    queryParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
}

// Function to set cookies for each query parameter
function setCookies(params) {
    for (const [key, value] of Object.entries(params)) {
        // Adding expiration time (1 day) for better testing
        const expires = new Date();
        expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 1 day from now
        document.cookie = `${key}=${value}; path=/; expires=${expires.toUTCString()}`;
    }
}

// Function to get all cookies as an object
function getCookies() {
    const cookies = document.cookie.split('; ');
    let cookieObj = {};

    cookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        cookieObj[name] = value;
        // console.log(cookieObj[name]);
    });

    return cookieObj;
}

// Get query parameters and set them as cookies
const queryParams = getQueryParams();

// Only set cookies if queryParams is not empty
if (Object.keys(queryParams).length > 0) {
    setCookies(queryParams);
}

// Log the cookies after a brief delay to ensure they are set
setTimeout(() => {
    console.log('Cookies:', getCookies());
}, 1000); // Wait for 1 second to ensure cookies are set

  