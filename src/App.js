import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  WiDaySunny,
  WiRain,
  WiSnow,
  WiCloudy,
  WiDayFog,
  WiThunderstorm,
} from "react-icons/wi";
import { css } from "@emotion/react";
import "./App.scss";
import BarLoader from "react-spinners/BarLoader";

const override = {
  display: "block",
  margin: "50vh auto",
  alignItems: "center",
  justifyContent: "center",
};

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather?q=Malaysia&appid=22d965a266f7666e1d9f5621156c26d7&units=metric"
        );
        setWeatherData(response.data);
      } catch (error) {
        setError(error.message);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <BarLoader
          color={"blue"}
          loading={true}
          cssOverride={override}
          height={4}
          width={500}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  return (
    <div
      className={`weather weather-${weatherData.weather[0].main.toLowerCase()}`}
    >
      <h1>Weather App</h1>
      <p>{moment().format("MMMM Do YYYY, h:mm:ss a")}</p>
      <p>
        {weatherData.name}, {weatherData.sys.country}
      </p>
      <p>{Math.round(weatherData.main.temp)}&deg;C</p>
      <p>Feels like: {Math.round(weatherData.main.feels_like)}&deg;C</p>
      <div className="icon">
        {weatherData.weather[0].main === "Clear" && <WiDaySunny />}
        {weatherData.weather[0].main === "Rain" && <WiRain />}
        {weatherData.weather[0].main === "Snow" && <WiSnow />}
        {weatherData.weather[0].main === "Clouds" && <WiCloudy />}
        {weatherData.weather[0].main === "Mist" && <WiDayFog />}
        {weatherData.weather[0].main === "Thunderstorm" && <WiThunderstorm />}
      </div>
    </div>
  );
}

export default App;
