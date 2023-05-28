import React, { useState, useEffect } from "react";
import moment from "moment";
import "./App.scss";
import BarLoader from "react-spinners/BarLoader";
import { FaSearch, FaTrash } from "react-icons/fa";

const override = {
    display: "block",
    margin: "50vh auto",
    alignItems: "center",
    justifyContent: "center",
};

function App() {
    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (searched && city && country) {
            const fetchData = async () => {
                setLoading(true);
                setError(null);

                fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=22d965a266f7666e1d9f5621156c26d7&units=metric`
                )
                    .then((response) => response.json())
                    .then((data) => {
                        setWeatherData([data]);
                        setSearchHistory((prevHistory) => [
                            {
                                query: `${city}, ${country}`,
                                timestamp: moment().format("D-MM-YYYY,h:mm a"),
                            },
                            ...prevHistory.slice(0, 6),
                        ]);
                    })
                    .catch((error) => {
                        setError(error.message);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            };
            fetchData();
        }
        setSearched(false);
    }, [searched, city, country]);

    const handleSearch = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newCity = formData.get("city");
        const newCountry = formData.get("country");
        setCity(newCity);
        setCountry(newCountry);
        setSearched(true);
    };

    const handleDelete = (index) => {
        setSearchHistory((prevHistory) => [
            ...prevHistory.slice(0, index),
            ...prevHistory.slice(index + 1),
        ]);
    };

    return (
        <div>
            <form className="search-form" onSubmit={handleSearch}>
                <div className="search-container">
                    <label className="search-label">City</label>
                    <input type="text" name="city" />
                </div>
                <div className="search-container">
                    <label className="search-label">Country</label>
                    <input type="text" name="country" />
                </div>
                <button type="submit">
                    <FaSearch />
                </button>
            </form>

            {loading ? (
                <div className="loader">
                    <BarLoader
                        color={"blue"}
                        loading={true}
                        cssOverride={override}
                        height={4}
                        width={500}
                    />
                </div>
            ) : error ? (
                <div className="error">
                    <p>{error}</p>
                </div>
            ) : (
                <div className="weather-container">
                    {weatherData.map((data, index) => (
                        <div
                            key={index}
                            className={`weather weather-${data.weather[0].main.toLowerCase()}`}
                        >
                            <p className="today-text">Today's Weather</p>
                            <p className="temperature-font">
                                {Math.round(data.main.temp)}&deg;C
                            </p>
                            <div className="search-extra">
                                <p className="search-name">
                                    <strong>
                                        {data.name}, {data.sys.country}
                                    </strong>
                                </p>
                                <p className="search-time">
                                    {moment().format("D-MM-YYYY,h:mm a")}
                                </p>
                                <p>Humidity: {data.main.humidity}%</p>
                                <p>{data.weather[0].main}</p>
                            </div>
                        </div>
                    ))}
                    {searchHistory.length > 0 && (
                        <div className="search-history">
                            <h2>Search History</h2>
                            <ul>
                                {searchHistory.map((entry, index) => (
                                    <li
                                        key={index}
                                        className="history-container"
                                    >
                                        <div className="history-left">
                                            <p className="history-query">
                                                {entry.query}
                                            </p>
                                            <p className="history-timestamp">
                                                {entry.timestamp}
                                            </p>
                                        </div>
                                        <div className="history-right">
                                            <button
                                                className="history-button"
                                                onClick={() => {
                                                    setCity(
                                                        entry.query.split(
                                                            ","
                                                        )[0]
                                                    );
                                                    setCountry(
                                                        entry.query.split(
                                                            ","
                                                        )[1]
                                                    );
                                                    setSearched(true);
                                                }}
                                            >
                                                <FaSearch />
                                            </button>
                                            <button
                                                className="history-button"
                                                onClick={() =>
                                                    handleDelete(index)
                                                }
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
