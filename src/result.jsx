function DebateResult({ debateResult }) {
    return (
        <>
            <div>
                <h2>
                    Debate Finished!.
                </h2>
                <p>
                    Topic was <b>{debateResult.user_session.topic_selected}</b>
                </p>
                <p>
                    Here's how Gemini rated your argument:
                </p>
                <p>
                    Overall:  <b>{debateResult.OverallRating}</b>
                </p>
                <p>
                    Argument Strength: <b>{debateResult.ArgumentStrengthRatingNumerical}</b>
                </p>
                <p>
                    <b><i>Why?: </i></b> {debateResult.ArgumentStrengthRatingDescription}
                </p>
                <p>
                    Speaking Skills: {debateResult.ArgumentSpeakingRatingNumerical}
                </p>
                <p>
                    <b><i>Why?: </i></b> {debateResult.ArgumentSpeakingRatingDescription}
                </p>
            </div>
            <div>
                <h3><b>The Debate:</b></h3>
                {debateResult.user_session.conversation.map(messege =>
                    <div className="messege">
                        <p className='message-author'>
                            <b>
                                {messege.type == "user" && <span>You</span>}
                                {messege.type == "system" && <span>Gemini</span>}
                            </b>
                        </p>
                        <p>
                            {messege.text}
                        </p>
                    </div>
                )}
            </div>
        </>
    )
}

export default DebateResult;