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

  function updateAmount(value) {
    setAmount(value);
  }
  function calculateDCA() {
    const data = Object.keys(props.priceData);
    const dataSelection = data.slice(0, data.indexOf(startDate) + 1);

    //gather all the opening prices
    const openPrices = dataSelection.map(
      (date) => props.priceData[date][`1a. open (USD)`]
    );
    console.log(openPrices);

    const bitcoinOpen = openPrices.reduce(
      (stored, value) => stored + amount / value,
      0
    );

    //gather all the high prices
    const highPrices = dataSelection.map(
      (date) => props.priceData[date][`2a. high (USD)`]
    );
    console.log(highPrices);

    const bitcoinHigh = highPrices.reduce(
      (stored, value) => stored + amount / value,
      0
    );

    //gather all the low prices
    const lowPrices = dataSelection.map(
      (date) => props.priceData[date][`3a. low (USD)`]
    );
    console.log(lowPrices);

    const bitcoinLow = lowPrices.reduce(
      (stored, value) => stored + amount / value,
      0
    );

    //gather all the low closing
    const closePrices = dataSelection.map(
      (date) => props.priceData[date][`4a. close (USD)`]
    );
    console.log(closePrices);

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
    console.log(bitcoinAverage);
    //the total invested amount
    setMoneyInvested(amount * average.length);
    console.log(moneyInvested);
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
      <div className="Inputs-DCA">
        <div>
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
        </div>
        <div>
          <label htmlFor="amountDCA">Incremental Amount:</label>
          <input
            type="text"
            id="amount"
            name="fname"
            onChange={(e) => updateAmount(e.target.value)}
          />
        </div>
      </div>
      <div className="Inputs-DCA">
        <div>
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
        </div>
        <div>
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
        </div>
      </div>
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
        <div>
          Bought at the low of each period: {props.marker}
          {valueBitcoinLow ? valueBitcoinLow : "-"}
        </div>
        <div>
          Bought at the high point of each period: {props.marker}
          {valueBitcoinHigh ? valueBitcoinHigh : "-"}
        </div>
        <div>
          Bought at the average point of each period: {props.marker}
          {valueBitcoinAverage ? valueBitcoinAverage : "-"}
        </div>
        <div>
          Bought at opening of each period: {props.marker}
          {valueBitcoinOpen ? valueBitcoinOpen : "-"}
        </div>
        <div>
          Bought at the close of each period: {props.marker}
          {valueBitcoinClose ? valueBitcoinClose : "-"}
        </div>
      </div>
    </div>
  );
}

export default DCATool;
