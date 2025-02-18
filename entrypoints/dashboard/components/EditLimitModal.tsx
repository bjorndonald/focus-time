import { TimeLimits } from '@/utils/types'
import { Pencil, X } from 'lucide-react'
import React, { useState } from 'react'
import { DAILY_LIMIT, PERMANENT_LIMIT, SCHEDULED_LIMIT, SESSION_LIMIT } from '../utils/strings'

interface Props {
    limit: TimeLimits | null | undefined
}
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const EditLimitModal = ({ limit }: Props) => {
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const [allDay, setAllDay] = useState(false)
    const [startTime, setStartTime] = useState("09:00")
    const [endTime, setEndTime] = useState("09:00")
    const [selectedApps, setSelectedApps] = useState<string[]>([])
    const [selectedDays, setSelectedDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"])

    const validate = () => {
        var valid = true;

        if (limit?.type == SCHEDULED_LIMIT) {
            if (!selectedDays.length) {
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

    const save = async () => {
        if(validate() && !!limit){
            var input: TimeLimitInput = {
                active: limit.active,
                type: limit.type,
                apps: selectedApps,
                limitPeriod: 0,
                coolDownPeriod: 0,
                days: selectedDays,
                endTime: allDay ? "23:59" : endTime,
                name,
                id: limit.id,
                startTime: allDay ? "00:01" : startTime,
            }
            await browser.runtime.sendMessage({ type: "editTimeLimit", data: input, timestamp: Date.now() })
        }
    }

    if(!limit) return null

    return (
        <dialog id="edit-limit" className="modal">
            <div className="modal-box min-h-[20rem] max-h-[95vh] flex flex-col p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2>Edit Usage Limit</h2>
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
                    {limit.type === PERMANENT_LIMIT && <a className="flex cursor-pointer hover:bg-base-200 justify-between px-4 py-3 items-center gap-3">
                        <div className="flex gap-3 items-center">
                            <input checked={true} type="radio" name="radio-1" className="radio" />
                            <div className="flex flex-col">
                                <span className='text-base'>Block permanently</span>
                            </div>
                        </div>

                    </a>}


                    {limit.type === SCHEDULED_LIMIT && <a className="flex cursor-pointer hover:bg-base-200 w-full px-4 py-3 justify-between items-center gap-3">
                        <div className="flex gap-3 items-center">
                            <input checked={true} type="radio" name="radio-1" className="radio" />
                            <span className='text-base'>Block on a schedule</span>
                        </div>


                    </a>}

                    {limit.type === DAILY_LIMIT && <div className="flex cursor-pointer hover:bg-base-200 w-full px-4 py-3 justify-between items-center ">
                        <div className="flex gap-3 items-center">
                            <input type="radio" name="radio-1" className="radio" />
                            <span className='text-base'>Set a daily usage limit</span>
                        </div>


                    </div>}

                    {limit.type === SESSION_LIMIT && <div className="flex cursor-pointer hover:bg-base-200 w-full px-4 py-3 items-center">
                        <div className="flex items-center gap-3">
                            <input type="radio" name="radio-1" className="radio" />
                            <span className='text-base'>Enable variable session limits</span>
                        </div>


                    </div>}
                </div>

                {
                    limit.type === SCHEDULED_LIMIT && <div className="flex flex-col w-full mb-4 gap-4">
                        <div className="flex gap-3 justify-center items-center">
                            {weekDays.map((x, i) => (
                                <button onClick={() => {
                                    if (selectedDays.includes(x)) {
                                        setSelectedDays(selectedDays.filter(y => y !== x))
                                    } else
                                        setSelectedDays([...selectedDays, x])
                                }} key={i} className={`btn btn-square  btn-circle ${!selectedDays.includes(x) ? "bg-base-200 hover:!bg-base-300" : "bg-primary hover:!bg-primary/80"}`}>
                                    {x}
                                </button>
                            ))}
                        </div>

                        <div className="flex w-full gap-4">
                            <label className="form-control py-2  bg-base-200 rounded flex-1">
                                <div className="mx-2 text-xs">
                                    <span className="label-text text-xs">Start time</span>
                                </div>
                                <input disabled={allDay} type="time" value={startTime} onChange={e => {
                                    setStartTime(e.target.value)
                                }}
                                    placeholder="09:00" className={`text-base outline-none px-2 ring-0 border-none focus:border-none focus:outline-none bg-transparent bg-neutral w-full ${allDay ? "text-base-content/50" : "text-base-content"}`} />
                            </label>

                            <label className="form-control py-2  bg-base-200 rounded flex-1">
                                <div className="mx-2 text-xs">
                                    <span className="label-text text-xs">End time</span>
                                </div>
                                <input disabled={allDay} type="time" value={endTime}
                                    onChange={e => {
                                        setEndTime(e.target.value)
                                    }}
                                    placeholder="18:00" className={` text-base bg-transparent px-2 focus:border-none focus:outline-none outline-none ring-0 border-none bg-neutral w-full ${allDay ? "text-base-content/50" : "text-base-content"}`} />
                            </label>
                        </div>

                        <label htmlFor='all-day' className="flex items-center gap-3">
                            <span className='text-base'>All Day</span>
                            <input onChange={e => {
                                setAllDay(!allDay)
                            }} checked={allDay}
                                id='all-day' type="checkbox" className="toggle" />
                        </label>
                    </div>}

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

                <div className="flex items-center gap-4 justify-end">
                    <form method="dialog">
                        <button className=' btn-sm btn rounded-2xl bg-base-200'>
                            Cancel
                        </button>
                    </form>
                    <button onClick={() => {
                        save()
                        document.getElementById("close-modal")?.click()
                    }} disabled={!selectedApps.length} className="btn-primary btn rounded-2xl btn-sm">
                        Save ({selectedApps.length})
                    </button>
                </div>
            </div>
        </dialog>
    )
}

export default EditLimitModal