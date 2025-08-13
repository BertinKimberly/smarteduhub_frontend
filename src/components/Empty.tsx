import React from 'react'
import emptyImg from "@/images/empty.svg"
import Image from 'next/image'

const Empty = () => {
  return (
    <div className="border p-6 min-h-[40vh] rounded-lg flex items-center justify-center flex-col gap-6">
        <Image src={emptyImg} alt='empty'/>
        <h3 className="text-xl font-semibold">No Courses Found</h3>
    </div>
  )
}

export default Empty
