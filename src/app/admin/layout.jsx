import SideNavigation from "@/components/Sidebar"

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <SideNavigation />
      <div className="w-full p-20 bg-neutral-200 flex flex-row-reverse">
        <div className="w-[80%] shrink-0">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout