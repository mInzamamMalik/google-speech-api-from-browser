import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import RecordRTC from "recordrtc";
import hark from "hark";
import getUserMedia from 'getusermedia'
import Siriwave from 'react-siriwave';








function App() {

  const socket = io();
  // const socket = io("https://server-domain.com"); // incase of different server
  socket.on('connect', function () {
    setIsSocketConnected(true)
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(true);
  const [recordAudio, setRecordAudio] = useState({})
  const [file, setFile] = useState(null)
  const [amplitude, setAmplitude] = useState(0)

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
            setFile(files);
            setIsRecording(false)
          });
        });

      }, 3000);


      getUserMedia({ video: false, audio: true }, function (err, stream) {
        // if the browser doesn't support user media
        // or the user says "no" the error gets passed
        // as the first argument.
        if (err) {
          console.log('failed');
        } else {
          console.log('got a stream', stream);

          var speechEvents = hark(stream, {});

          speechEvents.on('speaking', function (e) {
            console.log('speaking', e);
            speechEvents.on('volume_change', function (e) {
              // console.log('volume_change', e);
              let amplitude = 3 - (e - -40) / -10; // scaling -50 - -20 to 0 - 3

              if (amplitude < 0) amplitude = 0.5;
              if (amplitude > 4) amplitude = 4;

              // console.log(e, ' amplitude ', amplitude);
              setAmplitude(amplitude)
            });
          });

          speechEvents.on('stopped_speaking', function (e) {
            console.log('stopped_speaking', e);
            speechEvents.stop();
            setAmplitude(prev => 0)
          });
        }
      });
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
      {amplitude}

      <Siriwave style='ios9' lerpSpeed={0.2} speed={0.3} amplitude={amplitude} />

      <div style={{
        display: "flex",
        justifyContent: "center",
        height: "200px",
        alignItems: "center",
      }}>
        <div style={{
          borderWidth: amplitude * 20,
          borderColor: 'white',
          borderStyle: 'solid',
          minHeight: "50px",
          minWidth: "50px",
          backgroundColor: "red",
          borderRadius: "50%"
        }}></div>

      </div>

      <button
        onClick={async () => {
          const audioRecorder = await startRec()

          setRecordAudio(audioRecorder)
          setIsRecording(true);





        }}
        disabled={isRecording || !isSocketConnected}>Start recording</button>

      {isRecording ? <p>Recording audio....</p> : null}
      {!isSocketConnected ? <p>Connecting to server....</p> : null}

      <br />
      <br />
      <br />
      {file?.audio?.dataURL ? <audio controls src={file?.audio?.dataURL}></audio> : null}


    </div >
  );
}

export default App;
