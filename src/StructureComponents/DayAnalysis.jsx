import { useState, useEffect } from "react";
import axios from "../AxiosSetup";

function DayAnalysis(props) {
  const [dayData, setDayData] = useState({});
  const [days, setDays] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    async function dataFetchCurrent() {
      await axios
        .get(
          `query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${
            props.userAPIKey ? props.userAPIKey : props.apiKey
          }`
        )
        .then((response) => {
          console.log(
            "this is data",
            response.data[`Time Series (Digital Currency Daily)`]
          );
          const data = response.data[`Time Series (Digital Currency Daily)`];
          setDays(Object.keys(data).map((item) => new Date(item).getDay()));
          setValue(Object.keys(data)[0]);
          setValue(new Date(Object.keys(data)[0]).getDay());
          setDayData(data);
        })
        .catch((error) => {
          console.log(error);
          console.log("current price not retrieved");
        });
    }

    dataFetchCurrent();
  }, []);

  return (
    <>
      <div className="Feature-tab">
        <p>data exploration of day of the week prices</p>
        <p>
          {value}
          {days}
        </p>
      </div>
    </>
  );
}

export default DayAnalysis;
