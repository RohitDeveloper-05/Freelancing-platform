import React, { useEffect, useState } from 'react'
import { Link,useLocation,useNavigate } from 'react-router-dom'
import newRequest from '../../utils/newRequest'
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

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log("NavBar Component, CurrenUser value",currentUser)

  const navigate = useNavigate();

  const handleLogout = async () => {
    //console.log("getting Called")
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

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
          <span>freeLancer Business</span>
          <span>Explore</span>
          <span>English</span>
          
          {!currentUser?.isSeller && <span>Become a seller</span>}
         
         
          {currentUser?.isVerified ? (
            <div className="user" onClick={()=>setOpen(!open)}>
              <img src={currentUser.img || "/img/no_avtar.jpg"} alt = "Not Found"/>
              <span>{currentUser?.username}</span>

              {open && (
                <div className="options">
                {currentUser?.isSeller && (
                  <>
                    <Link className='link' to='/mygigs'>Gigs</Link>
                    <Link className='link' to='/add'>Add New Gigs</Link>
                  </>
                  
                )}

                <Link className='link' to='/orders'>Orders</Link>
                <Link className='link' to='/messages'>Messages</Link>
                <Link className='link' onClick={handleLogout} >Logout</Link>
                </div>
              )}
            </div>
          ):(
              <>
                <Link to="/login" className='link'>Sign in</Link>
                <Link className="link" to="/register"><button>Join</button></Link>
              </>
          )}          
        </div>
      </div>
      
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link className='link menuLink' to='/'>
              Graphics & Design
            </Link>
            <Link className='link' to='/'>
              Video & Animation
            </Link>
            <Link className='link' to='/'>
              Writing & Translation
            </Link>
            <Link className='link' to='/'>
              AI Services
            </Link>
            <Link className='link' to='/'>
              Digital Marketing
            </Link>
            <Link className='link' to='/'>
              Music & Audio
            </Link>
            <Link className='link' to='/'>
              Programming & Tech
            </Link>
            <Link className='link' to='/'>
              Business
            </Link>
            <Link className='link' to='/'>
              Lifestyle
            </Link>
          </div>
          <hr />
        </>
      )}
      
    </div>
  )
}

export default NavBar