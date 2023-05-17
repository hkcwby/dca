import { useState } from "react";
import LineChart from "./LineChart";

function DCATool(props) {
  const [amount, setAmount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [moneyInvested, setMoneyInvested] = useState(0);
  const [valid, setValid] = useState(true);
  const [chartData, setChartData] = useState();
  const [results, setResults] = useState(false);

  function resultsToggle() {
    setResults(!results);
  }

  function updateSearchCriteriaDCA(selection) {
    props.dataFetch(selection);
    document.querySelector("#startPointDCA").disabled = false;
  }

  function updateAmount(value) {
    isNaN(value) ? setValid(false) : setValid(true);
    if (valid) setAmount(value);
  }
  function calculateDCA() {
    const data = Object.keys(props.priceData);
    const dataSelection = data.slice(0, data.indexOf(startDate) + 1).reverse();

    //remove the present days data which is often incomplete and skews charts data
    dataSelection.pop();

    //gather all the high prices
    const highPrices = dataSelection.map(
      (date) => props.priceData[date][`2a. high (${props.currency})`]
    );

    //gather all the low prices
    const lowPrices = dataSelection.map(
      (date) => props.priceData[date][`3a. low (${props.currency})`]
    );

    //gather average of low and high prices
    const average = lowPrices.map((item, index) =>
      Math.floor((Number(item) + Number(highPrices[index])) / 2)
    );

    //chart data processing
    //determine the amount purchased at each interval based on the average price of high and low
    const buysDCA = lowPrices.map(
      (item, index) =>
        amount / Math.floor((Number(item) + Number(highPrices[index])) / 2)
    );
    //determine how much was accumulated by each interval based on the sum of current plus previous intervals
    const accumulatedDCA = buysDCA.map((item, index) =>
      buysDCA.slice(0, index + 1).reduce((a, b) => a + b, 0)
    );
    //multiply the current accumulated volume at each interval by the average price at each interval
    const chartValuesDCA = accumulatedDCA.map(
      (item, index) =>
        (item *
          Math.floor(Number(lowPrices[index]) + Number(highPrices[index]))) /
        2
    );
    // calculate the accumulated investment at each interval
    const chartValuesInvest = lowPrices.map(
      (item, index) => (index + 1) * amount
    );

    //set the chart data using the values
    setChartData({
      labels: dataSelection,
      datasets: [
        {
          label: "DCA Present Value",
          data: chartValuesDCA,
          borderColor: "black",
          borderWidth: 2,
          pointStyle: false,
        },
        {
          label: "Invested Amount",
          data: chartValuesInvest,
          borderColor: "grey",
          borderWidth: 2,
          pointStyle: false,
        },

        {
          label: "BTC Price",
          data: average,
          borderColor: "orange",
          borderWidth: 2,
          hidden: true,
          pointStyle: false,
        },
      ],
    });

    //the total invested amount
    setMoneyInvested(amount * average.length);
    //toggle the display of results
    setResults(true);
  }

  return (
    <div className="Feature-tab">
      <div className="Summary">Dollar Cost Averaging(DCA) Simulator</div>
      <div>
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
          onChange={(e) => updateSearchCriteriaDCA(e.target.value)}
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
      </div>
      <div className="panel-display">
        <div className="info-data-toggle">
          {chartData ? (
            <p onClick={resultsToggle}>{results ? "info" : "results"}</p>
          ) : (
            <></>
          )}
        </div>
        {results ? (
          <>
            {" "}
            <LineChart chartData={chartData} />
            <div className="Results">
              <div className="Summary">Summary</div>
              <div>
                Funds Invested: {props.marker}
                {moneyInvested ? moneyInvested : "-"}
              </div>
              <div>
                Present Value: {props.marker}
                {chartData
                  ? Math.floor(
                      chartData.datasets[0].data[
                        chartData.datasets[0].data.length - 1
                      ]
                    )
                  : "-"}
              </div>
            </div>
          </>
        ) : (
          <div className="Explaination-main">
            <p>
              This tool is designed to demonstrate the effect of investing using
              a dollar cost averaging (DCA).
            </p>
            <ul className="Explaination-points">
              <li className="Explaination-text">
                The concept is simple, you buy a fixed amount at a fixed
                interval over time.
              </li>
              <li className="Explaination-text">
                Select an amount to invest and then a frequency of
                daily/weekly/monthly finally select a start date.
              </li>
              <li className="Explaination-text">
                The tool takes pricing data and assumes you managed to buy at
                the average of the high and low prices for that period.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default DCATool;
