"use client"

import { AddButton } from '@/components/molecules/AddButtons/AddButtons'
import { AddCompanyModal } from '@/components/organisms/Modals/AddCompanyModal/AddCompanyModal'
import { useState } from 'react'
import { AddDeveloperModal } from '../Modals/AddDeveloperModal/AddDeveloperModa'

const AddNodes = () => {
  const [openCompanyModal, setOpenCompanyModal] = useState(false);
  const [openDeveloperModal, setOpenDeveloperModal] = useState(false);
  
  return (
    <>
      <div className="text-white absolute top-2 left-1/2 -translate-x-1/2 z-20">
        <div className='flex gap-8'>
            <AddButton buttonType='developer' onClick={() => setOpenDeveloperModal(true)}/>
            <AddButton buttonType='company' onClick={() => setOpenCompanyModal(true)}/>
        </div>
      </div>
      <AddCompanyModal open={openCompanyModal} onOpenChange={setOpenCompanyModal} />
      <AddDeveloperModal open={openDeveloperModal} onOpenChange={setOpenDeveloperModal} />
    </>
  )
}

export default AddNodes