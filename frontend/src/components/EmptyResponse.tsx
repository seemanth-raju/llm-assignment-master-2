import React from 'react'

const EmptyResponse = () => {
  return (
    <div className="flex flex-col justify-center items-center p-8 absolute bottom-0 left-0 right-0 mb-20">
      <div className="text-center mb-8">
        <p className="text-3xl font-bold text-gray-900 mb-2">Oops!</p>
        <p className="text-gray-700">Looks like you haven't entered a question or uploaded a file.</p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-gray-900 mb-2">Don't Miss Out!</p>
        <p className="text-gray-700">Enter a question or upload a file to unlock amazing features.</p>
      </div>
    </div>
  )
}

export default EmptyResponse