function Settings(props) {
  return (
    <>
      <div className="Feature-tab">
        <h2>Simple modifactions you can make to improve performance.</h2>
        <p>
          The Api Key is has call limitations, insert your own API Key for
          better access. You can create your own API Key for free at:
        </p>
        <a
          className="App-link"
          href="https://www.alphavantage.co/support/#api-key"
          target="_blank"
          rel="noopener noreferrer"
        >
          Free API KEY
        </a>
        <label htmlFor="amountDCA">Custom API Key:</label>
        <input
          type="text"
          id="amount"
          name="fname"
          onChange={(e) => updateAmount(e.target.value)}
        />
      </div>
    </>
  );
}

export default Settings;
