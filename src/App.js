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
  const [day, setDay] = useState();
  const [dayPrice, setDayPrice] = useState();
  const [week, setWeek] = useState();
  const [weekPrice, setWeekPrice] = useState();
  const [monthPrice, setMonthPrice] = useState();

  async function dataFetchWeekly() {
    await axios
      .get(endpoints.weekly)
      .then((response) => {
        console.log(Object.keys(response.data));
        console.log(response.data["Time Series (Digital Currency Weekly)"]);
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
      .then(console.log(price))
      .catch((error) => {
        console.log(error);
        console.log("current price not retrieved");
      });
  }
  useEffect(() => {
    dataFetchWeekly();
    dataFetchCurrent();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>A fun little application exploring the Alpha Vantage API</p>
        <p>${Math.round(price)}</p>
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
