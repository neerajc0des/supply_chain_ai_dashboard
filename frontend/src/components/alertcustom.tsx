import { AlertTriangle } from 'lucide-react'
import React from 'react'

const alertcustom = ({desc}) => {
  return (
    <div className='w-full bg-background'>
        <AlertTriangle/>
        {
            desc
        }
    </div>
  )
}

export default alertcustom