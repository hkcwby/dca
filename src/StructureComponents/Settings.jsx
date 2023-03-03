function Settings(props) {
  return (
    <>
      <div className="Feature-tab">
        <p>Simple modifactions you can make to improve performance.</p>
        <p>
          The Api Key is has call limitations, insert your own API Key for
          better access. You can create your own API Key for free at:
          <a
            className="App-link"
            href="https://www.alphavantage.co/support/#api-key"
            target="_blank"
            rel="noopener noreferrer"
          >
            Free API KEY
          </a>
        </p>
        <div>
          <label htmlFor="amountDCA">Custom API Key:</label>
          <input
            type="text"
            id="amount"
            name="fname"
            onChange={(e) => props.updateAPIKEY(e.target.value)}
          />
        </div>

        <p>The default setting yields only the last 100 results </p>
      </div>
    </>
  );
}

export default Settings;
