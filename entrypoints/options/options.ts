import { storage } from 'wxt/storage'

document.addEventListener('DOMContentLoaded', async () => {
    const timeLimits = await storage.getItem('local:timeLimits')
    const limitList = document.getElementById('limit-list')

    if (limitList && timeLimits) {
        for (const [url, time] of Object.entries(timeLimits)) {
            const li = document.createElement('li')
            li.textContent = `${url}: ${formatTime(time as number)}`
            limitList.appendChild(li)
        }
    }

    const clearDataBtn = document.getElementById('clear-data')
    clearDataBtn?.addEventListener('click', async () => {
        await storage.removeItems(['local:timeData', 'local:timeLimits'])
        alert('All data has been cleared!')
        location.reload()
    })
})

function formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000)
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
}

