import { useState } from "react";
import LineChart from "./LineChart";

function CompTool(props) {
  const [amount, setAmount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [moneyInvested, setMoneyInvested] = useState(0);
  const [valid, setValid] = useState(true);
  const [chartData, setChartData] = useState();
  const [dip, setDip] = useState(5);

  function updateSearchCriteriaBTD(selection) {
    props.dataFetch(selection);
    document.querySelector("#startPointBTD").disabled = false;
  }

  function updateAmount(value) {
    isNaN(value) ? setValid(false) : setValid(true);
    if (valid) setAmount(value);
  }

  function updateDipAmount(value) {
    setDip(value);
  }

  function calculateComp() {
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
    // calculate the accumulated investment at each interval
    const chartValuesInvest = lowPrices.map(
      (item, index) => lowPrices.length * amount
    );

    //BTD - buy the dip - purchase amounts when the price dips by a certain amount
    // track price movements
    const priceMovements = average.map((item, index) =>
      index == 0 ? 0 : ((item - average[index - 1]) / average[index - 1]) * 100
    );
    // track the price movements that qualify as dips
    const tracker = chartValuesInvest.map((item, index) =>
      priceMovements[index] <= -dip ? 0 : 1
    );

    //the amount to spend on dips
    const BTDsavings = chartValuesInvest.map((item) => Number(amount));

    BTDsavings.forEach((item, index, array) => {
      if (index < array.length - 1) {
        if (tracker[index] == 1) {
          array[index + 1] += array[index];
          array[index] = 0;
        }
      }
    });
    //calculate the remaing investment yet to be deployed at each step for BTD strategy
    const BTDinvestRemainder = [];
    let BTDinvestRemainderTracker = chartValuesInvest[0];
    BTDsavings.forEach((item) => {
      BTDinvestRemainderTracker -= item;
      BTDinvestRemainder.push(BTDinvestRemainderTracker);
    });
    //determine the buys at each step of BTD
    const buysBTD = lowPrices.map((item, index) =>
      BTDsavings[index]
        ? BTDsavings[index] /
          Math.floor((Number(item) + Number(highPrices[index])) / 2)
        : 0
    );
    // a check for the last point in the array to determine if we are making a buy or not
    if (tracker[tracker.length - 1] == 1) buysBTD[buysBTD.length - 1] = 0;
    //determine the cumulative amount bought over time
    const buysCumulativeBTD = [...buysBTD];

    buysCumulativeBTD.forEach((item, index, array) => {
      if (index < array.length - 1) array[index + 1] += item;
    });
    //determine the value of the cumulative purchases at each time period
    const valueCumulativeBTD = buysCumulativeBTD.map(
      (item, index) => item * average[index]
    );
    // the total of the BTD strategy as the sum of the present value of holdings plus remaining investment cash
    const investBTD = BTDinvestRemainder.map(
      (item, index) => item + valueCumulativeBTD[index]
    );

    console.log(valueCumulativeBTD, BTDinvestRemainder);

    // YOLO - you only live once - an upfront all in investment
    const yoloAmount =
      chartValuesInvest[chartValuesInvest.length - 1] / average[0];
    // The amount
    const yoloInvest = average.map((item) => Math.floor(item * yoloAmount));

    //DCA - Dollar cost averaging
    const buysDCA = lowPrices.map(
      (item, index) =>
        amount / Math.floor((Number(item) + Number(highPrices[index])) / 2)
    );
    //determine how much was accumulated by each interval based on the sum of current plus previous intervals
    const accumulatedDCA = buysDCA.map((item, index) =>
      buysDCA.slice(0, index + 1).reduce((a, b) => a + b, 0)
    );

    // calculate the accumulated investment at each interval
    const DCAinvestRemainder = lowPrices.map(
      (item, index) => amount * lowPrices.length - (index + 1) * amount
    );

    //multiply the current accumulated volume at each interval by the average price at each interval plus the remaining investment
    const chartValuesDCA = accumulatedDCA.map(
      (item, index) =>
        (item *
          Math.floor(Number(lowPrices[index]) + Number(highPrices[index]))) /
          2 +
        DCAinvestRemainder[index]
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
        },
        {
          label: "BTD",
          data: investBTD,
          borderColor: "green",
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
          label: "BTC Price",
          data: average,
          borderColor: "orange",
          borderWidth: 2,
          hidden: true,
        },
      ],
    });

    //the total invested amount
    setMoneyInvested(amount * average.length);
  }

  return (
    <div className="Feature-tab">
      <div className="Summary">Strategy Compare (DCA vs BTD vs YOLO)</div>
      <div>
        <select
          id="currencyBTD"
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
          <select
            className="select"
            id="dipBTD"
            // disabled
            onChange={(e) => updateDipAmount(e.target.value)}
            defaultValue="Dip % (default 5%)"
          >
            <option
              key="dipPercent"
              defaultValue
              hidden
              value="Dip % (default 5%)"
            >
              Dip % (default 5%)
            </option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
              (value) => (
                <option key={value}>{value}</option>
              )
            )}
          </select>
          {valid ? (
            <></>
          ) : (
            <p className="Failed-validation">Please Enter a Number</p>
          )}
        </div>
        <select
          id="basisBTD"
          className="select"
          onChange={(e) => updateSearchCriteriaBTD(e.target.value)}
          defaultValue="Basis"
        >
          <option id="searchType" key="placeholder" disabled value="Basis">
            Basis
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
          id="startPointBTD"
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
          onClick={calculateComp}
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

export default CompTool;
