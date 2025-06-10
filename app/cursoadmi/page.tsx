import React from 'react'
import HeaderySidebarAdmin from '@/components/HeaderySidebarAdmin'
import Curso from '@/components/ContmiscursosAdmi'
const page = () => {
    return (
        <div>
            <HeaderySidebarAdmin>
                <Curso />
            </HeaderySidebarAdmin>
        </div>
    )
}

export default page