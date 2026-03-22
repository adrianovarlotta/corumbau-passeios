import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
