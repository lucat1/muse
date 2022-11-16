import * as React from "react"
import { useLocation } from "react-router-dom"

const ScrollToTop: React.FC<{
  ele?: HTMLElement | null
}> = ({ ele }) => {
  const location = useLocation()
  React.useLayoutEffect(() => {
    ele?.scrollTo(0, 0)
  }, [location.pathname])

  return null
}

export default ScrollToTop
