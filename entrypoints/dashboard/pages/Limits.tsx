import React, { useEffect, useState } from 'react'
import LimitItem from '../components/LimitItem'
import { TimeLimits } from '@/utils/types'
import PlaceholderGraphic from '../components/PlaceholderGraphic'
import { ChevronRight, Pencil, Plus } from 'lucide-react'
import { PERMANENT_LIMIT, SCHEDULED_LIMIT } from '../utils/strings'
import EditLimitModal from '../components/EditLimitModal'

const LimitsPage = () => {
 const [selectedLimit, setSelectedLimit] = useState<TimeLimits | null>()
  const [showAddLimit, setshowAddLimit] = useState(false)
  const [limits, setLimits] = useState<TimeLimits[]>([
  ])

  useEffect(() => {
    const init = async () => {
      const response = await browser.runtime.sendMessage({ type: "getTimeLimits", timestamp: Date.now() }) as ServiceResponse<TimeLimits[]>
      if(!!response.data)
      setLimits(response.data)
    }

    init()

    return () => {
      
    }
  }, [])
  

  return (
    <div className='pt-6 flex relative w-full h-full justify-center pb-12 px-6'>
      <EditLimitModal limit={selectedLimit} />
      
        <a href='#add-limit' className='btn fixed bottom-8 right-8 flex items-center justify-center btn-circle btn-lg btn-primary'>
          <Plus />
        </a>
        <div className="flex flex-1 flex-col gap-8 items-start ">
          <h4 className='text-2xl text-left font-medium'>Usage Limits</h4>

          <div className="flex w-full h-full flex-col gap-3">
            

            {!limits.length && <div className="flex-1 flex justify-center px-20 items-center">
                      <PlaceholderGraphic />
                  </div> }

            {!!limits.filter(x => x.type === SCHEDULED_LIMIT).length && 
            <div className="flex flex-col gap-4">
              <h6 className='text-xs uppercase text-base-content/70 font-bold'>Blocked at certain times</h6>
              {limits.filter(x => x.type === SCHEDULED_LIMIT).map((x, i) => (
                <>
                  <LimitItem
                    key={i}
                    limit={x}
                    type={x.type}
                    onToggleClicked={async () => {
                      await browser.runtime.sendMessage({ type: "toggleTimeLimit", data: { id: x.id }, timestamp: Date.now() })
                     }}
                    onEditClicked={() => { 
                      (document.getElementById('edit-limit') as any)?.showModal()
                     }}
                    onDeleteClicked={async () => { 
                      await browser.runtime.sendMessage({ type: "deleteTimeLimit", data: { id: x.id }, timestamp: Date.now() })
                     }}
                  />
                </>
               
              ))}
            </div>
             }

          </div>
          
        {!!limits.filter(x => x.type === PERMANENT_LIMIT).length && 
          <div className="flex w-full flex-col gap-3">
            <h6 className='text-xs uppercase text-base-content/70 font-bold'>Blocked permanently</h6>
            <div className="flex flex-col gap-4">
              {limits.filter(x => x.type === PERMANENT_LIMIT).map((x, i) => (
                <>

                  <LimitItem
                    key={i}
                    limit={x}
                    type='permanent'
                    onToggleClicked={async () => { 
                      await browser.runtime.sendMessage({ type: "toggleTimeLimit", data: { id: x.id }, timestamp: Date.now() })
                    }}
                    onEditClicked={() => {
                      setSelectedLimit(x);
                      (document.getElementById('edit-limit') as any)?.showModal()
                    }}
                    onDeleteClicked={async () => {
                      // deleteTimeLimit
                      await browser.runtime.sendMessage({ type: "deleteTimeLimit", data: {id: x.id}, timestamp: Date.now() })
                     }}
                  />
                </>

              ))}
            </div>
          </div>}
        </div>
    

    </div>
  )
}

export default LimitsPage