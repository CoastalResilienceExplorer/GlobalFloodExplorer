import React, { useEffect, useState } from "react";
import getEnv from "../../getEnv";
import "./Charts.css";
import { kFormatter } from "../../utils/formattingUtils";

const server = getEnv();
const port = "3033";
const host = `http://${server}:${port}`;

export default function CountryLevelList({ countries, highlightFIDs }) {
  const [data, setData] = useState([]);
  const [dataToDisplay, setDataToDisplay] = useState([]);

  useEffect(() => {
    const data = countries
      .map((c) => `${host}/country_data/${c}.json`)
      .map((p) => fetch(p).then((res) => res.json()));
    Promise.all(data).then((v) => {
      setData(v.flat());
    });
  }, [countries]);

  useEffect(() => {
    const data1 = data.sort((a, b) => b.Ab_S_BAE - a.Ab_S_BAE).slice(0, 5);
    setDataToDisplay([...new Set([...data1])]);
  }, [data]);

  return (
    <table>
      <tr>
        <th>Site Rank</th>
        <th>AEB</th>
      </tr>
      {dataToDisplay.map((d, i) => (
        <tr>
          <td>{i + 1}</td>
          <td>{"$" + kFormatter(d.Ab_S_BAE, "$")}</td>
        </tr>
      ))}
    </table>
  );
}
