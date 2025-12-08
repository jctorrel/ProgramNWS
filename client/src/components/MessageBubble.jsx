import React from "react";
import { marked } from "marked";

marked.setOptions({ breaks: true });

function MessageBubble({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={"msg-row " + (isUser ? "me" : "mentor")}>
      <div className={"msg " + (isUser ? "me" : "mentor")}>
        {!isUser && <span className="label">Mentor</span>}
        {isUser ? (
          message.content
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: marked.parse(message.content || "")
            }}
          />
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
