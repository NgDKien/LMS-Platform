import AppSidebar from '@/components/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const page = () => {
    return (
        <div>
            {/* <SidebarProvider> */}
            <AppSidebar />

            {/* </SidebarProvider> */}
        </div>
    )
}

export default page
