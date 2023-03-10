import "./App.css";
import { useState, useEffect } from "react";
import axios from "./AxiosSetup";
import PriceExplorer from "./StructureComponents/PriceExplorer";
import DCATool from "./StructureComponents/DCATool";
import BTDTool from "./StructureComponents/BTDTool";
import YOLOTool from "./StructureComponents/YOLOTool";
import Settings from "./StructureComponents/Settings";
import DayAnalysis from "./StructureComponents/DayAnalysis";

function App() {
  //setting up reference API Key
  const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  //variable and a function to allow users to insert their own API Key on the settings tab
  const [userAPIKey, setUserAPIKEY] = useState("");
  function updateAPIKEY(value) {
    setUserAPIKEY(value);
  }

  //assign the currency to be used in the API call and the appropriate symbols to be used in the display
  const [currency, setCurrency] = useState("USD");
  const currencySymbols = { USD: "$", EUR: "€", CNY: "¥", JPY: "¥" };
  const [marker, setMarker] = useState(currencySymbols.USD);

  function updateCurrency(selection) {
    setCurrency(selection);
    setMarker(currencySymbols[selection]);
  }
  //the various end points used for fetching data
  const endpoints = {
    Current: `query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=${currency}&apikey=${
      userAPIKey ? userAPIKey : apiKey
    }`,
    Daily: `query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=${currency}&apikey=${
      userAPIKey ? userAPIKey : apiKey
    }`,
    Weekly: `query?function=DIGITAL_CURRENCY_WEEKLY&symbol=BTC&market=${currency}&apikey=${
      userAPIKey ? userAPIKey : apiKey
    }`,
    Monthly: `query?function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=${currency}&apikey=${
      userAPIKey ? userAPIKey : apiKey
    }`,
  };

  //A boolean to toggle a loading screen whilst data is being fetched
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(true);

  //the values to display, these need to be fetched
  const [menuValues, setMenuValues] = useState(["-"]);

  //the current price displayed for reference for the explorer
  const [currentPrice, setCurrentPrice] = useState(0);
  //raw price data from fetch call
  const [priceData, setPriceData] = useState([]);
  //the particular price data for the explorer
  const [prices, setPrices] = useState({
    "1a. open (USD)": 0,
    "4a. close (USD)": 0,
    "2a. high (USD)": 0,
    "3a. low (USD)": 0,
  });
  //function takes raw price data and the selected date and populates price variables
  function updatePrices(selection) {
    const data = priceData[selection];
    setPrices({
      [`1a. open (${currency})`]: data[[`1a. open (${currency})`]],
      [`4a. close (${currency})`]: data[[`4a. close (${currency})`]],
      [`2a. high (${currency})`]: data[[`2a. high (${currency})`]],
      [`3a. low (${currency})`]: data[[`3a. low (${currency})`]],
    });
  }

  //a variable to track the desired view to be displayed
  const [panel, setPanel] = useState("PriceExplorer");
  //functions to reassign the view to the appropriate selection and highlight the appropriate tab in the selection menu
  function selectPriceExplorer() {
    setPrices({
      "1a. open (USD)": 0,
      "4a. close (USD)": 0,
      "2a. high (USD)": 0,
      "3a. low (USD)": 0,
    });
    setPanel("PriceExplorer");
    document
      .querySelectorAll(".Menu-option")
      .forEach((item) => item.classList.remove("Menu-selected"));
    document
      .querySelector("#Price-explorer-tag")
      .classList.add("Menu-selected");
  }

  function selectDCATool() {
    setPanel("DCATool");
    document
      .querySelectorAll(".Menu-option")
      .forEach((item) => item.classList.remove("Menu-selected"));
    document.querySelector("#DCA-tool-tag").classList.add("Menu-selected");
  }

  function selectBTDTool() {
    setPanel("BTDTool");
    document
      .querySelectorAll(".Menu-option")
      .forEach((item) => item.classList.remove("Menu-selected"));
    document.querySelector("#BTD-tool-tag").classList.add("Menu-selected");
  }

  function selectYOLOTool() {
    setPanel("YOLOTool");
    document
      .querySelectorAll(".Menu-option")
      .forEach((item) => item.classList.remove("Menu-selected"));
    document.querySelector("#YOLO-tool-tag").classList.add("Menu-selected");
  }

  function selectDayAnalysis() {
    setPanel("DayAnalysis");
    document
      .querySelectorAll(".Menu-option")
      .forEach((item) => item.classList.remove("Menu-selected"));
    document.querySelector("#Day-analysis-tag").classList.add("Menu-selected");
  }

  function selectSettings() {
    setPanel("Settings");
    document
      .querySelectorAll(".Menu-option")
      .forEach((item) => item.classList.remove("Menu-selected"));
    document.querySelector("#Settings-tag").classList.add("Menu-selected");
  }

  //function that gathers raw data from the API
  async function dataFetch(type) {
    setLoading(true);
    await axios
      .get(endpoints[type])
      .then((response) => {
        const data = response.data[`Time Series (Digital Currency ${type})`];
        console.log(endpoints[type]);
        setMenuValues(Object.keys(data).slice(1));
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
  }, [currency]);

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
          {panel === "DCATool" ? (
            <DCATool
              updateCurrency={updateCurrency}
              dataFetch={dataFetch}
              updatePrices={updatePrices}
              marker={marker}
              currentPrice={currentPrice}
              menuValues={menuValues}
              priceData={priceData}
              currency={currency}
            />
          ) : panel === "BTDTool" ? (
            <BTDTool
              updateCurrency={updateCurrency}
              dataFetch={dataFetch}
              updatePrices={updatePrices}
              marker={marker}
              currentPrice={currentPrice}
              menuValues={menuValues}
              priceData={priceData}
              currency={currency}
            />
          ) : panel === "YOLOTool" ? (
            <YOLOTool
              updateCurrency={updateCurrency}
              dataFetch={dataFetch}
              updatePrices={updatePrices}
              marker={marker}
              currentPrice={currentPrice}
              menuValues={menuValues}
              priceData={priceData}
              currency={currency}
            />
          ) : panel === "PriceExplorer" ? (
            <PriceExplorer
              updateCurrency={updateCurrency}
              dataFetch={dataFetch}
              updatePrices={updatePrices}
              loading={loading}
              prices={prices}
              marker={marker}
              currentPrice={currentPrice}
              currency={currency}
              menuValues={menuValues}
            />
          ) : panel === "Settings" ? (
            <Settings updateAPIKEY={updateAPIKEY} />
          ) : (
            <DayAnalysis
              apiKey={apiKey}
              userAPIKey={userAPIKey}
              currency={currency}
            />
          )}
          <div className="Menu-bar">
            <div
              className="Menu-option Menu-selected"
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
              DCA
            </div>
            <div
              className="Menu-option"
              id="BTD-tool-tag"
              onClick={selectBTDTool}
            >
              BTD
            </div>
            <div
              className="Menu-option"
              id="YOLO-tool-tag"
              onClick={selectYOLOTool}
            >
              YOLO
            </div>

            <div
              className="Menu-option"
              id="Day-analysis-tag"
              onClick={selectDayAnalysis}
            >
              Day Analysis
            </div>
            <div
              className="Menu-option"
              id="Settings-tag"
              onClick={selectSettings}
            >
              Settings
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
