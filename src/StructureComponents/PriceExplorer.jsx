function PriceExplorer(props) {
  // function to update the data type and unlock the date time option
  function updateSearchCriteria(selection) {
    props.dataFetch(selection);
    document.querySelector("#dateTimeSelect").disabled = false;
  }
  return (
    <>
      <div className="Feature-tab">
        <p>{`Reference Current Price: ${props.marker}${Math.round(
          props.currentPrice
        )}  ${props.currency}`}</p>
        <select
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
        <select
          className="select"
          onChange={(e) => updateSearchCriteria(e.target.value)}
          defaultValue="Search Type"
        >
          <option
            id="searchType"
            key="placeholder"
            disabled
            value="Search Type"
          >
            Search Type
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
          id="dateTimeSelect"
          disabled
          onChange={(e) => props.updatePrices(e.target.value)}
        >
          <option id="searchType" key="timePeriod" defaultValue hidden>
            Time Period
          </option>
          {props.menuValues.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        {!props.loading ? (
          <div className="Price-explorer-display">
            <div className="Price-explorer-panel">
              <div>
                Open: {props.marker}
                {props.prices[`1a. open (${props.currency})`]
                  ? Math.round(props.prices[`1a. open (${props.currency})`])
                  : "-"}
              </div>
              <div>
                High: {props.marker}
                {props.prices[`2a. high (${props.currency})`]
                  ? Math.round(props.prices[`2a. high (${props.currency})`])
                  : "-"}
              </div>
            </div>
            <div className="Price-explorer-panel">
              <div>
                Close: {props.marker}
                {props.prices[`4a. close (${props.currency})`]
                  ? Math.round(props.prices[`4a. close (${props.currency})`])
                  : "-"}
              </div>
              <div>
                Low: {props.marker}
                {props.prices[`3a. low (${props.currency})`]
                  ? Math.round(props.prices[`3a. low (${props.currency})`])
                  : "-"}
              </div>
            </div>
          </div>
        ) : (
          <div className="Price-explorer-display">
            <div className="Price-explorer-panel">
              <div>Open: -</div>
              <div>High: -</div>
            </div>
            <div className="Price-explorer-panel">
              <div>Close: -</div>
              <div>Low: -</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PriceExplorer;
