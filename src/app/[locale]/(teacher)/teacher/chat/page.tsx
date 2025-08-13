import ChatArea from '@/components/ChatArea'
import DashboardNavbar from '@/components/DashboardNavbar'
import React from 'react'

const TeacherChat = () => {
  return (
    <div className='p-6'>
        <DashboardNavbar title='Chat'/>
      <ChatArea/>
    </div>
  )
}

export default TeacherChat
