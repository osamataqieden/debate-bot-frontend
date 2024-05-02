import { useEffect, useState } from 'react'
import Debate from './debate'
import DebateResult from './result'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [debateTopics, setDebateTopics] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [sessionID, setSessionID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customTopic, setCustomTopic] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [debateResult, setDebateResults] = useState(null);

  useEffect(() => {
    if (debateTopics == null) {
      fetch("http://127.0.0.1:8000/debate/get_possible_topics")
        .then((data) => data.json())
        .then((data) => {
          setDebateTopics(data);
          setIsLoading(false);
        });
    }
  }, []);

  let selectTopic = (topic) => {
    setIsLoading(true);
    fetch(`http://127.0.0.1:8000/debate/select_topic?topic_selected=${topic.topicTitle}`, {
      method: "POST"
    })
      .then((response) => response.json())
      .then((data) => {
        setSessionID(data.session_key);
        setSelectedTopic(topic.topicTitle);
        setIsLoading(false);
      });
  }

  let selectPosition = (position) => {
    setIsLoading(true);
    fetch(`http://127.0.0.1:8000/debate/start_session?session_key=${sessionID}&position=${position}`, {
      method: "POST"
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setIsStarted(true);
      });
  };

  let finishDebate = () => {
    setIsLoading(true);
    fetch(`http://127.0.0.1:8000/debate/finish_session?session_key=${sessionID}`, {
      method: "POST"
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setIsFinished(true);
        setDebateResults(data);
      });

  }

  if (isLoading) {
    return (
      <>
        Loading ...
      </>
    );
  }

  if (isStarted == false && isFinished == false) {
    return (
      <>
        <div className='app-introduction'>
          <h2>
            The Debate App.
          </h2>
          <h3>
            Improve your debating skills or practice for a debate by choosing a topic and debating Gemini!.
          </h3>
          <p>
            Once you are done, Gemini will give you feedback and provide you with tips on how to improve your debate skills.
          </p>
        </div>
        {selectedTopic == null &&
          <>
            <p className='big-title'>
              You can select on the below topics suggested by Gemini:
            </p>
            <div className='topics-container'>
              {debateTopics != null && debateTopics.map(topic =>
                <div className='topic' onClick={() => selectTopic(topic)}>
                  <h2>
                    {topic.topicTitle}
                  </h2>
                  <p>
                    {topic.topicDesc}
                  </p>
                </div>
              )}
            </div>
            <p className='big-title'>
              Or if you have a topic in mind you can enter it below
            </p>
            <div className='custom-topic-container'>
              <input type='text' value={customTopic} onInput={e => setCustomTopic(e.target.value)} placeholder='Your Topic' />
              <button onClick={() => selectTopic({ topicTitle: customTopic })}>
                Choose Topic
              </button>
            </div>
          </>
        }
        {selectedTopic != null &&
          <div className='position-selector-container'>
            <h4 className='big-title'>You have selected the topic: {selectedTopic}</h4>
            <p>What position would you like to select ?</p>
            <div className='position-buttons-container'>
              <button onClick={() => selectPosition(1)}>
                For
              </button>
              <button onClick={() => selectPosition(0)}>
                Against
              </button>
            </div>
          </div>
        }
      </>
    )
  }

  if (isStarted == true && isFinished == false) {
    return (
      <>
        <Debate
          sessionID={sessionID}
          debateTopic={selectedTopic}
          finishDebate={finishDebate}
        />
      </>
    );
  }

  if (isStarted == true && isFinished == true) {
    return (
      <>
        <DebateResult debateResult={debateResult} />
      </>
    )
  }

}

export default App
