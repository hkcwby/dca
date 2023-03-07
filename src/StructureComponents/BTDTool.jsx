import { useState } from "react";
import LineChart from "./LineChart";

function BTDTool(props) {
  const [amount, setAmount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [moneyInvested, setMoneyInvested] = useState(0);
  const [valid, setValid] = useState(true);
  const [chartData, setChartData] = useState();

  function updateAmount(value) {
    isNaN(value) ? setValid(false) : setValid(true);
    if (valid) setAmount(value);
  }
  function calculateDCA() {
    const data = Object.keys(props.priceData);
    const dataSelection = data.slice(0, data.indexOf(startDate) + 1).reverse();

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

    // YOLO - you only live once - an upfront all in investment
    // Total YOLO amount matches the amount spent in total on DCA for fair comparison
    const yoloAmount =
      chartValuesInvest[chartValuesInvest.length - 1] / average[0];
    // The amount
    const yoloInvest = average.map((item) => Math.floor(item * yoloAmount));

    //BTD - buy the dip - purchase amounts when the price dips by a certain amount
    // track price movements
    const priceMovements = average.map((item, index) =>
      index == 0 ? 0 : ((item - average[index - 1]) / average[index - 1]) * 100
    );
    const BTDsavings = chartValuesInvest.map((item) => Number(amount));
    const tracker = chartValuesInvest.map((item, index) =>
      priceMovements[index] <= -5 ? 0 : 1
    );

    BTDsavings.forEach((item, index, array) => {
      if (index < array.length - 1) {
        if (tracker[index] == 1) {
          array[index + 1] += array[index];
          array[index] = 0;
        }
      }
    });

    const buysBTD = lowPrices.map((item, index) =>
      BTDsavings[index]
        ? BTDsavings[index] /
          Math.floor((Number(item) + Number(highPrices[index])) / 2)
        : 0
    );
    if (tracker[tracker.length - 1] == 1) buysBTD[buysBTD.length - 1] = 0;

    const buysCumulativeBTD = [...buysBTD];

    buysCumulativeBTD.forEach((item, index, array) => {
      console.log(array[index + 1]);
      if (index < array.length - 1) array[index + 1] += item;
    });

    const valueCumulativeBTD = buysCumulativeBTD.map(
      (item, index) => item * average[index]
    );

    const cashBTD = [...tracker];

    cashBTD.forEach((item, index, array) => {
      if (index == 0) array[index] = Number(amount);
      else if (index > 0 && tracker[index] == 1)
        array[index] = array[index - 1] + Number(amount);
      else array[index] = 0;
    });

    const investBTD = cashBTD.map(
      (item, index) => item + valueCumulativeBTD[index]
    );
    console.log(BTDsavings, tracker, buysBTD);

    //set the chart data using the values
    setChartData({
      labels: dataSelection,
      datasets: [
        {
          label: "DCA Present Value",
          data: chartValuesDCA,
          borderColor: "black",
          borderWidth: 2,
        },
        {
          label: "Invested Amount",
          data: chartValuesInvest,
          borderColor: "grey",
          borderWidth: 2,
        },
        {
          label: "YOLO",
          data: yoloInvest,
          borderColor: "red",
          borderWidth: 2,
        },
        {
          label: "BTD",
          data: investBTD,
          borderColor: "green",
          borderWidth: 2,
        },
        {
          label: "BTC Price",
          data: average,
          borderColor: "orange",
          borderWidth: 2,
        },
      ],
    });

    //the total invested amount
    setMoneyInvested(amount * average.length);
  }

  return (
    <div className="Feature-tab">
      <div className="Summary">Buy The Dip(BTD) Simulator</div>
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
      </div>
      <div className="DCA-display">
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

export default BTDTool;
