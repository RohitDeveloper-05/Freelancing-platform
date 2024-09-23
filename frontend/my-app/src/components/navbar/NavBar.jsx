import React, { useEffect, useState } from 'react'
import "./NavBar.scss"

const NavBar = () =>{
  const [active,setActive] = useState(false)

  const isActive = () =>{
    window.scrollY > 0 ? setActive(true) : setActive(false)
  }
  
  useEffect(()=>{
    window.addEventListener("scroll",isActive)

    return () =>{
      
      window.removeEventListener("scroll",isActive)
    }
  },[])

  return(
    <div className={active? "navbar active":"navbar"}>
      <div className='container'>
        <div className='logo'>
            <span className='text'>fiverr</span>
            <span className='dot'>.</span>
        </div>

        <div className="links">
          <span>Fiver Business</span>
          <span>Explore</span>
          <span>English</span>
          <span>Sign in</span>
          <span>Become a seller</span>
          <button>Join</button>
        </div>
      </div>

      <hr/>
      <div className="menu">
        <span>Text 1</span>
        <span>Text 2</span>
      </div>
    </div>
  )
}

export default NavBar