import { useState } from "react";
import LineChart from "./LineChart";

function YOLOTool(props) {
  const [amount, setAmount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [moneyInvested, setMoneyInvested] = useState(0);
  const [valid, setValid] = useState(true);
  const [chartData, setChartData] = useState();

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
      ],
    });

    //the total invested amount
    setMoneyInvested(amount * average.length);
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
        {chartData ? <LineChart chartData={chartData} /> : <></>}
        <div>
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
      </div>
    </div>
  );
}

export default YOLOTool;
