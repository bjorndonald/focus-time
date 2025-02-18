import { Calendar, Globe, Pencil, Trash } from 'lucide-react'
import { TimeLimits } from '@/utils/types'
import { useEffect, useState } from 'react'

interface Props {
    limit: TimeLimits
    type: string
    onEditClicked: () => void
    onDeleteClicked: () => void
    onToggleClicked: () => void
}

const LimitItem = ({ type, limit, onEditClicked, onDeleteClicked, onToggleClicked }: Props) => {
    const [favIcons, setFavIcons] = useState<string[]>([])
    if (limit.type !== type) {
        return null
    }

    const retrieveFavicon = async () => {
        await Promise.all(limit.apps.map(async (x) => {
            const response = await browser.runtime.sendMessage({ type: "getFavIcon", id: x, timestamp: Date.now() }) as ServiceResponse<string>
            setFavIcons([...favIcons, response.data ?? ""])
        }))
    }

    useEffect(() => {
        retrieveFavicon()

        return () => {
            setFavIcons([])
        }
    }, [])

    return (
        <div className='limit rounded-lg bg-base-200 p-4 my-1 flex justify-between items-center'>
            <div className="flex gap-3 items-center">
                {favIcons.length > 1 ? <div className='grid grid-cols-2 grid-rows-2 relative overflow-hidden gap-0.5 mr-2'>
                    {!!favIcons[0] ? <img src={favIcons[0]} className='w-4 h-4 rounded' alt={limit.apps[0]} /> : <Globe />}
                    {!!favIcons[1] ? <img src={favIcons[1]} className='w-4 h-4 rounded' alt={limit.apps[1]} /> : <Globe />}
                    {!!favIcons[2] ? <img src={favIcons[2]} className='w-4 h-4 rounded' alt={limit.apps[2]} /> : <Globe />}
                    {!!favIcons[3] ? <img src={favIcons[3]} className='w-4 h-4 rounded' alt={limit.apps[3]} /> : <Globe />}

                </div>
                    :
                    favIcons.length > 0 ?
                        !!favIcons[0] ?
                            <img src={favIcons[0]} className='w-8 h-8' alt="x.com" /> : <Globe />
                        : <Globe  />}

                <span className='text-base'>{limit.name}</span>
                {type === "scheduled" ? <Calendar color='#D1D1D1' /> : null}
            </div>
            <div className="flex items-center gap-2">
                <a onClick={onEditClicked} className='btn btn-sm  btn-circle btn-ghost flex items-center justify-center'>
                    <Pencil size={16} />
                </a>
                <a onClick={onDeleteClicked} className='btn btn-sm  btn-circle btn-ghost flex items-center justify-center'>
                    <Trash size={16} />
                </a>
                <input type="checkbox" onChange={() => onToggleClicked()} className="toggle toggle-sm toggle-primary" checked={limit.active} />
            </div>
        </div>
    )
}

export default LimitItem