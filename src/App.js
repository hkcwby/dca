import "./App.css";
import { useState, useEffect } from "react";
import axios from "./AxiosSetup";

function App() {
  const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  const currency = "USD";
  const endpoints = {
    current: `query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=${currency}&apikey=${apiKey}`,
    weekly: `query?function=DIGITAL_CURRENCY_WEEKLY&symbol=BTC&market=${currency}&apikey=${apiKey}`,
  };
  //the current price
  const [price, setPrice] = useState(0);
  //intraday variables
  const [day, setDay] = useState();
  const [dayPrice, setDayPrice] = useState();
  //weekly price variables
  const [week, setWeek] = useState();
  const [weekPrices, setWeekPrices] = useState();
  const [weeks, setWeeks] = useState();
  const [weeklyPriceData, setWeeklyPriceData] = useState();

  //monthly price variables
  const [month, setMonth] = useState();
  const [monthPrice, setMonthPrice] = useState();

  async function dataFetchWeekly() {
    await axios
      .get(endpoints.weekly)
      .then((response) => {
        setWeeklyPriceData(
          response.data["Time Series (Digital Currency Weekly)"]
        );
        let dates = Object.keys(
          response.data["Time Series (Digital Currency Weekly)"]
        );
        setWeeks(dates);
        //console.log("this is weekly data", weeklyPriceData[weeks[0]]);
        setWeekPrices(weeklyPriceData[weeks[0]]);
        console.log("weekly useState", weeklyPriceData[weeks[0]]);
      })
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

  useEffect(() => {
    dataFetchCurrent();
    dataFetchWeekly();
  }, []);

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
