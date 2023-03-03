# google-speech-api-from-browser

references:

1) https://medium.com/google-cloud/building-your-own-conversational-voice-ai-with-dialogflow-speech-to-text-in-web-apps-part-i-b92770bd8b47
2) https://medium.com/google-cloud/building-a-client-side-web-app-which-streams-audio-from-a-browser-microphone-to-a-server-part-ii-df20ddb47d4e
3) https://medium.com/google-cloud/building-a-web-server-which-receives-a-browser-microphone-stream-and-uses-dialogflow-or-the-speech-62b47499fc71
4) https://medium.com/google-cloud/getting-audio-data-from-text-text-to-speech-and-play-it-in-your-browser-part-iv-cd2d6ea71c6a

making a working example is due



auto stop on silence with hark.js
https://www.npmjs.com/package/hark
sample: https://github.com/muaz-khan/RecordRTC/blob/master/simple-demos/auto-stop-on-silence.html



conclusion: it is not supposed to work from browser, audio stream will goto server first and then goto google cloud api