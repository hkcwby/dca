import { useState } from "react";
import LineChart from "./LineChart";

function YOLOTool(props) {
  const [amount, setAmount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [moneyInvested, setMoneyInvested] = useState(0);
  const [valid, setValid] = useState(true);
  const [chartData, setChartData] = useState();
  const [results, setResults] = useState(false);

  function resultsToggle() {
    setResults(!results);
  }

  function updateSearchCriteriaYOLO(selection) {
    props.dataFetch(selection);
    document.querySelector("#startPointYOLO").disabled = false;
  }

  function updateAmount(value) {
    isNaN(value) ? setValid(false) : setValid(true);
    if (valid) setAmount(value);
  }
  function calculateYOLO() {
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
    // calculate the accumulated investment at each interval
    const chartValuesInvest = lowPrices.map(
      (item) => lowPrices.length * amount
    );

    // YOLO - you only live once - an upfront all in investment
    const yoloAmount =
      chartValuesInvest[chartValuesInvest.length - 1] / average[0];
    // The amount
    const yoloInvest = average.map((item) => Math.floor(item * yoloAmount));

    //set the chart data using the values
    setChartData({
      labels: dataSelection,
      datasets: [
        {
          label: "Invested Amount",
          data: chartValuesInvest,
          borderColor: "grey",
          borderWidth: 2,
          pointStyle: false,
        },
        {
          label: "YOLO",
          data: yoloInvest,
          borderColor: "red",
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
      <div className="Summary">You Only Live Once(YOLO) Simulator</div>
      <div>
        <select
          id="currencyYOLO"
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
            placeholder="Total Investment Amount"
          />
          {valid ? (
            <></>
          ) : (
            <p className="Failed-validation">Please Enter a Number</p>
          )}
        </div>
        <select
          id="basisYOLO"
          className="select"
          onChange={(e) => updateSearchCriteriaYOLO(e.target.value)}
          defaultValue="Tracking Basis"
        >
          <option
            id="searchType"
            key="placeholder"
            disabled
            value="Tracking Basis"
          >
            Tracking Basis
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
          id="startPointYOLO"
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
          onClick={calculateYOLO}
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
              an all or in or "You Only Live Once" (YOLO) strategy.
            </p>
            <ul className="Explaination-points">
              <li className="Explaination-text">
                YOLO is another popular strategy advertised on social media
                where you take all your existing savings or even borrow to go
                "all in" with the expectation that prospects are just too good.
              </li>
              <li className="Explaination-text">
                This method can yield very good or very bad results depending on
                your investment time horizon and ultimately has a lot of
                volatility that most investors might find unpalatable.
              </li>
              <li className="Explaination-text">
                Select an amount to invest and then a frequency of
                daily/weekly/monthly finally select a start date.
              </li>
              <li className="Explaination-text">
                The tool assumes you purchase BTC equivelent of the investment
                amount and then tracks its value in currency at each interval.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default YOLOTool;
