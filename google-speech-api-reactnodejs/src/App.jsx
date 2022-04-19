import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import RecordRTC from "recordrtc";


function App() {

  const socket = io();
  // const socket = io("https://server-domain.com"); // incase of different server
  socket.on('connect', function () {
    setIsSocketConnected(true)
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(true);
  const [recordAudio, setRecordAudio] = useState({})

  useEffect(() => {
    if (isRecording) {
      setTimeout(() => {
        console.log("recordAudio: ", recordAudio);

        recordAudio.stopRecording(function () {

          console.log("recordAudio: ", recordAudio);

          recordAudio.getDataURL(function (audioDataURL) {
            var files = {
              audio: {
                type: recordAudio.getBlob().type || 'audio/wav',
                dataURL: audioDataURL
              }
            };
            console.log("files: ", files);
            socket.emit('message', files);
          });
        });



        setIsRecording(false)

      }, 3000);
    }
  }, [isRecording]);


  function startRec() {
    return new Promise((resolve, reject) => {

      navigator.getUserMedia({
        audio: true
      }, function (stream) {

        console.log("mic: ", stream);

        let audioRecorder = RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/webm',
          sampleRate: 44100,
          desiredSampRate: 16000,
          recorderType: RecordRTC.MediaStreamRecorder,
          numberOfAudioChannels: 1
        });
        audioRecorder.startRecording();

        resolve(audioRecorder)
      }, function (error) {
        console.error(JSON.stringify(error));
        reject(JSON.stringify(error))
      });
    })
  }


  return (
    <div className="App">

      <button
        onClick={async () => {
          const audioRecorder = await startRec()


          setRecordAudio(audioRecorder)
          setIsRecording(true);
        }}
        disabled={isRecording || !isSocketConnected}>Start recording</button>

      {isRecording ? <p>Recording audio....</p> : null}
      {!isSocketConnected ? <p>Connecting to server....</p> : null}


    </div>
  );
}

export default App;
