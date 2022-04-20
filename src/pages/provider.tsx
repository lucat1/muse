import * as React from 'react'
import {
  Routes,
  Route,
  useParams,
} from 'react-router-dom'

const Welcome: React.FunctionComponent = () => {
  return <Routes>
    <Route index element={<h1>index</h1>} />
    <Route path="artists" element={<h1>artists</h1>} />
    <Route path="artist/:id" element={<h1>artist #{useParams().id}</h1>} />
  </Routes>
}

export default Welcome
