import './App.css';

function App() {

const apiKey = process.env.ALPHA_VANTAGE_KEY;

// const request = require("request");

// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
console.log(fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol=IBM&interval=15min&slice=year1month1&apikey=${apiKey}`))
    // .JSONParse()                                   
    // .then(() => console.log("success"));
  
  return (
    <div className="App">
      <header className="App-header">
        <p>
         A fun little application exploring the Alpha Vantage API
        </p>
        <p></p>
        <a
          className="App-link"
          href="https://www.alphavantage.co/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check out the API here
        </a>
      </header>
    </div>
  );
}

export default App;
