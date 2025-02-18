import React, { cloneElement, JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from 'react'
import { HelpCircle, Home, Settings, StopCircle, Timer } from 'lucide-react'
import icon from './../../../assets/icon.png'
import { useLocation } from 'react-router';

const SidebarItem = ({ href, icon, title }: { icon: ReactElement<any, string | JSXElementConstructor<any>>, href: string, title: string }) => {
  const location = useLocation();
  
  return (
    <a href={"#" + href} className={`${location.pathname === href ? "bg-primary/20 text-primary" : "text-base-content"} text-neutral flex items-center gap-6 cursor-pointer hover:bg-base-200 px-4 py-2 rounded-md`}>
      {cloneElement(icon, {
        color: location.pathname === href ? "#A259FF" : "#c4c4c4"
      })}
      
      <span className={`${location.pathname === href ? "text-primary" : "text-base-content"} text-lg`}>{title}</span>
    </a>
  )
}

const Sidebar = () => {


  return (
    <div className='max-w-64 bg-base-200 w-full flex flex-col py-6 px-4 gap-3'>
      <div className="flex items-center gap-4">
        <img src={icon} className="w-9 h-9 inline-block mx-1" alt="" />
        <h2 className="text-lg font-medium">StayFree</h2>
        <input type="checkbox" className="toggle" defaultChecked />
      </div>
      <div className="h-4"></div>
      <SidebarItem icon={<Home />} href='/' title='Dashboard' />
      <SidebarItem icon={<StopCircle />} href='/limits' title='Usage Limits' />
      <SidebarItem icon={<Timer />} href='/timers' title='Timers' />

      <div className="flex-1"></div>
      <hr />
      <SidebarItem icon={<Settings />} href='/settings' title='Settings' />
      <SidebarItem icon={<HelpCircle />} href='/href' title='Help Resources' />
    </div>
  )
}

export default Sidebar