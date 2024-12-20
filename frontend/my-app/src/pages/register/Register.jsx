import React, { useEffect,useState } from "react";
import * as Yup from "yup";
import upload from "../../utils/upload.js";
import "./Register.scss";
import newRequest from "../../utils/newRequest.js";
import { useNavigate } from "react-router-dom";
import axios from 'axios'



function Register() {
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [countries,setCountries] = useState([])


  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword:"",
    img: "",
    country: "",
    isSeller: false,
    phoneNumber:"",
    desc: "",
  });
  console.log(user)

  //console.log(user)
  const navigate = useNavigate();

  const getCountryName = async()=>{
    try{
      const resp = await axios.get(`https://restcountries.com/v3.1/all`)
      return resp.data.map((country) => country?.name?.common).sort()
      
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    const fetchCountries = async () => {
      const name_countries = await getCountryName();
      setCountries(name_countries)

    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({})

    try {
      await validationSchema.validate(user, {abortEarly: false});
      console.log("User Form Submitted",user);

      const url = await upload(file);
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });
      navigate("/")

    } catch (error) {

      console.log(error)
      const newErrors = {};

      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }  

    // const url = await upload(file);
    // try {
    //   await newRequest.post("/auth/register", {
    //     ...user,
    //     img: url,
    //   });
    //   navigate("/")
    // } catch (err) {
    //   console.log(err);
    // }
  };


  const validationSchema = Yup.object({
    username: Yup.string().required("UserName is Required"),
    email: Yup.string()
      .required("Email is Required")
      .email("Invalid email format"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one symbol"
      )
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    country: Yup.string()
      .required("You must choose Country"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone Number must be 10 digits")
      .required("Phone Number is must"),      
  });
 
  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label htmlFor="">Username</label>
          <input
            name="username"
            type="text"
            placeholder="johndoe"
            onChange={handleChange}
          />
          {errors.username && <div className="error">{errors.username}</div>}

          <label htmlFor="">Email</label>
          <input
            name="email"
            type="text"
            placeholder="email"
            onChange={handleChange}
          />
          {errors.email && <div className="error">{errors.email}</div>}

          <label htmlFor="">Password</label>
          <input name="password" type="password" onChange={handleChange} />
          {errors.password && <div className="error">{errors.password}</div>}

          <label htmlFor="">Confirm Password</label>
          <input name="confirmPassword" type="password" onChange={handleChange} />
          {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}

          <label htmlFor="">Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          
          <label htmlFor="">Country</label> 
          {/* <input
            name="country"
            type="text"
            placeholder="Usa"
            onChange={handleChange}
          /> */}
          {countries && (
            <div>
            <select name = "country" value={user?.country} onChange={(e)=>{setUser({...user,country:e.target.value})}}>
              <option value="">-- Select a Country --</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
            ))}
          </select>
          {errors.country && <div className="error">{errors.country}</div>}
          </div>)}
          
          
          <button type="submit">Register</button>
        </div>
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label htmlFor="">Activate the seller account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Phone Number</label>
          <input
            name="phoneNumber"
            type="number"
            placeholder="+91 234 567 89"
            onChange={handleChange}
          />
          {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}

          <label htmlFor="">Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
}

export default Register;