import { useState } from "react";

function DCATool(props) {
  const [amount, setAmount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [valueBitcoinAverage, setValueBitcoinAverage] = useState(0);
  const [valueBitcoinHigh, setValueBitcoinHigh] = useState(0);
  const [valueBitcoinLow, setValueBitcoinLow] = useState(0);
  const [valueBitcoinOpen, setValueBitcoinOpen] = useState(0);
  const [valueBitcoinClose, setValueBitcoinClose] = useState(0);
  const [moneyInvested, setMoneyInvested] = useState(0);
  const [valid, setValid] = useState(true);

  function updateAmount(value) {
    isNaN(value) ? setValid(false) : setValid(true);
    if (valid) setAmount(value);
  }
  function calculateDCA() {
    const data = Object.keys(props.priceData);
    const dataSelection = data.slice(0, data.indexOf(startDate) + 1);

    //gather all the opening prices
    const openPrices = dataSelection.map(
      (date) => props.priceData[date][`1a. open (USD)`]
    );

    const bitcoinOpen = openPrices.reduce(
      (stored, value) => stored + amount / value,
      0
    );

    //gather all the high prices
    const highPrices = dataSelection.map(
      (date) => props.priceData[date][`2a. high (USD)`]
    );

    const bitcoinHigh = highPrices.reduce(
      (stored, value) => stored + amount / value,
      0
    );

    //gather all the low prices
    const lowPrices = dataSelection.map(
      (date) => props.priceData[date][`3a. low (USD)`]
    );

    const bitcoinLow = lowPrices.reduce(
      (stored, value) => stored + amount / value,
      0
    );

    //gather all the low closing
    const closePrices = dataSelection.map(
      (date) => props.priceData[date][`4a. close (USD)`]
    );

    const bitcoinClose = closePrices.reduce(
      (stored, value) => stored + amount / value,
      0
    );

    //gather average of low and high prices
    const average = lowPrices.map((item, index) =>
      Math.floor((Number(item) + Number(highPrices[index])) / 2)
    );
    //calculate purchases of bitcoin based on fixed amount per increment
    const bitcoinAverage = average.reduce(
      (stored, value) => stored + amount / value,
      0
    );
    //the total invested amount
    setMoneyInvested(amount * average.length);
    //the present value of the bitcoin accumulated
    setValueBitcoinAverage(Math.floor(bitcoinAverage * props.currentPrice));
    setValueBitcoinHigh(Math.floor(bitcoinHigh * props.currentPrice));
    setValueBitcoinLow(Math.floor(bitcoinLow * props.currentPrice));
    setValueBitcoinOpen(Math.floor(bitcoinOpen * props.currentPrice));
    setValueBitcoinClose(Math.floor(bitcoinClose * props.currentPrice));
  }

  return (
    <div className="Feature-tab">
      <div className="Summary">Dollar Cost Averaging(DCA) Simulator</div>
      <select
        id="currencyDCA"
        className="select"
        onChange={(e) => props.updateCurrency(e.target.value)}
        defaultValue="Select Currency"
      >
        <option
          id="searchType"
          key="currencySelect"
          disabled
          value="Select Currency"
        >
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
      <div>
        <input
          type="text"
          id="amount"
          name="fname"
          onChange={(e) => updateAmount(e.target.value)}
          placeholder="Enter Incremental Amount"
        />
        {valid ? (
          <></>
        ) : (
          <p className="Failed-validation">Please Enter a Number</p>
        )}
      </div>
      <select
        id="basisDCA"
        className="select"
        onChange={(e) => props.updateSearchCriteriaDCA(e.target.value)}
        defaultValue="DCA Basis"
      >
        <option id="searchType" key="placeholder" disabled value="DCA Basis">
          DCA Basis
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
      <select
        className="select"
        id="startPointDCA"
        disabled
        onChange={(e) => setStartDate(e.target.value)}
        defaultValue="Start Date"
      >
        <option key="timePeriod" defaultValue hidden value="Start Date">
          Start Date
        </option>
        {props.menuValues.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
      <button
        className="Calculate"
        type="button"
        value="Calculate"
        onClick={calculateDCA}
      >
        Calculate
      </button>

      <div className="DCA-display">
        <div>
          Funds Invested: {props.marker}
          {moneyInvested ? moneyInvested : "-"}
        </div>
        <div className="Summary">Summary</div>
        <div>PV Based On Point Of Purchase:</div>
        <div>
          Low of each period: {props.marker}
          {valueBitcoinLow ? valueBitcoinLow : "-"}
        </div>
        <div>
          High of each period: {props.marker}
          {valueBitcoinHigh ? valueBitcoinHigh : "-"}
        </div>
        <div>
          Average of each period: {props.marker}
          {valueBitcoinAverage ? valueBitcoinAverage : "-"}
        </div>
        <div>
          Opening of each period: {props.marker}
          {valueBitcoinOpen ? valueBitcoinOpen : "-"}
        </div>
        <div>
          Close of each period: {props.marker}
          {valueBitcoinClose ? valueBitcoinClose : "-"}
        </div>
      </div>
    </div>
  );
}

export default DCATool;