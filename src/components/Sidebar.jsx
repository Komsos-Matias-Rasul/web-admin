"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

const NavButton = ({ pageName, activePage, targetUrl, onClick }) => {
  return (
    <Link href={targetUrl}>
      <button onClick={onClick} className={"w-full text-xl text-left p-4 rounded-lg transition-all active:bg-black/20 active:scale-95" + 
        ( activePage === pageName ? " bg-white text-indigo-700": " bg-transparent text-white hover:bg-white/20 hover:shadow-lg")
      }>
        {pageName}
      </button>
    </Link>
  )
}

const SideNavigation = () => {
  const [activePage, setActivePage] = useState()
  useEffect(() => {
    const path = window.location.pathname
    if (path.includes("/drafts")){
      setActivePage("Drafts")
    }
    if (path.includes("/editions")){
      setActivePage("Editions")
    }
  }, [])
  
  return (
    <div className="h-screen fixed flex flex-col px-8 py-4 w-[30%] flex-shrink-0 bg-gradient-to-br from-indigo-600 to-violet-700">
      <NavButton pageName="Drafts" onClick={() => setActivePage("Drafts")} activePage={activePage} targetUrl="/admin/drafts" />
      <NavButton pageName="Editions" onClick={() => setActivePage("Editions")} activePage={activePage} targetUrl="/admin/editions" />
    </div>
  )
}

export default SideNavigation