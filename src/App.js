import './App.css';
import Map from './Map'
import { useState } from 'react';
import { StagingLogin } from 'staging/auth';

function App() {
  const [authed, setAuthed] = useState(false);

  return (
    <div className="App">
      {process.env.REACT_APP_USE_SITE_GATING === 'true' && !authed ? (
        <StagingLogin setAuthed={setAuthed} />
      ) : (
        <Map />
      )}
    </div>
  );
}

export default App;
