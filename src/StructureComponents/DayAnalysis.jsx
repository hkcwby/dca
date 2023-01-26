import { useState, useEffect } from "react";
import axios from "../AxiosSetup";

function DayAnalysis(props) {
  const [dataset, setDataset] = useState("");
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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
          const dates = Object.keys(data);
          const modified = dates.map((date) => {
            const output = data[date];
            output.weekday = weekDays[new Date(date).getDay()];
            return output;
          });
          console.log(modified);

          const frequency = [0, 0, 0, 0, 0, 0, 0];
          const daysOfTheWeek = [];
          for (let i = 0; i < 7; i++) {
            daysOfTheWeek.push(modified[i]["weekday"]);
          }
          console.log(daysOfTheWeek);

          // const counter = 0;
          // lowest = 0;
          // currentLowestDay = "";

          for (let j = 0; j < modified.length; j++) {}
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
          {/* {value} */}
          {/* {days} */}
        </p>
      </div>
    </>
  );
}

export default DayAnalysis;
