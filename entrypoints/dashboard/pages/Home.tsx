import React, { useEffect, useState } from 'react'
import UsageItem from '../components/UsageItem'
import { Calendar } from 'lucide-react'

type TimeData = {
    appId: string
    favIconUrl: string
    timeSpent: number
    sessions: number
    percentage: number
}

type ServiceResponse<T> = {
    data: T,
    status: "success" | "error",
    message: string
}

const HomePage = () => {
const [period, setPeriod] = useState("Today")
const [timeData, setTimeData] = useState<TimeData[]>([])
useEffect(() => {
    browser.alarms.onAlarm.addListener(async (alarm) => {
        const response = await browser.runtime.sendMessage({ type: "getTimeData", timestamp: Date.now() }) as ServiceResponse<TimeData[]>
        setTimeData(response.data)
    })

  return () => {
    
  }
}, [])


  return (
    <div className='pt-6 pb-12 flex-1 px-6 flex flex-col'>
        <div className="flex items-center justify-between ">
            <h4 className='text-2xl font-medium'>Dashboard</h4>

            <div className="flex items-center justify-between">
                  {/* <div className="dropdown">
                      <div tabIndex={0} role="button" className="btn m-1">Usage Time</div>
                      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                          <li><a>Usage Time</a></li>
                          <li><a>Session</a></li>
                          <li><a>Watch times</a></li>
                      </ul>
                  </div> */}
                  <div className="dropdown">
                      <div tabIndex={0} role="button" className="btn m-1">
                        <Calendar /> Today
                    </div>
                      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                          <li><a>Today</a></li>
                          <li><a>Yesterday</a></li>
                          <li><a>Last week</a></li>
                      </ul>
                  </div>
            </div>
        </div>
          <div className="flex flex-col gap-5">
              <h5 className='text-lg'>Your Usage</h5>
              <div  className="flex flex-col gap-4">
                    {timeData.map((x, i) => (
                        <UsageItem key={i} timeData={x} />
                    ))}
              </div>
          </div>
    </div>
  )
}

export default HomePage