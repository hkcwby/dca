import "./App.css";
import { useState, useEffect } from "react";
import axios from "./AxiosSetup";

function App() {
  const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  const currency = "USD";
  const endpoints = {
    current: `query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=${currency}&apikey=${apiKey}`,
    weekly: `query?function=DIGITAL_CURRENCY_WEEKLY&symbol=BTC&market=${currency}&apikey=${apiKey}&outputsize=compact`,
  };
  const [loading, setLoading] = useState(true);
  //the current price
  const [price, setPrice] = useState(0);
  //intraday variables
  const [day, setDay] = useState();
  const [dayPrice, setDayPrice] = useState();
  //weekly price variables
  const [week, setWeek] = useState();
  const [weekPrices, setWeekPrices] = useState({
    "1a. open (USD)": 0,
    "4a. close (USD)": 0,
    "2a. high (USD)": 0,
    "3a. low (USD)": 0,
  });

  const [weeks, setWeeks] = useState([0]);
  const [weeklyPriceData, setWeeklyPriceData] = useState();

  //monthly price variables
  // const [month, setMonth] = useState();
  // const [monthPrice, setMonthPrice] = useState();
  useEffect(() => {
    async function dataFetchWeekly() {
      await axios
        .get(endpoints.weekly)
        .then((response) => {
          console.log(
            "this response.data",
            response.data["Time Series (Digital Currency Weekly)"]
          );
          let data = response.data;
          console.log("this is data", data);
          setWeeklyPriceData(data["Time Series (Digital Currency Weekly)"]);
          console.log("this is usestate variable", weeklyPriceData);

          let dates = Object.keys(
            response.data["Time Series (Digital Currency Weekly)"]
          );
          setWeeks(dates);
          // console.log("this is weekly data", weeklyPriceData[weeks[0]]);
          setWeekPrices(weeklyPriceData[weeks[0]]);
          console.log("weekly useState", weeklyPriceData[weeks[0]]);
        })
        .then(setLoading(false))
        .catch((error) => {
          console.log(error);
          console.log("weekly prices not retrieved");
        });
    }

    async function dataFetchCurrent() {
      await axios
        .get(endpoints.current)
        .then((response) => {
          setPrice(
            response.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
          );
        })
        .then(console.log("this is price useState", price))
        .catch((error) => {
          console.log(error);
          console.log("current price not retrieved");
        });
    }

    // dataFetchCurrent();
    dataFetchWeekly();
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
        <span>Date:{weeks[0]}</span>
        <span>Open:${Math.round(weekPrices["1a. open (USD)"])}</span>
        <span>Close:${Math.round(weekPrices["4a. close (USD)"])}</span>
        <span>High:${Math.round(weekPrices["2a. high (USD)"])}</span>
        <span>Low:${Math.round(weekPrices["3a. low (USD)"])}</span>
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
