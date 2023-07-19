import React from "react";
import Avatar from "./Avatar";

const Contact = ({ id, selected, onClick, online, userName }) => {

  

  return (
    <div
      key={id}
      onClick={() => onClick(id)}
      className={`text-white flex cursor-pointer + ${
        selected ? "bg-gray-800" : ""
      }`}
    >
      {id === selected && (
        <div className="w-1 bg-blue-500 h-18 rounded-r-md"></div>
      )}
      <div className="flex gap-4 pl-4 py-4 items-center text-xl capitalize">
        <Avatar userId={id} userName={userName} online={online} />
        {userName}
      </div>
    </div>
  );
};

export default Contact;
