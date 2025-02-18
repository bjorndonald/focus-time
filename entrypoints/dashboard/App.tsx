import React from 'react'
import './../../assets/output.css'
import { HashRouter, Route, Routes } from 'react-router'
import Sidebar from './components/Sidebar'
import HomePage from './pages/Home'
import LimitsPage from './pages/Limits'
import SettingsPage from './pages/Settings'
import AddLimit from './pages/AddLimit'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div className="flex h-screen">
      <HashRouter basename='/'>
        <Sidebar />
        <div className="flex-1 h-screen overflow-y-auto">
          <Toaster />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-limit" element={<AddLimit />} />
          <Route path="/limits" element={<LimitsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        </div>
      </HashRouter>
    </div>
  )
}

export default App