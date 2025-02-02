import React from 'react'
import {HelpCircle} from 'lucide-react'

const Sidebar = () => {
  return (
    <div className='max-w-64 w-full flex flex-col py-6 px-4 gap-3'>
        <div className="flex items-center gap-4">
            <img src="/assets/icon.png" className="w-9 h-9 inline-block mx-1" alt="" />
              <h2 className="text-lg font-medium">StayFree</h2>
              <input type="checkbox" className="toggle" defaultChecked />
        </div>
        <div className="h-4"></div>
          <a className="flex items-center gap-6 cursor-pointer hover:bg-base-200">
              <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="icon"><path fill="currentColor" d="m12 3l8 6v12h-5v-7H9v7H4V9z"></path></svg>
            <span>Dashboard</span>
        </a>
          <a className="flex items-center gap-6 cursor-pointer hover:bg-base-200">
              <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="icon"><path fill="currentColor" d="M12 16c1.66 0 3-1.34 3-3c0-1.12-.61-2.1-1.5-2.61L3.79 4.77l5.53 9.58c.5.98 1.51 1.65 2.68 1.65m0-13c-1.81 0-3.5.5-4.97 1.32l2.1 1.21C10 5.19 11 5 12 5c4.42 0 8 3.58 8 8c0 2.21-.89 4.21-2.34 5.65h-.01a.996.996 0 0 0 0 1.41c.39.39 1.03.39 1.42.01A9.97 9.97 0 0 0 22 13c0-5.5-4.5-10-10-10M2 13c0 2.76 1.12 5.26 2.93 7.07c.39.38 1.02.38 1.41-.01a.996.996 0 0 0 0-1.41A7.95 7.95 0 0 1 4 13c0-1 .19-2 .54-2.9L3.33 8C2.5 9.5 2 11.18 2 13"></path></svg>
              <span>Usage Limits</span>
          </a>
          <a className="flex items-center gap-6 cursor-pointer hover:bg-base-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <span>Timers</span>
          </a>
            <div className="flex-1"></div>
          <hr />
          <a href="#/settings" className="menu-item cursor-pointer hover:bg-base-200" data-testid="nav-settings"><svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="icon"><path fill="currentColor" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"></path></svg><p>Settings</p></a>

          <a href="#/settings" className="menu-item cursor-pointer hover:bg-base-200" data-testid="nav-settings">
          <HelpCircle />
          <p>Settings</p></a>
    </div>
  )
} 

export default Sidebar