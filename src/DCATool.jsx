function DCATool(props) {
  return (
    <>
      <div className="Feature-tab">Dollar Cost Averaging(DCA) Simulator</div>
      <label for="currencyDCA">Select Currency:</label>
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
      <label for="amountDCA">Incremental Amount:</label>
      <input type="text" id="amount" name="fname" />
      <label for="basisDCA">DCA Basis:</label>
      <select
        id="basisDCA"
        className="select"
        onChange={(e) => props.updateSearchCriteria(e.target.value)}
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
      <select
        className="select"
        id="dateTimeSelect"
        disabled
        onChange={(e) => props.updatePrices(e.target.value)}
      >
        <option
          id="startPointDCA"
          key="timePeriod"
          disabled
          defaultValue
          hidden
        >
          Start Point
        </option>
        {props.menuValues.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
    </>
  );
}

export default DCATool;
