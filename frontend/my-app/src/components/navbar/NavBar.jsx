import React, { useEffect, useState } from 'react'
import { Link,useLocation } from 'react-router-dom'
import "./NavBar.scss"


const NavBar = () =>{
  const [active,setActive] = useState(false)
  const [open,setOpen] = useState(false)

  const {pathname} = useLocation()  
  
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
    <div className={active || pathname !== "/" ? "navbar active":"navbar"}>
      <div className='container'>
        <div className='logo'>
            <Link to="/" className='link'>
            <span className='text'>freeLancer</span>
            </Link>
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
                    <Link className='link' to='/mygigs'>Gigs</Link>
                    <Link className='link' to='/add'>Add New Gigs</Link>
                  </>
                )}

                <Link className='link' to='/orders'>Orders</Link>
                <Link className='link' to='/messages'>Messages</Link>
                <Link className='link' to='/'>Logout</Link>
                </div>
              }
            </div>
          )}          
        </div>
      </div>
      
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <span>Text 1</span>
            <span>Text 2</span>
          </div>
        </>
      )}
      
    </div>
  )
}

export default NavBar