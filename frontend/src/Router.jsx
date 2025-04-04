import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import IndexView from './view/IndexView'


export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>} >
          <Route index={true} element={<IndexView/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
