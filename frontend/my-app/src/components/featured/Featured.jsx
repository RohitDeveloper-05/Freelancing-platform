import React, { useState } from 'react'
import "./Featured.scss"
import { useNavigate } from "react-router-dom";

const Featured = () =>{
  const [input, setInput] = useState("");
  const [values,setValues] = useState([])

  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/gigs?search=${input}`);
    localStorage.removeItem("user_search")
  };
  console.log(input)

  const handleClick = (button_Value)=>{
    localStorage.setItem("user_search", JSON.stringify(input))
    const savedUserInput = JSON.parse(localStorage.getItem("user_search"))
    setInput(`${button_Value} ${savedUserInput} `)
  }

  return(
    <div className="featured">
      <div className="container">

        <div className="left">
          <h1>Find the perfect <i>freelance</i> Services for your Business</h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input 
                type="text"
                value={input}
                placeholder=' Try "building mobile App "'
                onChange={(e) => setInput(e.target.value)}
               />
            </div>
            <button onClick={handleSubmit}>Search</button>
          </div>

          <div className="popular">
            <span>Popular:</span>
            <button onClick={()=>{handleClick("Web Design")}}>Web Design</button>
            <button onClick={()=>{handleClick("Word Press")}}>Word Press</button>
            <button onClick={()=>{handleClick("Logo Design")}}>Logo Design</button>
            <button onClick={()=>{handleClick("AI Services")}}>AI Services</button>
          </div>
        </div>
        <div className="right">
          <img src="./img/final.png" alt='Not Found'/>
        </div>

      </div>      
    </div>
  )
}

export default Featured