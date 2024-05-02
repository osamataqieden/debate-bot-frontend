import { useEffect, useState, useRef } from 'react'
import { RecordAudio, useRecorder } from 'react-microphone-recorder'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Debate({ sessionID, debateTopic, finishDebate }) {
    const { audioLevel, startRecording, pauseRecording, stopRecording, resetRecording, time, audioURL, recordingState, isRecording, audioFile } = useRecorder();
    const [isSendingFile, setIsSendingFile] = useState(false);
    const [messeges, setMesseges] = useState([]);
    const messagesDiv = useRef(null);

    useEffect(() => {
        if (messagesDiv != null && messagesDiv.current != null) {
            const scrollHeight = messagesDiv.current.scrollHeight;
            messagesDiv.current.scrollTo(0, scrollHeight);
        }
    });

    let sendFile = async () => {
        setIsSendingFile(true);
        let formData = new FormData();
        formData.append("audio_file", audioFile);
        const resp = await fetch(`http://127.0.0.1:8000/debate/session/submit_audio_and_get_response?session_key=${sessionID}`, {
            method: "POST",
            body: formData
        })
        const data = await resp.json()
        setIsSendingFile(false);
        setMesseges(() =>
            [
                ...messeges,
                { isUser: true, text: data.ArgumentText },
                { isUser: false, text: data.Response }
            ]
        );
        resetRecording();
    }

    let recordingFragment = <div className='debate-buttons-container'>
        {recordingState != "recording" && <button onClick={() => startRecording()}>
            Start Recording
        </button>}
        {recordingState == "recording" &&
            <>
                <p>
                    Recording ...
                </p>
                <button onClick={() => stopRecording()}>
                    Stop Recording
                </button>
            </>
        }
        {recordingState == "stopped" &&
            <>
                <button onClick={() => sendFile()}>
                    Send File
                </button>
            </>
        }
        <button onClick={() => finishDebate()}>
            Finish Debate!.
        </button>
    </div>

    return (
        <>
            <div className='debate-container'>
                <div><h2>{debateTopic}</h2></div>
                <div className='debate-messages-container' ref={messagesDiv}>
                    {messeges.map(messege =>
                        <div className="messege">
                            <p className='message-author'>
                                <b>
                                    {messege.isUser && <span>You</span>}
                                    {messege.isUser == false && <span>Gemini</span>}
                                </b>
                            </p>
                            <p>
                                {messege.text}
                            </p>
                        </div>
                    )}
                </div>
                {isSendingFile && <div>Loading ...</div>}
                {!isSendingFile && recordingFragment}
            </div>
        </>
    )
}

export default Debate;