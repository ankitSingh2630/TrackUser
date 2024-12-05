// Function to fetch the user's public IP address
async function getUserIpAddress() {
  try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
  } catch (error) {
      console.error('Error fetching IP address:', error);
      return null;
  }
}

// Function to fetch city and location data using IP
async function getCityName(ip) {
  const headers = new Headers();
  headers.append("apikey", "wSHNn4fpdECsqTUs9YA2Nv7l9OfPyeXp"); // Replace with a secure way to handle API keys

  const requestOptions = {
      method: 'GET',
      headers,
  };

  try {
      const response = await fetch(`https://api.apilayer.com/ip_to_location/${ip}`, requestOptions);
      const result = await response.json();

      return {
          city: result.city || null,
          country: result.country_name || null,
          region: result.region_name || null,
          latitude: result.latitude || null,
          longitude: result.longitude || null,
      };
  } catch (error) {
      console.error('Error fetching location data:', error);
      return { city: null, country: null, region: null, latitude: null, longitude: null };
  }
}

// Function to set cookies for each query parameter
function setCookies(params) {
  for (const [key, value] of Object.entries(params)) {
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
  });

  return cookieObj;
}

// Function to generate a unique user ID and store it in a cookie
function generateUniqueUserID() {
  const cookieName = 'uniqueUserID';
  const cookies = getCookies();
  const existingUserID = cookies[cookieName];

  if (existingUserID) return existingUserID;

  const uniqueID = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  setCookies({ [cookieName]: uniqueID }); // Store unique user ID in cookies
  return uniqueID;
}

// Function to get the user's device information
function getUserDeviceInfo() {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTablet = /Tablet|iPad/i.test(navigator.userAgent);

  return {
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      deviceType: isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop',
  };
}

// Function to determine the traffic source
function getTrafficSource() {
  return document.referrer && document.referrer !== window.location.href
      ? 'Referral'
      : 'Direct Traffic';
}

// Function to fetch URL query parameters
function getQueryParams() {
  const queryParams = new URLSearchParams(window.location.search);
  let params = {};

  queryParams.forEach((value, key) => {
      params[key] = value;
  });

  return params;
}

// Function to send user data to the server
async function postUserDataToServer(userData) {
  console.log(userData);
  // Uncomment the following lines to enable posting to the server
  // try {
  //     const response = await fetch('http://localhost:5006/api/v2/visitors', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(userData),
  //     });

  //     if (!response.ok) {
  //         throw new Error('Failed to post user data to server');
  //     }
  //     const responseData = await response.json();
  //     console.log('Data posted successfully:', responseData);
  // } catch (error) {
  //     console.error('Error posting data to server:', error);
  // }
}

// Function to initialize all tracking on page load
async function initializeOnPageLoad() {
  try {
      // Fetch query parameters and set them as cookies
      const queryParams = getQueryParams();
      setCookies(queryParams);

      // Fetch user's IP and location details
      const userIp = await getUserIpAddress();
      const locationData = userIp ? await getCityName(userIp) : {};

      // Fetch device information
      const deviceInfo = getUserDeviceInfo();

      // Fetch traffic source
      const trafficSource = getTrafficSource();

      // Construct user tracking data
      const userData = {
          userId: generateUniqueUserID(),
          ip: userIp,
          location: locationData,
          device: deviceInfo,
          trafficSource,
          referrer: document.referrer || 'Direct Traffic',
          landingPage: window.location.href,
          queryParams, // Include query parameters
          cookies: getCookies(), // Include all cookies
          userAgent: navigator.userAgent,
      };

      // Post user data to the server
      await postUserDataToServer(userData);

      // Log data for debugging
      console.log('User tracking data initialized:', userData);
  } catch (error) {
      console.error('Error during initialization:', error);
  }
}

// Run the initialization function when the page loads
window.addEventListener('load', initializeOnPageLoad);
