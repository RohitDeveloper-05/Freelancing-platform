import React, { useEffect, useState } from 'react'
import "./NavBar.scss"


const NavBar = () =>{
  const [active,setActive] = useState(false)
  const [open,setOpen] = useState(false)

  const isActive = () =>{
    window.scrollY > 0 ? setActive(true) : setActive(false)
  }
  
  useEffect(()=>{
    window.addEventListener("scroll",isActive)

    return () =>{
      window.removeEventListener("scroll",isActive)
    }
  },[])

  const currentUser = {
    id:1,
    username:"John Dae",
    isSeller:true
  }

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
          {!currentUser?.isSeller && <span>Become a seller</span>}
          {!currentUser && <button>Join</button>}

          {currentUser && (
            <div className="user" onClick={()=>setOpen(!open)}>
              <img src="img1.png" alt = "Not Found"/>
              <span>{currentUser?.username}</span>
              {open && <div className="options">
                {currentUser?.isSeller && (
                  <>
                    <span>Gigs</span>
                    <span>Add New Gigs</span>
                  </>
                )}

                <span>Orders</span>
                <span>Messages</span>
                <span>Logout</span>
                </div>
              }
            </div>
          )}          
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