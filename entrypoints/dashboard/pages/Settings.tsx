import React from 'react'
import LimitItem from '../components/LimitItem'

const SettingsPage = () => {
    return (
        <div className='pt-6 pb-12 px-6'>
            <div className="flex items-center justify-between ">
                <h4>Usage Limits</h4>

                <div className="flex items-center justify-between">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn m-1">Click</div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li><a>Usage Time</a></li>
                            <li><a>Session</a></li>
                        </ul>
                    </div>
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn m-1">Click</div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li><a>Today</a></li>
                            <li><a>Yesterday</a></li>
                            <li><a>Last week</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <h4>BLOCKED AT CERTAIN TIMES</h4>
                <div className="flex flex-col gap-4">
                    <LimitItem />
                    <LimitItem />
                    <LimitItem />
                    <LimitItem />
                </div>
            </div>
        </div>
    )
}

export default SettingsPage