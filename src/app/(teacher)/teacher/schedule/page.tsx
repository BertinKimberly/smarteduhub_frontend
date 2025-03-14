import CalendarPage from '@/components/calendar/CalenderPage'
import DashboardNavbar from '@/components/DashboardNavbar'
import React from 'react'

const TeacherSchedule = () => {
  return (
    <div>
      <DashboardNavbar title="Schedule"/>
      <CalendarPage />
    </div>
  )
}

export default TeacherSchedule
