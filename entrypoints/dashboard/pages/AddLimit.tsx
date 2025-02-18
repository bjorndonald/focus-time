import { ChevronRight, Pencil, X } from 'lucide-react'
import React, { useState } from 'react'
import AddAppModal from '../components/AddAppModal'
import { BLOCK_FURTHER_USAGE, DAILY_LIMIT, PERMANENT_LIMIT, SCHEDULED_LIMIT, SEND_NOTIFICATION, SESSION_LIMIT } from '../utils/strings'
import { useNavigate } from 'react-router'

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const AddLimit = () => {
    const [allDay, setAllDay] = useState(false)
    const [startTime, setStartTime] = useState("09:00")
    const [selectedDays, setSelectedDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"])
    const [endTime, setEndTime] = useState("18:00")
    const [error, setError] = useState('')
    const [limitType, setLimitType] = useState("")
    const [name, setName] = useState("")
    const [afterHours, setAfterHours] = useState(0)
    const [afterMinutes, setAfterMinutes] = useState(0)
    const [afterSeconds, setAfterSeconds] = useState(0)
    const [action, setAction] = useState("second")

    const [coolDownHours, setCoolDownHours] = useState(0)
    const [coolDownMinutes, setCoolDownMinutes] = useState(0)
    const [coolDownSeconds, setCoolDownSeconds] = useState(0)

    const [selectedApps, setSelectedApps] = useState<string[]>([])

    const validate = () => {
        var valid = true;

        if (limitType == SCHEDULED_LIMIT) {
            if(!selectedDays.length) {
                valid = false;
                setError("A name is required")
                return false
            }

            if (!startTime) {
                valid = false;
                setError("A start time is required")
                return false
            }

            if (!endTime) {
                valid = false;
                setError("A end time is required")
                return false
            }
        }

        if (!name.length) {
            valid = false;
            setError("A name is required")
            return false
        }

        if (!selectedApps.length) {
            valid = false;
            setError("Please select at least one app")
            return false
        }
        setError("")
        return valid
    }

    const saveLimit = async () => {
        if (validate()) {
            var input: TimeLimitInput = {
                active: true, 
                type: limitType,
                apps: selectedApps,
                coolDownPeriod: 0,
                limitPeriod: 0,
                days: selectedDays,
                endTime: allDay ? "23:59" : endTime,
                name,
                id: "",
                startTime: allDay ? "00:01": startTime,
            }
            await browser.runtime.sendMessage({ type: "addTimeLimit", data: input, timestamp: Date.now() })
            document.getElementById("back-to-limits")?.click()
        }
    }

    return (
        <>
            <AddAppModal onSave={(apps: string[]) => {
                setSelectedApps(apps)
                if (apps.length == 1)
                    setName(`${apps[0]}`)
                else if (apps.length > 1) {
                    setName(`${apps[0]} and others`)
                }
            }} />

            <div className='max-w-2xl pb-10 mx-auto px-4'>
                <div className="flex flex-1  flex-col gap-8 items-start ">
                    <div className="flex w-full fixed top-0 pt-6 bg-gradient-to-b via-base-100  via-90% from-base-100 to-transparent z-10 pb-1 bg-base-100 items-center gap-4">
                        <a href='#limits' className='link text-2xl hover:text-base-content/70 text-base-content/30'>
                            <h2 className=''>Usage Limits</h2>
                        </a>
                        <ChevronRight />

                        <h2 className='text-2xl text-base-content'>Limit websites and apps</h2>
                    </div>

                    <a onClick={() => (document.getElementById('add-app') as any)?.showModal()} className="border hover:bg-base-200 cursor-pointer w-full  border-base-200 mt-20 flex items-center justify-between px-4 rounded h-14">
                        <span className='text-base'>
                            Select websites and apps to limit&nbsp;
                            <span className='text-secondary'>({selectedApps.length})</span>
                        </span>

                        <button className='btn btn-circle btn-ghost'>
                            <Pencil size={16} />
                        </button>
                    </a>

                    <p className=' text-base'>How do you want to limit usage for the selected items</p>

                    <div className="flex w-full flex-col">
                        {(!limitType.length || limitType === PERMANENT_LIMIT) && <a onClick={() => setLimitType(PERMANENT_LIMIT)} className="flex cursor-pointer hover:bg-base-200 justify-between px-4 py-3 items-center gap-3">
                            <div className="flex gap-3 items-center">
                                <input checked={limitType === PERMANENT_LIMIT} type="radio" name="radio-1" className="radio" />
                                <div className="flex flex-col">
                                    <span className='text-base'>Block permanently</span>
                                </div>
                            </div>
                            {limitType === PERMANENT_LIMIT && <a className='btn btn-ghost btn-circle ' onClick={(e) => {setLimitType("")
                                e.stopPropagation()
                            }}>
                                <X size={16} />
                            </a>}
                        </a>}


                        {(!limitType.length || limitType === SCHEDULED_LIMIT) && <a onClick={() => {
                            setLimitType(SCHEDULED_LIMIT)
                        }} className="flex cursor-pointer hover:bg-base-200 w-full px-4 py-3 justify-between items-center gap-3">
                            <div className="flex gap-3 items-center">
                                <input checked={limitType === SCHEDULED_LIMIT} type="radio" name="radio-1" className="radio" />
                                <span className='text-base'>Block on a schedule</span>
                            </div>
                            
                            {limitType === SCHEDULED_LIMIT && <a className='btn btn-ghost btn-circle ' onClick={(e) => {

                                setLimitType("")
                                e.stopPropagation()
                                e.stopPropagation()
                                }}>
                                <X size={16} />
                            </a>}
                        </a>}

                        {(!limitType.length || limitType === DAILY_LIMIT) && <div className="flex cursor-pointer hover:bg-base-200 w-full px-4 py-3 justify-between items-center ">
                            <div className="flex gap-3 items-center">
                                <input type="radio" name="radio-1" className="radio" />
                                <span className='text-base'>Set a daily usage limit</span>
                            </div>

                            {limitType === DAILY_LIMIT && <a className='btn btn-ghost btn-circle ' onClick={(e) => {setLimitType("")
                                e.stopPropagation()
                            }}>
                                <X size={16} />
                            </a>}
                        </div>}

                        {(!limitType.length || limitType === SESSION_LIMIT) && <div className="flex cursor-pointer hover:bg-base-200 w-full px-4 py-3 items-center">
                            <div className="flex items-center gap-3">
                                <input type="radio" name="radio-1" className="radio" />
                                <span className='text-base'>Enable variable session limits</span>
                            </div>
                            
                            {limitType === DAILY_LIMIT && <a className='btn btn-ghost btn-circle ' onClick={(e) => {setLimitType("")
                                e.stopPropagation()
                            }}>
                                <X size={16} />
                            </a>}
                        </div>}
                    </div>
                    {
                        limitType === SCHEDULED_LIMIT && <div className="flex flex-col w-full mb-4 gap-4">
                            <div className="flex gap-3 justify-center items-center">
                                {weekDays.map((x, i) => (
                                    <button onClick={() => {
                                        if(selectedDays.includes(x)){
                                            setSelectedDays(selectedDays.filter(y => y !== x))
                                        } else 
                                        setSelectedDays([...selectedDays, x])
                                    }} key={i} className={`btn btn-square  btn-circle ${!selectedDays.includes(x) ? "bg-base-200 hover:!bg-base-300": "bg-primary hover:!bg-primary/80"}`}>
                                        {x}
                                    </button>
                                ))}
                            </div>

                            <div className="flex w-full gap-4">
                                <label className="form-control py-2  bg-base-200 rounded flex-1">
                                    <div className="mx-2 text-xs">
                                        <span className="label-text text-xs">Start time</span>
                                    </div>
                                    <input disabled={allDay}  type="time" value={startTime} onChange={e => {
                                        setStartTime(e.target.value)
                                    }}
                                    placeholder="09:00" className={`text-base outline-none px-2 ring-0 border-none focus:border-none focus:outline-none bg-transparent bg-neutral w-full ${allDay ? "text-base-content/50":"text-base-content"}`} />
                                </label>

                                <label className="form-control py-2  bg-base-200 rounded flex-1">
                                    <div className="mx-2 text-xs">
                                        <span className="label-text text-xs">End time</span>
                                    </div>
                                    <input disabled={allDay} type="time" value={endTime} 
                                        onChange={e => {
                                            setEndTime(e.target.value)
                                        }}
                                        placeholder="18:00" className={` text-base bg-transparent px-2 focus:border-none focus:outline-none outline-none ring-0 border-none bg-neutral w-full ${allDay ? "text-base-content/50":"text-base-content"}`} />
                                </label>
                            </div>

                            <label htmlFor='all-day' className="flex items-center gap-3">
                                <span className='text-base'>All Day</span>
                                <input onChange={e => {
                                    setAllDay(!allDay)
                                }} checked={allDay} 
                                id='all-day' type="checkbox" className="toggle" />
                            </label>
                        </div>
                    }

                    {
                        limitType === DAILY_LIMIT && <div className="flex flex-col w-full mb-4 gap-4">
                            <div className='relative h-14 bg-base-content bg-opacity-5 dark:bg-opacity-[0.15] transition-all ring-primary ring-opacity-adaptive ease-linear rounded'>
                                <label data-v-d2513295="" htmlFor="type" className="absolute transition-all ease-linear text-xs top-2 text-opacity-60 left-4">Action</label>
                                <select value={action} onChange={e => setAction(e.target.value)} className="min-w-0 w-full h-full absolute inset-0 pt-4 pl-4 pr-14 bg-transparent outline-none border-none box-border text-base transition-all appearance-none text-opacity-primary pl-4 pr-4">
                                    <option disabled value="">Select one</option>
                                    <option value={SEND_NOTIFICATION}>Send Notification</option>
                                    <option value={BLOCK_FURTHER_USAGE}>Block Further Usage</option>
                                    </select>
                                <div className="absolute top-3 w-8 h-8 right-3"><svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="icon m-1 text-base-content text-opacity-secondary"><path fill="currentColor" d="m7 10l5 5l5-5z"></path></svg></div>
                            </div>
                           
                           <div className="flex flex-col gap-2">
                                <span>After</span>
                                <div className="flex flex-row items-center space-x-4">
                                    <div id="hours-container" className="relative h-14 bg-base-content bg-opacity-5 dark:bg-opacity-[0.15] transition-all ring-primary ring-opacity-adaptive ease-linear rounded flex-1">
                                        <label htmlFor="hours" className="absolute transition-all ease-linear text-xs top-2 text-opacity-60 left-4">Hours</label>
                                        Left and right before the input so the input is "over" them and clicks hit the input
                                        <input id="hours" value={afterHours} 
                                        onChange={e => setAfterHours(parseInt(e.target.value))}
                                        className="min-w-0 w-full h-full absolute inset-0 pt-3.5 bg-transparent outline-none border-none box-border transition-all text-base text-base-content text-opacity-primary pl-4 pr-4" type="number" min="0" max="23" autoComplete="off" />
                                    </div>
                                    <div id="minutes-container" className="relative h-14 bg-base-content bg-opacity-5 dark:bg-opacity-[0.15] transition-all ring-primary ring-opacity-adaptive ease-linear rounded flex-1">
                                        <label htmlFor="minutes" className="absolute transition-all ease-linear text-xs top-2 text-opacity-60 left-4">Minutes</label>
                                        Left and right before the input so the input is "over" them and clicks hit the input 
                                        <input id="minutes" value={afterMinutes}
                                            onChange={e => setAfterMinutes(parseInt(e.target.value))} className="min-w-0 w-full h-full absolute inset-0 pt-3.5 bg-transparent outline-none border-none box-border transition-all text-base text-base-content text-opacity-primary pl-4 pr-4" type="number" min="0" max="60" autoComplete="off" />
                                    </div>
                                    <div id="seconds-container" className="relative h-14 bg-base-content bg-opacity-5 dark:bg-opacity-[0.15] transition-all ring-primary ring-opacity-adaptive ease-linear rounded flex-1">
                                        <label htmlFor="seconds" className="absolute transition-all ease-linear text-xs top-2 text-opacity-60 left-4">Seconds</label> 
                                        Left and right before the input so the input is "over" them and clicks hit the input
                                        <input id="seconds" value={afterSeconds}
                                            onChange={e => setAfterSeconds(parseInt(e.target.value))} className="min-w-0 w-full h-full absolute inset-0 pt-3.5 bg-transparent outline-none border-none box-border transition-all text-base text-base-content text-opacity-primary pl-4 pr-4" type="number" min="0" max="60" autoComplete="off" />
                                    </div>
                                </div>
                           </div>
                        </div>
                    }

                    {
                        limitType === SESSION_LIMIT && <div className="flex flex-col gap-4">
                            <a onClick={() } className="GenericPref flex space-x-4 pl-2 items-center">
                                <div className="flex-shrink-0 p-2 box-content icon">
                                    <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="icon text-secondary">
                                        <path fill="currentColor" d="m19.03 7.39l1.42-1.42c-.45-.51-.9-.97-1.41-1.41L17.62 6c-1.55-1.26-3.5-2-5.62-2a9 9 0 0 0 0 18c5 0 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61M13 14h-2V7h2zm2-13H9v2h6z"></path>
                                    </svg>
                                </div>
                                <div className="flex flex-col flex-1 space-y-1">
                                    <p className="text-base-content text-opacity-primary text-lg">Cool Down Period</p>
                                    <p className="text-base-content text-opacity-secondary pr-8">Prevents you from starting a new session in distracting websites and apps until the cool down period has ended.</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <p className="text-base-content text-opacity-primary text-2xl font-light pr-4">Off</p>
                                </div>
                            </a>
                        </div> 
                    }
                    
                    <label className="form-control flex flex-col gap-3 w-full ">
                        <div className="label">
                            <span className="label-text">Want to name your limit? (Optional)</span>
                        </div>
                        <input value={name} onChange={e => {
                            setName(e.target.value)
                        }} type="text" placeholder="Limit Name" className="input rounded bg-base-200 w-full" />
                    </label>
                    {!!error && <p className="text-red-500 my-2 text-base">
                        {error}
                    </p>}
                    <div className="flex justify-end gap-4  items-center">
                        <a id='back-to-limits' href='#limits' className='btn rounded-2xl btn-sm bg-base-200'>
                            Cancel
                        </a>
                        <button onClick={saveLimit} disabled={!selectedApps.length} className="btn-primary btn rounded-2xl btn-sm">
                            Save ({selectedApps.length})
                        </button>
                    </div>
                </div>
            </div> </>
    )
}

export default AddLimit