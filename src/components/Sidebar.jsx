"use client"
import Image from "next/image"
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
    if (path.includes("/editions")){
      setActivePage("Zaitun")
    }
    if (path.includes("/berita")){
      setActivePage("Berita Paroki")
    }
  }, [])
  
  return (
    <div className="h-screen fixed flex flex-col w-[20%] shrink-0 bg-dark-primary">
      <div className="flex justify-center my-8">
        <img src="/top-logo.svg" className="w-4/5" />
      </div>
      <NavButton pageName="Zaitun" onClick={() => setActivePage("Zaitun")} activePage={activePage} targetUrl="/admin/editions" />
      <NavButton pageName="Berita Paroki" onClick={() => setActivePage("Berita Paroki")} activePage={activePage} targetUrl="/admin/berita" />
    </div>
  )
}

export default SideNavigation