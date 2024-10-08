import React, { useState } from 'react'
import "./Featured.scss"
import { useNavigate } from "react-router-dom";

const Featured = () =>{
  const [input, setInput] = useState("");

  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/gigs?search=${input}`);
  };

  return(
    <div className="featured">
      <div className="container">

        <div className="left">
          <h1>Find the perfect <i>freelance</i> Services for your Business</h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input type="text" placeholder=' Try "building mobile App "'
                onChange={(e) => setInput(e.target.value)}
               />
            </div>
            <button onClick={handleSubmit}>Search</button>
          </div>

          <div className="popular">
            <span>Popular:</span>
            <button>Web Design</button>
            <button>Word Press</button>
            <button>Logo Design</button>
            <button>AI Services</button>
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