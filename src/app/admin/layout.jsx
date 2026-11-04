import SideNavigation from "@/components/Sidebar"

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

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