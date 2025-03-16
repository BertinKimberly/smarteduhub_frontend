import CalendarPage from '@/components/calendar/CalenderPage'
import DashboardNavbar from '@/components/DashboardNavbar'
import React from 'react'

const StudentTimeTable = () => {
  return (
    <div>
      <DashboardNavbar title="Timetable"/>
      <CalendarPage />
    </div>
  )
}

export default StudentTimeTable
