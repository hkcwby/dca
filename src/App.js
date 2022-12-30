import "./App.css";
import { useState, useEffect } from "react";
import axios from "./AxiosSetup";

function App() {
  const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  console.log(apiKey);
  const currency = "USD";
  const endpoints = {
    BTCUSD: `query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=${currency}&apikey=${apiKey}`,
  };

  const [price, setPrice] = useState();
  useEffect(() => {
    async function dataFetch() {
      await axios
        .get(endpoints.BTCUSD)
        .then((response) =>
          console.log(
            response.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
          )
        )
        .catch((error) => console.log(error));
    }
    dataFetch();
  }, []);

  // fetch(
  //   `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol=IBM&interval=15min&slice=year1month1&apikey=${apiKey}`
  // )
  //   .then((response) => response.JSONPARSE)
  //   .then((data) => console.log(data))
  //   .then(console.log("success"));

  return (
    <div className="App">
      <header className="App-header">
        <p>A fun little application exploring the Alpha Vantage API</p>
        <p></p>
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
