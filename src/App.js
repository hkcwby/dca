import "./App.css";
import { useState, useEffect } from "react";
import axios from "./AxiosSetup";

function App() {
  //setting up important core values and references
  const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  const [currency, setCurrency] = useState("USD");
  function updateCurrency(selection) {
    console.log("this is selection", selection);
    setCurrency(selection);
  }

  const endpoints = {
    current: `query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=${currency}&apikey=${apiKey}`,
    daily: `query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=${currency}&apikey=${apiKey}&outputsize=compact`,
    weekly: `query?function=DIGITAL_CURRENCY_WEEKLY&symbol=BTC&market=${currency}&apikey=${apiKey}&outputsize=compact`,
    monthly: `query?function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=${currency}&apikey=${apiKey}&outputsize=compact`,
  };

  //A boolean to toggle a loading screen whilst data is being fetched
  const [loading, setLoading] = useState(true);

  //Currency tracking variable and update function

  //the current price explorer focus daily/weekly/monthlty
  const [dataType, setDataType] = useState("");
  const [dateTimeMenuValues, setDateTimeMenuValues] = useState();

  // function to update the data type and unlock the date time option
  function updateSearchCriteria(selection) {
    let item = selection;
    console.log("this is selection", item);
    switch (selection) {
      case "daily":
        setDateTimeMenuValues(days);
        break;
      case "weekly":
        setDateTimeMenuValues(weeks);
        console.log("this is weeks", weeks);
      case "monthly":
        setDateTimeMenuValues(months);
        break;
      default:
        setDateTimeMenuValues(["ERROR"]);
    }
    setDataType(selection);
    document.querySelector("#dateTimeSelect").disabled = false;
    console.log(dateTimeMenuValues);
  }

  //the current price displayed for refernce
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
      setLoading(true);
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
        .then(console.log("success daily"))
        .catch((error) => {
          setLoading(true);
          console.log("this is the error", error);
          console.log("daily prices not retrieved");
        });
    }

    async function dataFetchWeekly() {
      setLoading(true);
      await axios
        .get(endpoints.weekly)
        .then((response) => {
          const responseData =
            response.data["Time Series (Digital Currency Weekly)"];
          setWeeklyPriceData(responseData);
          setWeeks(Object.keys(responseData));
          setWeekPrices(responseData[Object.keys(responseData)[0]]);
        })
        .then(setLoading(false))
        .then(console.log("success weekly", weeks))
        .catch((error) => {
          setLoading(true);
          console.log("this is the error", error);
          console.log("weekly prices not retrieved");
        });
    }

    async function dataFetchMonthly() {
      setLoading(true);
      const data = await axios
        .get(endpoints.monthly)
        .then((response) => {
          const responseData =
            response.data["Time Series (Digital Currency Monthly)"];
          setMonthlyPriceData(responseData);
          setMonths(Object.keys(responseData));
          setMonthPrices(responseData[Object.keys(responseData)[0]]);
        })
        .then(setLoading(false))
        .then(console.log("success monthly"))
        .catch((error) => {
          setLoading(true);
          console.log("this is the error", error);
          console.log("monthly prices not retrieved");
        });
    }
    // dataFetchCurrent();
    // dataFetchDaily();
    dataFetchWeekly();
    // dataFetchMonthly();
  }, [dataType]);

  //run on mount to retrieve the active market price

  useEffect(() => {
    async function dataFetchCurrent() {
      await axios
        .get(endpoints.current)
        .then((response) => {
          setPrice(
            response.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
          );
        })
        .then(setLoading(false))
        .catch((error) => {
          console.log(error);
          console.log("current price not retrieved");
        });
    }

    dataFetchCurrent();
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
        <p>{`Current Price: $${Math.round(price)}  ${currency}`}</p>

        <select
          className="select"
          onChange={(e) => updateCurrency(e.target.value)}
          defaultValue="Select Currency"
        >
          <option id="searchType" disabled value="Select Currency">
            Select Currency
          </option>
          <option id="searchType" key="USD">
            USD
          </option>
          <option id="searchType" key="EUR">
            EUR
          </option>
          <option id="searchType" key="JPY">
            JPY
          </option>
          <option id="searchType" key="CNY">
            CNY
          </option>
        </select>

        <select
          className="select"
          onChange={(e) => updateSearchCriteria(e.target.value)}
          defaultValue="Search Type"
        >
          <option id="searchType" disabled value="Search Type">
            Search Type
          </option>
          <option id="searchType" key="day" value="daily">
            daily
          </option>
          <option id="searchType" key="week" value="weekly">
            weekly
          </option>
          <option id="searchType" key="month" value="monthly">
            monthly
          </option>
        </select>

        <select
          className="select"
          id="dateTimeSelect"
          disabled
          // onChange={(e) => updateSearchCriteria(e.target.value)}
        >
          <option id="searchType" disabled defaultValue hidden>
            Time Period
          </option>
          <option>{dateTimeMenuValues}</option>
        </select>

        {/* <span>Date:{days[0]}</span>
        <span>Open:${Math.round(dayPrices["1a. open (USD)"])}</span>
        <span>Close:${Math.round(dayPrices["4a. close (USD)"])}</span>
        <span>High:${Math.round(dayPrices["2a. high (USD)"])}</span>
        <span>Low:${Math.round(dayPrices["3a. low (USD)"])}</span> */}
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
