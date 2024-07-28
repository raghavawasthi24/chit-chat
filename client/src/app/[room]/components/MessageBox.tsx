import React from 'react'

export default function MessageBox({data}:any) {
  return (
    <div className='w-full '>
      {data.type == "receiver" ? (
        <p className="bg-gray-600 text-white w-fit ">{data.message}</p>
      ) : (
        <p className="bg-blue-500 text-white w-fit text-end">{data.message}</p>
      )}
    </div>
  );
}
