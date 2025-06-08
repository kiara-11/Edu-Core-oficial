import React from 'react'
import HeaderySidebarAdmin from '@/components/HeaderySidebarAdmin'
import PublicarCurso from '@/components/PublicarCursoAdmi'
const page = () => {
    return (
        <div>
            <HeaderySidebarAdmin>
                <PublicarCurso />
            </HeaderySidebarAdmin>
        </div>
    )
}

export default page