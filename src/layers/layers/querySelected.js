import React from "react";
import { kFormatter } from "../../utils/formattingUtils";
import "./metrics-panel.css";

const sum = (acc, cur) => {
  return acc + cur;
};

function PeopleProtected(props) {
  return (
    <div classname="perc-people-protected-container">
      {/* <WomenIcon 
            id='perc-people-protected-icon'
            classname='perc-people-protected-icon' /> */}
    </div>
  );
}

function PostStorm_Floodmasks_PostStorm({ selectedFeatures }) {
  const totalStock = selectedFeatures
    .map((x) => x.properties.TOT_STOCK)
    .reduce(sum, 0);
  const mangroves1996 = selectedFeatures
    .map((x) => x.properties.Man1996)
    .reduce(sum, 0);
  const mangroves2015 = selectedFeatures
    .map((x) => x.properties.Man2015)
    .reduce(sum, 0);
  const stock1996 = selectedFeatures
    .map((x) => x.properties.Stock1996)
    .reduce(sum, 0);
  const stock2015 = selectedFeatures
    .map((x) => x.properties.Stock2015)
    .reduce(sum, 0);
  return (
    <>
      <PeopleProtected />
      <div
        style={{
          textAlign: "left",
          padding: "10px",
        }}
      >
        Total Stock: {kFormatter(totalStock)} <br></br>
        Mangroves 1996: {mangroves1996} <br></br>
        Mangroves 2015: {mangroves2015} <br></br>
        Stock 1996: {kFormatter(stock1996)} <br></br>
        Stock 2015: {kFormatter(stock2015)} <br></br>
      </div>
    </>
  );
}

export const query_functions = {
  A: PostStorm_Floodmasks_PostStorm,
  "PostStorm|AreaFlooded|RP50": PostStorm_Floodmasks_PostStorm,
  "PostStorm|AreaFlooded|RP100": PostStorm_Floodmasks_PostStorm,
};
