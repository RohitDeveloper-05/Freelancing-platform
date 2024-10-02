import { useQuery } from "@tanstack/react-query";
import React from "react";
import newRequest from "../../utils/newRequest";
import "./Reviews.scss"
import Review from "../review/Review";

const Reviews = ({gigId}) =>{

  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => {
        return res.data;
      }),
  });

  console.log("Inside Reviews",data)

  return (
    <div className="reviews">
    <h2>Reviews</h2>
    {isLoading
      ? "loading"
      : error
      ? "Something went wrong!"
      : data.map((review) => <Review key={review._id} review={review}/>)

    }
    
    </div>
  )
}

export default Reviews