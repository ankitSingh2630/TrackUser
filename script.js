const showDetails=document.querySelector(".showDetails");
const fullAddress=document.querySelector(".fullAddress");
const formattedAddress=document.querySelector(".formattedAddress");

let apiEndPoint="https://api.opencagedata.com/geocode/v1/json";
let apiKey="6e7a527e91c74cf7aeab792a3573c087"

  // Utility function to set cookies
const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

// api to get user address
const getUserCurrentAddress=async (latitude,longitude)=>{
    console.log(latitude)
    let  query=`${latitude},${longitude}`;
    let apiUrl=`${apiEndPoint}?key=${apiKey}&q=${query}&pretty=1`;
    
    try {
        const res=await fetch(apiUrl);
        const data=await res.json();
        console.log(data);
        const{city,state,postcode,country}=data.results[0].components;
        fullAddress.textContent=`User Address: ${city}, ${postcode}, ${state}, ${country}`;
        formattedAddress.textContent=`user full address:${data.results[0].formatted} `;


        // Set data in cookies
        setCookie('city', city, 7);         // Expires in 7 days
        setCookie('state', state, 7);       // Expires in 7 days
        setCookie('postcode', postcode, 7); // Expires in 7 days
        setCookie('country', country, 7);   // Expires in 7 days

        
    } catch (error) {
        
    }
// lat: 19.7514799, lng: 75.7138883}
}
document.addEventListener("DOMContentLoaded", () => {
    const showDetails = document.querySelector(".showDetails");
    const fullAddress = document.querySelector(".fullAddress");
    const formattedAddress = document.querySelector(".formattedAddress");

    const apiEndPoint = "https://api.opencagedata.com/geocode/v1/json";
    const apiKey = "6e7a527e91c74cf7aeab792a3573c087";

    // Utility function to set cookies
    const setCookie = (name, value, days) => {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    };

    // API to get user address
    const getUserCurrentAddress = async (latitude, longitude) => {
        let query = `${latitude},${longitude}`;
        let apiUrl = `${apiEndPoint}?key=${apiKey}&q=${query}&pretty=1`;

        try {
            const res = await fetch(apiUrl);
            const data = await res.json();
            console.log(data);

            const { city, state, postcode, country } = data.results[0].components;
            fullAddress.textContent = `User Address: ${city}, ${postcode}, ${state}, ${country}`;
            formattedAddress.textContent = `User Full Address: ${data.results[0].formatted}`;

            // Set data in cookies
            setCookie("city", city, 7); // Expires in 7 days
            setCookie("state", state, 7); // Expires in 7 days
            setCookie("postcode", postcode, 7); // Expires in 7 days
            setCookie("country", country, 7); // Expires in 7 days
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    // Geolocation logic
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                showDetails.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
                getUserCurrentAddress(latitude, longitude);
            },
            (error) => {
                showDetails.textContent = `Geolocation error: ${error.message}`;
            }
        );
    } else {
        showDetails.textContent = "Geolocation is not supported by this browser.";
    }
});

document.querySelector(".geo-Btn").addEventListener('click',()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
           const{latitude,longitude}=position.coords;

           showDetails.textContent=`the latitude ${latitude} & longitude ${longitude}`;
           
           getUserCurrentAddress(latitude,longitude)

        },
        (error)=>{
            showDetails.textContent=error.message;
        })
    } 
})
