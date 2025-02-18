import { PageView } from '@/utils/types'
import { GlobeIcon, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface Props {
    
    onSave: (res: string[]) => void
}

const AddAppModal = ({onSave}: Props) => {
    const [selectedApps, setSelectedApps] = useState<string[]>([])
    const [seenApps, setSeenApps] = useState<PageView[]>([])
    
    useEffect(() => {
      const init = async () => {
          const response = await browser.runtime.sendMessage({ type: "getListOfApps", timestamp: Date.now() }) as ServiceResponse<PageView[]>
            if(response.status === "success")
          setSeenApps(response.data)
      }
      init()
    
      return () => {
      }
    }, [])
    
  return (
      <dialog id="add-app" className="modal">
          <div className="modal-box min-h-[20rem] max-h-[95vh] flex flex-col p-6">
              <h3 className="font-bold text-lg">Select websites and apps</h3>
              <p className="py-4">Select the websites and apps you want to limit.</p>

              <label className="input border-base-200 input-bordered flex items-center gap-2 mb-4">
                  <Search size={16} />
                  <input type="text" className="grow" placeholder="Search websites and apps" />
                  
              </label>

              <a onClick={() => {
                  if (!selectedApps.length)
                setSelectedApps(seenApps.map(x => x.appId))
            else 
            setSelectedApps([])
              }} className='mb-4 cursor-pointer text-base text-primary'>
                {selectedApps.length? "Deselect All": "Select All"}
              </a>

                <div className="flex flex-1">
                    <div className="h-full flex w-full flex-col overflow-auto">  
                        {seenApps.map((x, i)=> (
                            <a onClick={() => {
                                if (selectedApps.includes(x.appId))
                                    setSelectedApps(selectedApps.filter(y => y != x.appId))
                            else
                                    setSelectedApps([...selectedApps, x.appId])
                            }} key={i} className="flex px-3 py-2 hover:bg-base-200 w-full cursor-pointer items-center gap-3">
                                <input checked={selectedApps.includes(x.appId)} type="checkbox" defaultChecked className="checkbox  checkbox-primary rounded" />

                                {!!x.faviconUrl ? <img src={x.faviconUrl} alt={x.appId} /> : <GlobeIcon size={32} />} 

                                <span className='text-base'>
                                    {x.appId}
                                </span>
                            </a>
                        ))}  
                        
                    </div>

                </div>
                <div className="flex items-center gap-4 justify-end">
                  <form method="dialog">
                  <button className=' btn-sm btn rounded-2xl bg-base-200'>
                        Cancel
                    </button>
                    </form>
                    <button onClick={() =>{
                        onSave(selectedApps)
                        document.getElementById("close-modal")?.click()
                    }} disabled={!selectedApps.length} className="btn-primary btn rounded-2xl btn-sm">
                        Save ({selectedApps.length})
                    </button>
                </div>
          </div>
          <form method="dialog" className="modal-backdrop">
              <button id='close-modal'>close</button>
          </form>
      </dialog>
  )
}

export default AddAppModal