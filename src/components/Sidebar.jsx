"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

const NavButton = ({ pageName, activePage, targetUrl, onClick }) => {
  return (
    <Link href={targetUrl}>
      <button onClick={onClick} className={"w-full text-lg text-neutral-200 text-left px-8 py-4 transition-colors" + 
        ( activePage === pageName ? " bg-blue-primary": " hover:bg-dark-secondary")
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
    if (path.includes("/berita")){
      setActivePage("Berita Paroki")
    }
  }, [])
  
  return (
    <div className="h-screen fixed flex flex-col w-[20%] shrink-0 bg-dark-primary">
      <p>Komsos Samara</p>
      <NavButton pageName="Drafts" onClick={() => setActivePage("Drafts")} activePage={activePage} targetUrl="/admin/drafts" />
      <NavButton pageName="Editions" onClick={() => setActivePage("Editions")} activePage={activePage} targetUrl="/admin/editions" />
      <NavButton pageName="Berita Paroki" onClick={() => setActivePage("Berita Paroki")} activePage={activePage} targetUrl="/admin/berita" />
    </div>
  )
}

export default SideNavigation