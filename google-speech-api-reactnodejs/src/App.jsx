import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { io } from 'socket.io-client';



function App() {

  const socket = io();
  // const socket = io("https://server-domain.com"); // incase of different server
  socket.on('connect', function () {
    setIsSocketConnected(true)
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(true);

  useEffect(() => {
    if (isRecording) {
      setTimeout(() => {
        setIsRecording(false)
      }, 3000);
    }
  }, [isRecording]);



  return (
    <div className="App">

      <button onClick={() => {
        setIsRecording(true);
      }} disabled={isRecording || !isSocketConnected}>Start recording</button>

      {isRecording ? <p>Recording audio....</p> : null}
      {!isSocketConnected ? <p>Connecting to server....</p> : null}


    </div>
  );
}

export default App;
