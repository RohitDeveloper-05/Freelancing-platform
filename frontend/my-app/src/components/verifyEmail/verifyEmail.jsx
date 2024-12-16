import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
// import { Alert, CircularProgress } from "@mui/material";
// import { AuthContext } from "../context/AuthContext";
// import { baseUrl, postRequest } from "../utils/service";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";

const VerifyEmail = () => {
  // const { user, updateUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const emailToken = searchParams.get("emailToken");
  const user = getCurrentUser()

  console.log("user Login Info extractd from localStorage",user);
  console.log("Email Token Extracted from URL via SearchParams",emailToken)

  useEffect(() => {
    // ... rest of the useEffect logic ...

    (async () => {
      if (user?.isVerified) {
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else if (emailToken) {
        // post request
        setIsLoading(true);
        
        const response = await newRequest.post('/auth/verifyUserEmail', { emailToken })
        //const response = await postRequest(`${baseUrl}/users/verify-email`, JSON.stringify({ emailToken }));
  
        setIsLoading(false);
        console.log("UseEffect inside verifyEmail", response);
  
        if (response.error) {
          return setError(response?.message);
        }
  
        //updateUser(response);
        localStorage.setItem("currentUser", JSON.stringify(response.data))
      }else{
        setError("Please Verify Your Email")
      }

    })()
  


  }, [emailToken, user]);

  return (
    <div>
      {isLoading && (
        <div>
          <h1>...Loading</h1>
        </div>
      )}
      {user?.isVerified && (
        <div>
          <h1>
            Email successfully verified, redirecting...
          </h1>
        </div>)
      }
      {error && <h1>{error}</h1>}
    </div>
  );
};

export default VerifyEmail;