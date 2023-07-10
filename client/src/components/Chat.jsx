import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserContext";
import Avatar from "./Avatar";
import axios from "axios";
import { random, uniqBy } from "lodash";
import Contact from "./Contact";

const Chat = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const { userName, id } = useContext(UserContext);
  const [ws, setWs] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [offlinePeople, setOfflinePeople] = useState({});
  const divUnderMessages = useRef();

  useEffect(() => {
    connectToWS();
    console.log(selectedUserId)
  }, []);

  function connectToWS() {
    const ws = new WebSocket("ws://localhost:3000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => connectToWS());
  }

  function toggleSelection(userId) {
    if (selectedUserId !== null && selectedUserId !== userId) {
      setSelectedUserId(userId);
    } else if (selectedUserId === null) {
      setSelectedUserId(userId);
    }
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, userName }) => {
      people[userId] = userName;
    });
    setOnlinePeople(people);
  }

  const onlinePeopleExclUser = { ...onlinePeople };
  delete onlinePeopleExclUser[id];
  function sendMessage(ev, file = null) {
    if (ev) ev.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
        file,
      })
    );
    setNewMessageText("");
    setMessages((prev) => [
      ...prev,
      {
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ]);
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const data = res.data;
      const offline = data.users
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));

      setOfflinePeople(offline);
      console.log(offlinePeople)
    });
  }, [onlinePeople]);

  const messagesWithoutDupes = uniqBy(messages, "_id");
  console.log(selectedUserId)
  return (
    <div className="flex h-screen overflow-hidden">
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
          <Contact
            id={userId}
            userName={onlinePeopleExclUser}
            onClick={setSelectedUserId(userId)}
            selected={userId === selectedUserId}
          />
        ))}{" "}
        {Object.values(offlinePeople).map((person) => (
          <div
            className={`text-white flex cursor-pointer + ${
              selectedUserId ? "bg-gray-800" : ""
            }`}
            onClick={() => onClick(id)}
          >
            {id === selectedUserId && (
              <div className="w-1 bg-blue-500 h-18 rounded-r-md"></div>
            )}
            <div className="flex gap-4 pl-4 py-4 items-center text-xl capitalize">
              <Avatar userId={id} userName={userName} online={false} />
              {person.userName}
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
          {selectedUserId && (
            <div className="">
              <div className="text-white absolute right-0 overflow-y-scroll w-[75%] h-[85%]">
                {messagesWithoutDupes.map((message, key) => (
                  <>
                    <div
                      key={key}
                      className={
                        message.sender === id ? "text-right" : "text-left"
                      }
                    >
                      <div
                        className={
                          "text-left inline-block max-w-[30%] px-4 py-2 my-2 rounded-xl text-md font-bold " +
                          (message.sender === id
                            ? "bg-blue-500 text-white mr-6"
                            : "bg-white text-gray-500 ml-6")
                        }
                      >
                        {message.text}
                        {message.file && (
                          <div className="">
                            <a
                              target="_blank"
                              className="flex items-center gap-1 border-b"
                              href={
                                axios.defaults.baseURL +
                                "/uploads/" +
                                message.file
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {message.file}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ))}
                <div ref={divUnderMessages} />
              </div>
            </div>
          )}
        </div>
        {selectedUserId && (
          <form
            className="flex gap-4 m-3 absolute bottom-2 w-[72%]"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              className="bg-[#20232b] border text-gray-200 p-2 rounded-3xl flex-grow pl-5"
              placeholder="Type your message here ...."
              onChange={(ev) => setNewMessageText(ev.target.value)}
              value={newMessageText}
            />
            <button
              type="submit"
              className="bg-blue-500 p-2 text-white rounded-full"
            >
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
