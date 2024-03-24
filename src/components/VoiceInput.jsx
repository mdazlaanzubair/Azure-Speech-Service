import React, { useEffect, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const languageOptions = [
  { value: "en-US", label: "English - United States" },
  { value: "en-GB", label: "English - United Kingdom" },
  { value: "en-IN", label: "English - India" },
  { value: "ur-IN", label: "Urdu - India" },
  { value: "hi-IN", label: "Hindi - India" },
  { value: "pa-IN", label: "Punjabi - India" },
  { value: "ps-AF", label: "Pashto - Afghanistan" },
];

const VoiceInput = ({ setKeyword }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("ur-IN");

  // STATE TO HOLD TRANSCRIPT OF AUDIO
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");

  // FUNCTION TO TRANSCRIBE AUDIO
  // const audioTranscriber = async () => {
  //   // TOGGLING RECORDING STATE
  //   setIsRecording(true);

  //   // SETTING SPEECH CONFIG
  //   const speechConfig = sdk.SpeechConfig.fromSubscription(
  //     import.meta.env.VITE_AZURE_SPEECH_KEY_1,
  //     import.meta.env.VITE_AZURE_SPEECH_REGION
  //   );

  //   // LANGUAGE AUTO DETECTOR
  //   speechConfig.speechRecognitionLanguage = "en-IN";

  //   // INITIALING AZURE SPEECH RECOGNIZER AND AUDIO CONFIG
  //   const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
  //   const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  //   // RUNNING RECOGNIZER
  //   recognizer.recognizeOnceAsync((result) => {
  //     let transcription = "";
  //     console.log(result);

  //     // RECOGNIZING FINAL RESULTS
  //     if (result.reason === sdk.ResultReason.EndOfStream) {
  //       setKeyword(result.text ?? "");
  //     }

  //     if (result.text) transcription = result.text;
  //     else transcription = "Recognition Failed! Ensure your mic is working.";

  //     // SETTING TRANSCRIPTION IN STATE
  //     setTranscript(transcription ?? "");
  //   });

  //   // TOGGLING RECORDING STATE
  //   setIsRecording(false);
  // };

  // FUNCTION TO TRANSCRIBE AUDIO

  const audioTranslator = async () => {
    // TOGGLING RECORDING STATE
    setIsRecording(true);

    // SETTING TRANSLATION CONFIG
    const translateConfig = sdk.SpeechTranslationConfig.fromSubscription(
      import.meta.env.VITE_AZURE_SPEECH_KEY_1,
      import.meta.env.VITE_AZURE_SPEECH_REGION
    );

    // SETTING LANGUAGES
    translateConfig.speechRecognitionLanguage = sourceLanguage;
    translateConfig.addTargetLanguage("en");

    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const translateRecognizer = new sdk.TranslationRecognizer(
      translateConfig,
      audioConfig
    );

    // RUNNING RECOGNIZER
    await translateRecognizer.recognizeOnceAsync((result) => {
      // RECOGNIZING AND SETTING FINAL RESULTS IN LOCAL STATE
      setTranscript(result.text ?? "");
      setTranslation(result.translations.get("en") ?? "");
    });
  };

  useEffect(() => {
    if (translation?.length > 0) {
      // SETTING SEARCH KEYWORD
      setKeyword(translation);

      // TOGGLING RECORDING STATE
      setIsRecording(false);
    }
  }, [transcript, translation]);

  return (
    <div className="w-full">
      <h1 className="text-center font-semibold text-xl mb-0 text-slate-950">
        Realtime Speech Recognition
      </h1>
      <div className="flex items-center gap-3 my-5">
        {isRecording && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-slate-950 animate-spin"
          >
            <path
              fillRule="evenodd"
              d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <p className="bg-blue-200 p-2 rounded-md w-full text-slate-800 font-medium">
          {transcript ? transcript : "Recognized Speech"}
        </p>
        <p className="bg-green-200 p-2 rounded-md w-full text-slate-800 font-medium">
          {translation ? translation : "Interpreted Speech"}
        </p>
      </div>
      <div className="actions flex justify-end items-center gap-3 py-5 border-t">
        {/* <button
          type="button"
          className="flex items-center gap-3 px-3 py-2 rounded-sm font-bold bg-slate-200 text-slate-800 hover:bg-slate-950 hover:text-slate-300 transition-all ease-in-out duration-300"
          onClick={audioTranscriber}
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
        </button> */}

        <select
          name="sourceLanguage"
          onChange={(e) => setSourceLanguage(e.target.value)}
          defaultValue={sourceLanguage}
        >
          {languageOptions?.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        {isRecording ? (
          <button
            disabled={isRecording}
            type="button"
            className="flex items-center gap-2 p-2 rounded font-bold bg-slate-200 text-slate-800"
            onClick={audioTranslator}
          >
            <span>Listening</span>
          </button>
        ) : (
          <button
            disabled={isRecording}
            type="button"
            className="flex items-center gap-2 p-2 rounded font-bold bg-slate-200 text-slate-800 hover:bg-slate-950 hover:text-slate-300 transition-all ease-in-out duration-300"
            onClick={audioTranslator}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
              />
            </svg>

            <span>Start Listening</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;
