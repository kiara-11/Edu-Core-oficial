import React from 'react'
import HeaderySidebar from '@/components/HeaderySidebar'
import Novedades from '@/components/Novedades'

const page = () => {
    return (
        <div>
            <HeaderySidebar>
                <Novedades />
            </HeaderySidebar>
        </div>
    )
}

export default page