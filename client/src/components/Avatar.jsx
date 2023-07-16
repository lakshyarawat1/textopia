import React from "react";

const Avatar = ({ userId, userName, online }) => {
  const colors = [
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-cyan-200",
    "bg-blue-200",
  ];
  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
  const username = Object.values(userName);
  return (
    <div>
      <div
        className={`h-10 w-10 relative bg-red-200 rounded-full font-black text-center flex items-center ${color}`}
      >
        <div className="text-center text-black w-full capitalize">
          {username[0].charAt(0)}
        </div>
        {online ? (
          <div className="absolute w-3 h-3 bg-green-400 border border-black bottom-0 right-0 rounded-full"></div>
        ) : (
          <div className="absolute w-3 h-3 bg-red-400 border border-black bottom-0 right-0 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default Avatar;
