import React,{useState} from 'react'
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "./Login.scss"
import newRequest from '../../utils/newRequest';

function Login() {
  const [loading,setLoading] = useState(false)
  const [formData, setFormData] = useState({username:"",password:""});
  const [errors, setErrors] = useState(null);
  const [front_errors,setFrontErrors] = useState({})

  console.log("formData",formData)

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required("UserName is Required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one symbol"
      )
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  });


  const handleSubmit = async (e) => {
    e.preventDefault();

    //Vaious Possibilities of Error Situation
    //1.Initital FrontEnd Erros
    //2.No FrontEnd Errors, But Backend Error after making API Request.
    //3.Clear the previous Backend Errors and Recheck for the FrontEnd Errors once again before making another API Call.


    //1.Here i am using the setErrors()(.ie backend errors) functions first bcz i want to clear all the previously displayed backend errors
    // before making the new API request

    //2.I am using the setFrontErros()(.ie frontEnd Errors) functions I want to clear all the previous frontend Errors before making the 
    // new Request

    try {
      setFrontErrors({})
      setErrors(null)
      setLoading(true)
      //By default, even if one of the error is found by Yup it will stop there and return the error object.
      //but by using the {abortEarly: false} property we try to get all the errors present in the form
      await validationSchema.validate(formData, {abortEarly: false});       
      const res = await newRequest.post("/auth/login", {username:formData.username,password:formData.password});
      setLoading(false)
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/verifyEmail")     

    } catch (error) {
      console.log(error)

      //error.inner method is provided by Yup which basically gives array of all the errors.
      console.log("Errrors Array",error.inner)
      if(error?.inner?.length > 0){
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });  
        setFrontErrors(newErrors);

      }else{
        setErrors(error.response.data);
      }
     
    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="">Username</label>
        {front_errors.username && <div className="error">{front_errors.username}</div>}
        <input
          type="text"
          name="username"
          value={formData.username}
          placeholder="Enter username"
          onChange={handleChange}
        />

        <label htmlFor="">Password</label>
        {front_errors.password && <div className="error">{front_errors.password}</div>}
        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder='Enter Password'
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>Login</button>
        {errors && <div className="error">{errors}</div> }
      </form>
    </div>
  );
}

export default Login;