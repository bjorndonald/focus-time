import React from 'react'
import { Pencil, Trash } from 'lucide-react'

const LimitItem = () => {
    return (
        <div className='limit flex justify-between items-center'>
            <div className="flex items-center">
                <img src="" alt="" />
                <span>x.com</span>
                <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="mr-2 icon text-neutral-content"><path fill="currentColor" d="M15 13h1.5v2.82l2.44 1.41l-.75 1.3L15 16.69zm4-5H5v11h4.67c-.43-.91-.67-1.93-.67-3a7 7 0 0 1 7-7c1.07 0 2.09.24 3 .67zM5 21a2 2 0 0 1-2-2V5c0-1.11.89-2 2-2h1V1h2v2h8V1h2v2h1a2 2 0 0 1 2 2v6.1c1.24 1.26 2 2.99 2 4.9a7 7 0 0 1-7 7c-1.91 0-3.64-.76-4.9-2zm11-9.85A4.85 4.85 0 0 0 11.15 16c0 2.68 2.17 4.85 4.85 4.85A4.85 4.85 0 0 0 20.85 16c0-2.68-2.17-4.85-4.85-4.85"></path></svg>
            </div>
            <div className="flex items-center gap-2">
                <a href="" className='btn btn-sm btn-circle btn-ghost'>
                    <Pencil />
                </a>
                <a href="" className='btn btn-sm btn-circle btn-ghost'>
                    <Trash />
                </a>
                <input type="checkbox" className="toggle" defaultChecked />
            </div>
        </div>
    )
}

export default LimitItem