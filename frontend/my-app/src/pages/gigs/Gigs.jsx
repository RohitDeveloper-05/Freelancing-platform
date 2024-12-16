import React, { useEffect,useRef, useState} from 'react'
import "./Gigs.scss"
//import { gigs } from '../../data'
import GigCard from '../../components/gigCard/GigCard'
import { useQuery } from "@tanstack/react-query";
import newRequest from '../../utils/newRequest';
import { useLocation } from "react-router-dom";

const Gigs = () =>{
  const [sort,setSort] = useState("sales")
  const [open,setOpen] = useState(false)
  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();
  console.log("hello",search)

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () =>
      newRequest
        .get(
          `/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  console.log(data);

  const reSort = (type) =>{
    setSort(type)
    setOpen(false)

  }

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = () => {
    refetch();
  };

  return(
    <div className='gigs'>
      <div className="container">
        <span className="breadcrumbs">FREELANCER > </span>
        {/* {data.length > 0 ? <h1>{data[0].cat.toUpperCase()}</h1> : "Not Found"} */}
        <p>
        Explore the boundaries of art and technology with freeLancer's professional
        </p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className='sortBy'>SortBy</span>
            <span className='sortType'>{sort === "sales" ? "Best Selling" :"Newest"}</span>
            <img src='./img/down.png' alt='trial' onClick={()=>{setOpen(!open)}}/>
            {open && 
              (<div className="rightMenu">
              { sort === "sales" ? (
              <span onClick={()=>{reSort("createdAt")}}>Newsest</span>
              ):(
              <span onClick={()=>{reSort("sales")}}>Best selling</span>
              )}
              </div>)
            }
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "loading"
            : error
            ? "Something went wrong!"
            : data.map(gig=>{return <GigCard key={gig.id} item={gig}/>})
          }
        </div>
      </div>
    </div>
  )
}

export default Gigs
