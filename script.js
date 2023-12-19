const UserTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const usercontainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userinfocontainer=document.querySelector(".user-info-container");

let currentTab=UserTab;
const API_KEY="664325ff2e2f47addf9bba8dcdbc9f1e";
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active")){
        userinfocontainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        userinfocontainer.classList.remove("active");
        getFromSessionStorage();
    }
    }
}

function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
      const {lat, lon} = coordinates;
      grantAccessContainer.classList.remove("active");
      loadingScreen.classList.add("active");

      try{
         const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    
         const data=await response.json();
         console.log(data);
         loadingScreen.classList.remove("active");
         const nfound=document.querySelector(".nt-found");
        nfound.classList.remove("active");
         userinfocontainer.classList.add("active");
         renderWeatherInfo(data);
      }
      catch(err){
        loadingScreen.classList.remove("active");
      } 
}

function renderWeatherInfo(weatherInfo){
    console.log('hi');
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-Humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    cityName.innerText=weatherInfo?.name;
    // console.log('hi');
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    // console.log('hi');
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
       
    }
}

function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    } 

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation); 

let searchInput=document.querySelector("[data-SearchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName==="") return;
    else
      fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantAccessContainer.classList.remove('active');

    try{
       const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
       const data=await response.json();
       console.log(data);
       if (data.cod === "404" && data.message === "city not found") {
        // City not found, display the "City Not Found" image
        loadingScreen.classList.remove("active");
        userinfocontainer.classList.remove("active");
        const nfound=document.querySelector(".nt-found");
        nfound.classList.add("active");
    }else{
        const nfound=document.querySelector(".nt-found");
        nfound.classList.remove("active");
        loadingScreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderWeatherInfo(data);
    } 
    }
    catch(err){
       console.log(err);
    //    loadingScreen.classList.remove("active");
    //    userinfocontainer.classList.remove("active");
    //    grantAccessButton.classList.remove("active");
    }
}

UserTab.addEventListener("click", ()=> {
    switchTab(UserTab);
});

searchTab.addEventListener("click", ()=>{
    switchTab(searchTab);
});  