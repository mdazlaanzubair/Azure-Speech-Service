import React, { useEffect, useRef, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const VoiceInputCopy = () => {
  // STATE TO HOLD RECORDING STATUS
  const [isRecording, setIsRecording] = useState(false);

  // STATE TO HOLD TRANSCRIPT OF AUDIO
  const [transcript, setTranscript] = useState("");

  // STATE TO HOLD RECORDINGS
  const [recordings, setRecordings] = useState([]);

  // AVOID RERENDERING ISSUE USING REF TO HOLD AUDIO CHUNKS
  const audioChunks = useRef([]);

  // CREATING REFERENCE FOR MEDIA RECORDER TO MANIPULATE LATER ON
  const mediaRecorderRef = useRef(null);

  // FUNCTION TO RECORD STREAM
  const startStreaming = async () => {
    // TOGGLING RECORDING STATE
    setIsRecording(true);

    // RESET AUDIO CHINKS FOR FRESH START
    audioChunks.current = [];

    // RECEIVING AUDIO STREAM FROM USER MEDIA DEVICE
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // RECORDING STREAM IN BROWSER MEDIA RECORDER
    const mediaRecorder = new MediaRecorder(stream);

    // STORING RECORDING INTO AUDIO CHUNKS VARIABLE
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.current.push(e.data);
      }
    };

    // CONVERTING STORED AUDIO CHUNKS INTO BLOBS WHEN STREAMING STOPS
    mediaRecorder.onstop = () => {
      if (audioChunks.current) {
        // CREATING AUDIO BLOB
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });

        // CREATING AUDIO BLOB URL
        const audioBlobUrl = URL.createObjectURL(audioBlob);

        // SAVING AUDIO URLS AS RECORDINGS
        setRecordings([
          ...recordings,
          {
            url: audioBlobUrl,
            blob: audioBlob,
          },
        ]);

        // STOP AUDIO STREAM
        stream.getTracks().forEach((track) => track.stop());
      }
    };

    // ATTACHING MEDIA RECORDER WITH ITS REFERENCE
    mediaRecorderRef.current = mediaRecorder;

    // START RECORDING AS SOON AS USER ALLOWS
    mediaRecorder.start();
  };

  // FUNCTION TO STOP STREAMING
  const stopStreaming = async () => {
    // TOGGLING RECORDING STATE
    setIsRecording(false);

    // GETTING MEDIA RECORDER INSTANCE TO CLOSE STREAMING
    const mediaRecorder = mediaRecorderRef.current;

    // TURNING OFF THE MEDIA RECORDER FROM ITS REFERENCE
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      console.log("Streaming stopped!");
      mediaRecorder.stop();
    }
  };

  // FUNCTION REMOVE RECORDING
  const removeRecording = (recordingIndex) => {
    setRecordings([
      ...recordings.slice(0, recordingIndex),
      ...recordings.slice(recordingIndex + 1),
    ]);
  };

  // FUNCTION TO TRANSCRIBE RECORDED AUDIO
  const transcribeAudio = async (recording) => {
    // SETTING SPEECH CONFIG
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      import.meta.env.VITE_AZURE_SPEECH_KEY_1,
      import.meta.env.VITE_AZURE_SPEECH_REGION
    );

    // SETTING SOURCE LANGUAGE
    speechConfig.speechRecognitionLanguage = "en-IN"; // en-IN - en-US

    // SETTING AUDIO CONFIG
    const audioConfig = sdk.AudioConfig.fromWavFileInput(recording.blob);

    // INITIALIZING SPEECH RECOGNIZER
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    // RECOGNIZING REAL-TIME RESULTS
    recognizer.recognizing = (speechRecognitionResult) => {
      console.log("Recognizing:", speechRecognitionResult.text);
    };

    // RECOGNIZING FINAL RESULTS
    recognizer.recognized = (speechRecognitionResult) => {
      if (speechRecognitionResult.reason === sdk.ResultReason.EndOfStream) {
        console.log("Final transcript:", speechRecognitionResult.text);
        setTranscript(speechRecognitionResult.text); // Update transcript state
      }
    };

    // HANDLING RECOGNITION CANCELLING
    recognizer.canceled = (speechRecognitionCancellationEventArgs) => {
      console.error(
        "Speech recognition canceled:",
        speechRecognitionCancellationEventArgs.reason
      );
    };

    // HANDLING RECOGNITION ERRORS
    recognizer.speechRecognitionError = (error) => {
      console.error("Speech recognition error:", error);
    };

    // RUNNING RECOGNIZER
    await recognizer.startContinuousRecognitionAsync(audioConfig);
    await recognizer.stopContinuousRecognitionAsync();
  };

  return (
    <div className="w-full">
      <div className="header">
        <h1 className="text-center font-black text-xl mb-0 text-slate-950">
          Speech To Text
        </h1>
        <h2 className="text-center font-normal text-base text-slate-800">
          Realtime Speech Recognition
        </h2>
      </div>
      <div className="body">
        {isRecording && <RecordingInProgress />}

        <ShowTranscription text={transcript} />

        {recordings?.length > 0 && (
          <ListRecordings
            audios={recordings}
            removeRecording={removeRecording}
            transcribeAudio={transcribeAudio}
          />
        )}
      </div>

      <div className="actions flex justify-between items-center gap-1 py-5 border-t">
        <button
          type="button"
          className="px-3 py-2 rounded-sm font-bold bg-slate-200 text-slate-800 hover:bg-slate-950 hover:text-slate-300 transition-all ease-in-out duration-300"
        >
          Copy Speech
        </button>
        {isRecording ? (
          <button
            type="button"
            className="flex items-center gap-3 px-3 py-2 rounded-sm font-bold bg-slate-200 text-slate-800 animate-pulse"
            onClick={stopStreaming}
          >
            <span>Speak in your Mic</span>
          </button>
        ) : (
          <button
            type="button"
            className="flex items-center gap-3 px-3 py-2 rounded-sm font-bold bg-slate-200 text-slate-800 hover:bg-slate-950 hover:text-slate-300 transition-all ease-in-out duration-300"
            onClick={startStreaming}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
              <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
            </svg>
            <span>Start Listening</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceInputCopy;

// LOADER COMPONENT FOR RECORDING IN PROGRESS
const RecordingInProgress = () => {
  return (
    <div className="flex items-center gap-3 p-3 my-5 rounded-md bg-slate-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 text-slate-800 animate-spin"
      >
        <path
          fillRule="evenodd"
          d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
          clipRule="evenodd"
        />
      </svg>
      <p className=" text-slate-800 font-medium animate-pulse">
        Speak into you microphone
      </p>
    </div>
  );
};

// TRANSCRIPTION COMPONENT TO SHOW THE TRANSCRIBED AUDIO TEXT
const ShowTranscription = ({ text }) => {
  return (
    <div className="flex items-center gap-3 p-3 my-5 rounded-md bg-slate-100">
      <p className="text-slate-950 font-medium">
        {text ? text : "Your speech goes here"}
      </p>
    </div>
  );
};

// AUDIO LISTING COMPONENT TO HOLD THE USER RECORDING LIST
const ListRecordings = ({ audios, removeRecording, transcribeAudio }) => {
  console.log("audios", audios);
  return (
    <div className="flex flex-col justify-center items-center gap-1">
      {/* DYNAMICALLY POPULATING THE AUDIO STREAMS / RECORDINGS */}
      {audios?.map((audio, index) => (
        <div
          key={index}
          className="w-full flex justify-between items-center gap-3 px-3 rounded-md bg-slate-100"
        >
          <audio src={audio?.url} controls className="w-full" />
          <div className="h-full w-[.05rem] bg-slate-300 text-transparent">
            |
          </div>
          <div className="flex items-center gap-2">
            <a type="button" href={audio?.url} className="h-full" download>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-slate-950"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <button
              type="button"
              className="h-full"
              onClick={() => transcribeAudio(audio)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-slate-950"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 1 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              type="button"
              className="h-full"
              onClick={() => removeRecording(index)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-red-500"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
