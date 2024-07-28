import React from 'react'

export default function MessageBox({data}:any) {
  return (
    <p
      className={`text-white p-2 rounded-lg ${
        data.type === "receiver" ? "bg-gray-600" : "bg-blue-500"
      }`}
    >
      {data.message}
    </p>
  );
}
