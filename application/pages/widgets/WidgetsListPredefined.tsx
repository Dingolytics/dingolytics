import React from 'react'

type _Props = {
  queryId: string;
}

const WidgetsListPredefined: React.FC<_Props> = ({ queryId }) => {
  var loc = window.location
  const baseUrl = `${loc.protocol}//${loc.host}/`
  const plainSVGUrl = `${baseUrl}ext/widgets/${queryId}/plain.svg`
  return (
    <div>
      <h1>WidgetsListPredefined</h1>
      <p>queryId: {queryId}</p>
      <p>{plainSVGUrl}</p>
    </div>
  )
}

export default WidgetsListPredefined
