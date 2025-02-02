import React from 'react'

const UsageItem = () => {
  return (
      <div className="px-4 rounded-md ring-base-300 group">
          <div className="flex flex-row py-2 items-center relative">
              <div className="mr-4 flex-shrink-0 w-10 h-10">
                  <div className="bg-base-content bg-opacity-15 rounded-full p-2 relative">
                      <img src="/" alt="Google"
                        className="w-6 h-6" />

                  </div>
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex flex-row space-x-4 justify-between items-end">
                      <span className="font-medium text-lg text-base-content text-opacity-80 truncate">
                          twitter.com
                      </span>
                      <p className="font-mono text-opacity-80 text-base-content pb-0.5 text-sm flex-shrink-0">00:00:00</p>
                  </div>

                  <div className="flex flex-row space-x-2 items-center">
                      <div className="relative h-1 flex-1 bg-black bg-opacity-15 dark:bg-opacity-30 rounded-sm flex">
                          <div className="flex-shrink-0 flex-grow-0 rounded-sm transition-all ease-linear bg-secondary mr-0.5 h-full" style={{
                              backgroundColor: 'rgb(197, 166, 253)',
                              width: '50%',
                        }}></div>
                      </div>
                      <p className="text-opacity-[0.7] transition-opacity font-mono w-9 text-right text-sm">
                          50%
                      </p>
                  </div>

                  <p className="flex items-center gap-2 text-base-content text-opacity-[0.7] text-xs">
                      <span>2 sessions</span>
                  </p>
              </div>
          </div>
      </div>
  )
}

export default UsageItem