import "./App.css";
import Map from "./Map";
import { useState } from "react";
import { StagingLogin } from "./staging/auth";
import ReactGA from "react-ga4";

ReactGA.initialize("G-YTXMLHYTSE", {
  testMode: process.env.NODE_ENV !== "production",
});

function App() {
  const [authed, setAuthed] = useState(false);

  return (
    <div className="App">
      {process.env.REACT_APP_USE_SITE_GATING === "true" && !authed ? (
        <StagingLogin setAuthed={setAuthed} />
      ) : (
        <Map />
      )}
    </div>
  );
}

export default App;
