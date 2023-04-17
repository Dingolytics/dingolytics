// import React from 'react'

export const Application = () => {
  const env = process.env.NODE_ENV
  return (
    <div>
      Hello, this is my React application.
      Environment: {env}
    </div>
  )
}