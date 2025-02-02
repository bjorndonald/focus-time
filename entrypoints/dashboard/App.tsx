import React from 'react'
import { HashRouter, Route, Routes } from 'react-router'
import Sidebar from './components/sidebar'
import HomePage from './pages/Home'

const App = () => {
  return (
    <div className="flex h-screen">
        <Sidebar />
          <HashRouter>
              <Routes>
                  <Route path="/" element={<HomePage />} />
                </Routes>
          </HashRouter>
    </div>
  )
}

export default App