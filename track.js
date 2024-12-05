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
      console.log(result)
  
      // Extract relevant information from the API response
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
  
  // Function to set a cookie with an expiration date
  function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; Secure; SameSite=Strict`;
  }
  
  // Function to retrieve a cookie by name
  function getCookie(name) {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
  
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
        return cookie.substring(nameEQ.length);
      }
    }
    return null;
  }
  
  // Function to generate a unique user ID and store it in a cookie
  function generateUniqueUserID() {
    const cookieName = 'uniqueUserID';
    const existingUserID = getCookie(cookieName);
  
    if (existingUserID) return existingUserID;
  
    const uniqueID = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    setCookie(cookieName, uniqueID, 365); // Expires in 365 days
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
  
  // Function to send user data to the server
  async function postUserDataToServer(userData) {
    console.log(userData);
    // try {

    //    
    //   const response = await fetch('http://localhost:5006/api/v2/visitors', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(userData),
    //   });
  
    //   if (!response.ok) {
    //     throw new Error('Failed to post user data to server');
    //   }
    //   const responseData = await response.json();
    //   console.log('Data posted successfully:', responseData);
    // } catch (error) {
    //   console.error('Error posting data to server:', error);
    // }
  }
  
  // Function to initialize all tracking on page load
  async function initializeOnPageLoad() {
    try {
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
        userAgent: navigator.userAgent,
      };
  
      // Set user data in cookies
      setCookie('userTracking', JSON.stringify(userData), 365);
  
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
  