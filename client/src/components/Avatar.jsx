import React from "react";

const Avatar = ({ userId, userName }) => {
  const colors = [
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-cyan-200",
    "bg-blue-200",
  ];
    const userIdBase10 = parseInt(userId, 16);
    const colorIndex = userIdBase10 % colors.length
    const color = colors[colorIndex]
  return (
    <div>
      <div className={`h-8 w-8 bg-red-200 rounded-full font-black text-center flex items-center ${color}`}>
        <div className="text-center w-full">{userName[0]}</div>
      </div>
    </div>
  );
};

export default Avatar;
