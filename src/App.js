import "./App.css";
import { useState, useEffect } from "react";
import axios from "./AxiosSetup";

function App() {
  const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  const currency = "USD";
  const endpoints = {
    current: `query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=${currency}&apikey=${apiKey}`,
    daily: `query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=${currency}&apikey=${apiKey}&outputsize=compact`,
    weekly: `query?function=DIGITAL_CURRENCY_WEEKLY&symbol=BTC&market=${currency}&apikey=${apiKey}&outputsize=compact`,
    monthly: `query?function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=${currency}&apikey=${apiKey}&outputsize=compact`,
  };
  const [loading, setLoading] = useState(true);
  //the current price
  const [price, setPrice] = useState(0);

  //daily price variables
  // const [day, setDay] = useState();
  const [dayPrices, setDayPrices] = useState({
    "1a. open (USD)": 0,
    "4a. close (USD)": 0,
    "2a. high (USD)": 0,
    "3a. low (USD)": 0,
  });
  const [days, setDays] = useState([0]);
  const [dailyPriceData, setDailyPriceData] = useState({});

  //weekly price variables
  // const [week, setWeek] = useState();
  const [weekPrices, setWeekPrices] = useState({
    "1a. open (USD)": 0,
    "4a. close (USD)": 0,
    "2a. high (USD)": 0,
    "3a. low (USD)": 0,
  });
  const [weeks, setWeeks] = useState([0]);
  const [weeklyPriceData, setWeeklyPriceData] = useState({});

  //monthly price variables
  // const [month, setMonth] = useState();
  const [monthPrices, setMonthPrices] = useState({
    "1a. open (USD)": 0,
    "4a. close (USD)": 0,
    "2a. high (USD)": 0,
    "3a. low (USD)": 0,
  });
  const [months, setMonths] = useState([0]);
  const [monthlyPriceData, setMonthlyPriceData] = useState({});

  useEffect(() => {
    async function dataFetchCurrent() {
      await axios
        .get(endpoints.current)
        .then((response) => {
          setPrice(
            response.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
          );
        })
        .then(console.log("Success!", "This is price useState", price))
        .catch((error) => {
          console.log(error);
          console.log("current price not retrieved");
        });
    }

    async function dataFetchDaily() {
      // setLoading(true);
      const data = await axios
        .get(endpoints.daily)
        .then((response) => {
          const data = response.data["Time Series (Digital Currency Daily)"];
          console.log("this is data", data);
          setDailyPriceData(data);
          setDays(Object.keys(data));
          setDayPrices(data[Object.keys(data)[0]]);
        })
        .then(setLoading(false))
        .catch((error) => {
          setLoading(true);
          console.log("this is the error", error);
          console.log("daily prices not retrieved");
        });
    }

    async function dataFetchWeekly() {
      // setLoading(true);
      const data = await axios
        .get(endpoints.weekly)
        .then((response) => {
          const data = response.data["Time Series (Digital Currency Weekly)"];
          console.log("this is data", data);
          setWeeklyPriceData(data);
          setWeeks(Object.keys(data));
          setWeekPrices(data[Object.keys(data)[0]]);
        })
        .then(setLoading(false))
        .catch((error) => {
          setLoading(true);
          console.log("this is the error", error);
          console.log("weekly prices not retrieved");
        });
    }

    async function dataFetchMonthly() {
      // setLoading(true);
      const data = await axios
        .get(endpoints.monthly)
        .then((response) => {
          const data = response.data["Time Series (Digital Currency Monthly)"];
          console.log("this is data", data);
          setMonthlyPriceData(data);
          setMonths(Object.keys(data));
          setMonthPrices(data[Object.keys(data)[0]]);
        })
        .then(setLoading(false))
        .catch((error) => {
          setLoading(true);
          console.log("this is the error", error);
          console.log("monthly prices not retrieved");
        });
    }
    // dataFetchCurrent();
    dataFetchDaily();
    // dataFetchWeekly();
    // dataFetchMonthly();
  }, []);

  if (loading)
    return (
      <div className="App">
        <header className="App-header">
          <p>A fun little application exploring the Alpha Vantage API</p>
          <p>LOADING . . . </p>
          <a
            className="App-link"
            href="https://www.alphavantage.co/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Check out the API here
          </a>
        </header>
      </div>
    );
  return (
    <div className="App">
      <header className="App-header">
        <p>A fun little application exploring the Alpha Vantage API</p>
        <p>${Math.round(price)}</p>
        <span>Date:{days[0]}</span>
        <span>Open:${Math.round(dayPrices["1a. open (USD)"])}</span>
        <span>Close:${Math.round(dayPrices["4a. close (USD)"])}</span>
        <span>High:${Math.round(dayPrices["2a. high (USD)"])}</span>
        <span>Low:${Math.round(dayPrices["3a. low (USD)"])}</span>
        <a
          className="App-link"
          href="https://www.alphavantage.co/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check out the API here
        </a>
      </header>
    </div>
  );
}

export default App;
