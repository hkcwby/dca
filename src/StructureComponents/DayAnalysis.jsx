import { useState, useEffect } from "react";
import axios from "../AxiosSetup";

function DayAnalysis(props) {
  const [lowMin, setLowMin] = useState([]);
  const [lowMax, setLowMax] = useState([]);
  const [highMin, setHighMin] = useState([]);
  const [highMax, setHighMax] = useState([]);
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
          `query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=${
            props.currency
          }&apikey=${props.userAPIKey ? props.userAPIKey : props.apiKey}`
        )
        .then((response) => {
          //useful console.log statement for checking if API call is functioning correct
          // console.log(
          //   "this is data",
          //   response.data[`Time Series (Digital Currency Daily)`]
          // );
          //acquire the price data from the API response
          const data = response.data[`Time Series (Digital Currency Daily)`];
          //create a new format of the data with the appropriate day of the week appended
          const dates = Object.keys(data);
          const modified = dates.map((date) => {
            const output = data[date];
            output.weekday = weekDays[new Date(date).getDay()];
            return output;
          });

          //variables for storing frequency counts of min and max price day per week
          const frequencyMaxHigh = [0, 0, 0, 0, 0, 0, 0];
          const frequencyMinHigh = [0, 0, 0, 0, 0, 0, 0];
          const frequencyMaxLow = [0, 0, 0, 0, 0, 0, 0];
          const frequencyMinLow = [0, 0, 0, 0, 0, 0, 0];
          // the order of week days in the data
          const daysOfTheWeek = [];
          for (let i = 0; i < 7; i++) {
            daysOfTheWeek.push(modified[i]["weekday"]);
          }
          //process the data in weekly batches
          for (let j = 0; j < modified.length - 7; j += 7) {
            const temp = modified.slice(j, j + 7);

            const modTempHigh = temp.map((item) =>
              Math.floor(item[`2a. high (${props.currency})`])
            );
            const modTempLow = temp.map((item) =>
              Math.floor(item[`3a. low (${props.currency})`])
            );
            //determine the max and min price day each week and the index
            const maxHigh = Math.max(...modTempHigh);
            const minHigh = Math.min(...modTempHigh);
            const maxLow = Math.max(...modTempLow);
            const minLow = Math.min(...modTempLow);
            const maxIndexHigh = modTempHigh.indexOf(maxHigh);
            const minIndexHigh = modTempHigh.indexOf(minHigh);
            const maxIndexLow = modTempLow.indexOf(maxLow);
            const minIndexLow = modTempLow.indexOf(minLow);
            frequencyMaxHigh[maxIndexHigh] += 1;
            frequencyMinHigh[minIndexHigh] += 1;
            frequencyMaxLow[maxIndexLow] += 1;
            frequencyMinLow[minIndexLow] += 1;
          }
          const total = frequencyMaxHigh.reduce((a, b) => a + b, 0);

          const percentageMaxHigh = frequencyMaxHigh.map((item) =>
            ((item / total) * 100).toFixed(2)
          );
          const percentageMaxLow = frequencyMaxLow.map((item) =>
            ((item / total) * 100).toFixed(2)
          );
          const percentageMinHigh = frequencyMinHigh.map((item) =>
            ((item / total) * 100).toFixed(2)
          );
          const percentageMinLow = frequencyMinLow.map((item) =>
            ((item / total) * 100).toFixed(2)
          );
          const combinedOutputHighMin = {};
          const combinedOutputHighMax = {};
          const combinedOutputLowMin = {};
          const combinedOutputLowMax = {};
          for (let k = 0; k < 7; k++) {
            combinedOutputHighMin[daysOfTheWeek[k]] = percentageMinHigh[k];
            combinedOutputHighMax[daysOfTheWeek[k]] = percentageMaxHigh[k];
            combinedOutputLowMin[daysOfTheWeek[k]] = percentageMinLow[k];
            combinedOutputLowMax[daysOfTheWeek[k]] = percentageMaxLow[k];
          }
          setLowMin(combinedOutputLowMin);
          setLowMax(combinedOutputLowMax);
          setHighMin(combinedOutputHighMin);
          setHighMax(combinedOutputHighMax);
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
        <table>
          <tbody>
            <tr>
              <th> </th>
              <th>Price Low</th>
              <th> </th>
              <th>Price High</th>
            </tr>
            <tr>
              <th>Day</th>
              <th>Lowest</th>
              <th>Highest</th>
              <th>Lowest</th>
              <th>Highest</th>
            </tr>
            <tr>
              <td>Monday</td>
              <td>%{lowMin.Monday}</td>
              <td>%{lowMax.Monday}</td>
              <td>%{highMin.Monday}</td>
              <td>%{highMax.Monday}</td>
            </tr>
            <tr>
              <td>Tuesday</td>
              <td>%{lowMin.Tuesday}</td>
              <td>%{lowMax.Tuesday}</td>
              <td>%{highMin.Tuesday}</td>
              <td>%{highMax.Tuesday}</td>
            </tr>
            <tr>
              <td>Wednesday</td>
              <td>%{lowMin.Wednesday}</td>
              <td>%{lowMax.Wednesday}</td>
              <td>%{highMin.Wednesday}</td>
              <td>%{highMax.Wednesday}</td>
            </tr>
            <tr>
              <td>Thursday</td>
              <td>%{lowMin.Thursday}</td>
              <td>%{lowMax.Thursday}</td>
              <td>%{highMin.Thursday}</td>
              <td>%{highMax.Thursday}</td>
            </tr>
            <tr>
              <td>Friday</td>
              <td>%{lowMin.Friday}</td>
              <td>%{lowMax.Friday}</td>
              <td>%{highMin.Friday}</td>
              <td>%{highMax.Friday}</td>
            </tr>
            <tr>
              <td>Saturday</td>
              <td>%{lowMin.Saturday}</td>
              <td>%{lowMax.Saturday}</td>
              <td>%{highMin.Saturday}</td>
              <td>%{highMax.Saturday}</td>
            </tr>
            <tr>
              <td>Sunday</td>
              <td>%{lowMin.Sunday}</td>
              <td>%{lowMax.Sunday}</td>
              <td>%{highMin.Sunday}</td>
              <td>%{highMax.Sunday}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DayAnalysis;
