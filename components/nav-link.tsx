import Link, { LinkProps } from "next/link"
import { usePathname } from 'next/navigation'
import React from "react"

export default function NavLink(props: LinkProps & { children: React.ReactNode }) {
  const pathname = usePathname()
  const { children, href, ...newProps } = props
  return (
    <Link
      href={href}
      className={`${pathname === href ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}
      {...newProps}
    >
      {children}
    </Link>

  )

}