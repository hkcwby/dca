import { useState } from "react";

function DCATool(props) {
  const [amount, setAmount] = useState(0);
  const [startDate, setStartDate] = useState("");
  function updateAmount(value) {
    setAmount(value);
  }
  function calculateDCA() {
    const data = Object.keys(props.priceData);
    const dataSelection = data.slice(0, data.indexOf(startDate) + 1);
    console.log(dataSelection);
    console.log(props.priceData[startDate]);

    //gather all the opening prices
    const openPrices = dataSelection.map(
      (date) => props.priceData[date][`1a. open (USD)`]
    );
    console.log(openPrices);

    //gather all the high prices
    const highPrices = dataSelection.map(
      (date) => props.priceData[date][`2a. high (USD)`]
    );
    console.log(highPrices);

    //gather all the low prices
    const lowPrices = dataSelection.map(
      (date) => props.priceData[date][`3a. low (USD)`]
    );
    console.log(lowPrices);

    //gather all the low prices
    const closePrices = dataSelection.map(
      (date) => props.priceData[date][`4a. close (USD)`]
    );
    console.log(closePrices);
    const average = lowPrices.map((item, index) =>
      Math.floor((Number(item) + Number(highPrices[index])) / 2)
    );
    console.log(average);
    const bitcoinAverage = average.reduce(
      (stored, value) => stored + amount / value,
      0
    );
    console.log(bitcoinAverage);
    const moneyInvested = amount * average.length;
    console.log(moneyInvested);
    const valueBitcoinAverage = bitcoinAverage * average[0];
    console.log(valueBitcoinAverage);
  }

  return (
    <>
      <div className="Feature-tab">Dollar Cost Averaging(DCA) Simulator</div>
      <label htmlFor="currencyDCA">Select Currency:</label>
      <select
        id="currencyDCA"
        className="select"
        onChange={(e) => props.updateCurrency(e.target.value)}
        defaultValue="-"
      >
        <option id="searchType" key="currencySelect" disabled value="-">
          -
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
      <label htmlFor="amountDCA">Incremental Amount:</label>
      <input
        type="text"
        id="amount"
        name="fname"
        onChange={(e) => updateAmount(e.target.value)}
      />
      <label htmlFor="basisDCA">DCA Basis:</label>
      <select
        id="basisDCA"
        className="select"
        onChange={(e) => props.updateSearchCriteriaDCA(e.target.value)}
        defaultValue="-"
      >
        <option id="searchType" key="placeholder" disabled value="-">
          -
        </option>
        <option id="searchType" key="day" value="Daily">
          Daily
        </option>
        <option id="searchType" key="week" value="Weekly">
          Weekly
        </option>
        <option id="searchType" key="month" value="Monthly">
          Monthly
        </option>
      </select>
      <label htmlFor="startPointDCA">Start Date:</label>
      <select
        className="select"
        id="startPointDCA"
        disabled
        onChange={(e) => setStartDate(e.target.value)}
      >
        <option key="timePeriod" disabled defaultValue hidden>
          Start Point
        </option>
        {props.menuValues.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
      <button type="button" value="Calculate" onClick={calculateDCA}>
        Calculate
      </button>
    </>
  );
}

export default DCATool;
