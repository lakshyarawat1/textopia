import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import Avatar from "./Avatar";

const Chat = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const { userName, id } = useContext(UserContext);
  const [ws, setWs] = useState(null);
  const [newMessageText, setNewMessageText] = useState('')

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    }
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, userName }) => {
      people[userId] = userName;
    });
    setOnlinePeople(people);
  }

  function toggleSelection(userId) {
    if (selectedUserId !== null && selectedUserId !== userId) {
      setSelectedUserId(userId);
    } else if (selectedUserId === null) {
      setSelectedUserId(userId);
    } else if (selectedUserId === userId) {
      setSelectedUserId(null);
    }
  }

  const onlinePeopleExclUser = { ...onlinePeople }
  delete onlinePeopleExclUser[id]

  function sendMessage(ev)
  {
    ev.preventDefault();
    ws.send(JSON.stringify({
      message: {
        recipient: selectedUserId,
        text : newMessageText,
      }
    }))
  }

  return (
    <div className="flex h-screen">
      <div className="bg-[#1d1e24] w-1/4">
        <div className="text-[#5953d4] font-semibold text-5xl flex gap-5 m-2 py-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 m-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
          Textopia
        </div>
        {Object.keys(onlinePeopleExclUser).map((userId) => (
          <div
            className={`text-white flex cursor-pointer + ${(selectedUserId ? 'bg-gray-800' : '')}`}
            onClick={() => toggleSelection(userId)}
          >
            {userId === selectedUserId && (
              <div className="w-1 bg-blue-500 h-18 rounded-r-md"></div>
            )}
            <div className="flex gap-4 pl-4 py-4 items-center text-xl capitalize">
              <Avatar userId={userId} userName={userName} />
              {onlinePeople[userId]}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#20232b] w-3/4 flex flex-col">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full items-center justify-center">
              <div className="text-gray-400 text-2xl">
                &larr; Select a conversation to start chatting
              </div>
            </div>
          )}
          {selectedUserId && <div className="text-white"></div>}
        </div>
        {selectedUserId && (
          <form className="flex gap-2 m-3" onSubmit={sendMessage}>
            <input
              type="text"
              className="bg-[#20232b] border text-gray-200 p-2 rounded-3xl flex-grow pl-5"
              placeholder="Type your message here ...."
              onChange={(ev) => setNewMessageText(ev.target.value)}
            />
            <button type='submit' className="bg-blue-500 p-2 text-white rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
