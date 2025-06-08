import React from 'react'
import HeaderySidebarAdmin from '@/components/HeaderySidebarAdmin'
import DetalleCurso from '@/components/Detalle'
const page = () => {
    return (
        <div>
            <HeaderySidebarAdmin>
                <DetalleCurso />
            </HeaderySidebarAdmin>
        </div>
    )
}

export default page