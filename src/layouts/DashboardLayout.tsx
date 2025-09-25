import { ReactNode } from 'react'
import Sidebar from '../components/sidebar/SideBar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex  w-screen ">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-white">
        {children}
      </main>
    </div>
  )
}
 