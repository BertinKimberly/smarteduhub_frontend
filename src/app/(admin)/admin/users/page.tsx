import TopStudentsTable from '@/components/TopStudentsTable'
import React from 'react'

const AdminStudentsPage = () => {
  return (
    <div className='p-3'>
        <h3 className='mb-6'>All Students</h3>
      <TopStudentsTable/>
    </div>
  )
}

export default AdminStudentsPage
