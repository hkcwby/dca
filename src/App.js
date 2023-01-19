import "./App.css";
import { useState, useEffect } from "react";
import axios from "./AxiosSetup";
import PriceExplorer from "./PriceExplorer";
import DCATool from "./DCATool";

function App() {
  //setting up important core values and references
  const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  const [currency, setCurrency] = useState("USD");
  const [panel, setPanel] = useState("PriceExplorer");

  function selectPriceExplorer() {
    console.log("price explorer panel selected");
    setPanel("PriceExplorer");
  }

  function selectDCATool() {
    setPanel("DCATool");
  }

  const currencySymbols = { USD: "$", EUR: "€", CNY: "¥", JPY: "¥" };
  const [marker, setMarker] = useState(currencySymbols.USD);

  function updateCurrency(selection) {
    console.log(selection);
    setCurrency(selection);
    setMarker(currencySymbols[selection]);
    console.log(marker);
  }
  //the various end points used for fetching data
  const endpoints = {
    Current: `query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=${currency}&apikey=${apiKey}`,
    Daily: `query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=${currency}&apikey=${apiKey}&outputsize=compact`,
    Weekly: `query?function=DIGITAL_CURRENCY_WEEKLY&symbol=BTC&market=${currency}&apikey=${apiKey}&outputsize=compact`,
    Monthly: `query?function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=${currency}&apikey=${apiKey}&outputsize=compact`,
  };

  //A boolean to toggle a loading screen whilst data is being fetched
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(true);

  //the values to display, these need to be fetched
  const [menuValues, setMenuValues] = useState(["-"]);

  // function to update the data type and unlock the date time option
  function updateSearchCriteria(selection) {
    console.log("this is selection", selection);
    dataFetch(selection).then(console.log("this is menu values", menuValues));
    document.querySelector("#dateTimeSelect").disabled = false;
  }

  //the current price displayed for refernce
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceData, setPriceData] = useState([]);
  const [prices, setPrices] = useState({
    "1a. open (USD)": 0,
    "4a. close (USD)": 0,
    "2a. high (USD)": 0,
    "3a. low (USD)": 0,
  });

  function updatePrices(selection) {
    console.log("this is price data", priceData);
    console.log("this is the selected date", selection);
    const data = priceData[selection];
    console.log(data);
    setPrices({
      [`1a. open (${currency})`]: data[[`1a. open (${currency})`]],
      [`4a. close (${currency})`]: data[[`4a. close (${currency})`]],
      [`2a. high (${currency})`]: data[[`2a. high (${currency})`]],
      [`3a. low (${currency})`]: data[[`3a. low (${currency})`]],
    });
  }

  async function dataFetch(type) {
    setLoading(true);
    console.log("this is endpoint", endpoints[type]);
    await axios
      .get(endpoints[type])
      .then((response) => {
        console.log("this is response", response);
        console.log(`Time Series (Digital Currency ${type})`);
        const data = response.data[`Time Series (Digital Currency ${type})`];
        console.log("this is data", data);
        setMenuValues(Object.keys(data));
        setPriceData(data);
      })
      .then(setLoading(false))
      .then(console.log(`success ${type}`))
      .catch((error) => {
        console.log("this is the error", error);
        console.log(`${type} prices not retrieved`);
      });
  }

  //run on mount to retrieve the active market price

  useEffect(() => {
    async function dataFetchCurrent() {
      await axios
        .get(
          `query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=${currency}&apikey=${apiKey}`
        )
        .then((response) => {
          setCurrentPrice(
            response.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
          );
        })
        .then(setInitializing(false))
        .catch((error) => {
          console.log(error);
          console.log("current price not retrieved");
        });
    }

    dataFetchCurrent();
  }, [currency, apiKey]);

  if (initializing)
    return (
      <div className="App">
        <div className="App-body">
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
        </div>
      </div>
    );
  return (
    <div className="App">
      <div className="App-body">
        <p>A fun little application exploring the Alpha Vantage API</p>
        <div className="Frame">
          {panel != "PriceExplorer" ? (
            <DCATool />
          ) : (
            <PriceExplorer
              updateCurrency={updateCurrency}
              updateSearchCriteria={updateSearchCriteria}
              updatePrices={updatePrices}
              loading={loading}
              prices={prices}
              marker={marker}
              currentPrice={currentPrice}
              currency={currency}
              menuValues={menuValues}
            />
          )}
          <div className="Menu-bar">
            <div
              className="Menu-option"
              id="Price-explorer-tag"
              onClick={selectPriceExplorer}
            >
              Price Explorer
            </div>
            <div
              className="Menu-option"
              id="DCA-tool-tag"
              onClick={selectDCATool}
            >
              DCA Tool
            </div>
          </div>
        </div>

        <a
          className="App-link"
          href="https://www.alphavantage.co/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check out the API here
        </a>
      </div>
    </div>
  );
}

export default App;
