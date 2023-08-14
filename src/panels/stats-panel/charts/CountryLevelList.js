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
  // console.log(countries)
  // console.log(highlightFIDs)

  useEffect(() => {
    const data = countries
      .map((c) => `${host}/country_data/${c}.json`)
      .map((p) => fetch(p).then((res) => res.json()));
    // console.log('FETCH HAPPENED')
    Promise.all(data).then((v) => {
      // console.log(v.flat())
      setData(v.flat());
    });
  }, [countries]);

  useEffect(() => {
    console.log(data);
    const data1 = data.sort((a, b) => b.Ab_S_BAE - a.Ab_S_BAE).slice(0, 5);
    // Highlight FIDs and OID currently don't match!
    // const data2 = data.filter(x => highlightFIDs.includes(x.OID_.toString()))
    // console.log(data2)
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
