import React, { useReducer, useState }  from "react";
import * as Yup from "yup";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const Add = () => {
  const [errors, setErrors] = useState({});
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
    }
  };

  console.log("state",state)

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  // title: "",
  // cat: "",
  // cover: "",
  // images: [],
  // desc: "",
  // shortTitle: "",
  // shortDesc: "",
  // deliveryTime: 0,
  // revisionNumber: 0,
  // features: [],
  // price: 0,
  
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is Required"),
    cat: Yup.string().required("Categroy is Required"),
    cover: Yup.string().required("Cover Image is Required"),
    images:Yup.array()
      .min(1,"Atleast 1 image of the Gig is mandatory")
      .required("images of a Gig are required"),
    desc: Yup.string().required("Cover Image is Required"),
    shortTitle: Yup.string().required("Short Title is Required"),
    shortDesc: Yup.string().required("Short Description is Required is Required"),
    deliveryTime: Yup.number()
      .required("Delivery Time is Required")
      .typeError("Delivery Time must be a number")
      .positive("Delivery Time must be a possitive Value"),
    revisionNumber: Yup.number()
      .required("Revision Number is Required")
      .typeError("Revision Number must be a number")
      .positive("Revision Number must be a possitive Value"),
    features:Yup.array()
      .required("features of a Gig are required")
      .min(1,"Atleast 1 feature of the Gig is mandatory"),
    price: Yup.number()
      .required("Price is Required")
      .typeError("Price must be a number")
      .positive("Price must be a possitive Value")
      .min(1,"Minimum Price must be greater than 1")
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    setErrors({})

    try{
      await validationSchema.validate(state, {abortEarly: false});

      console.log("VALIDATION SUCCESSFULL",state)  
      mutation.mutate(state);      
      navigate("/mygigs")
    }catch(error){
      console.log(error)

      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
    
    
    
    
    // await validationSchema.validate(state, {abortEarly: false});
    // e.preventDefault();
    // mutation.mutate(state);
    
    // navigate("/mygigs")
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <div className="sections">
          
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
              
            />
            {errors.title && <div className="error">{errors.title}</div>}
            

            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange} >
              <option value="">Select a Category</option>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>
            {errors.cat && <div className="error">{errors.cat}</div>}

            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input 
                  type="file" 
                  onChange={(e) => setSingleFile(e.target.files[0])}
                  
                />
                {errors.cover && <div className="error">{errors.cover}</div>}

                <label htmlFor="">Upload Images</label>
                <input 
                  type="file" 
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  
                />
                {errors.images && <div className="error">{errors.images}</div>}
              </div>
              <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "uploading" : "Upload"}
              </button>
            </div>
           
            <label htmlFor="">Description</label>
            <textarea 
              name="desc" 
              id="" 
              placeholder="Brief descriptions to introduce your service to customers" 
              cols="0" 
              rows="16"
              onChange={handleChange}
              
            ></textarea>
            {errors.desc && <div className="error">{errors.desc}</div>}

            <button onClick={handleSubmit}>Create</button>
          </div>


          <div className="details">
            <label htmlFor="">Short Title</label>
            <input type="text" name="shortTitle" placeholder="e.g. One-page web design" 
            onChange={handleChange} />
            {errors.shortTitle && <div className="error">{errors.shortTitle}</div>}

            <label htmlFor="">Short Description</label>
            <textarea 
              name="shortDesc"
              onChange={handleChange} 
              id="" 
              placeholder="Short description of your service" 
              cols="30" 
              rows="10"
              
            ></textarea>
            {errors.shortDesc && <div className="error">{errors.shortDesc}</div>}

            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange}/>
            {errors.deliveryTime && <div className="error">{errors.deliveryTime}</div>}
            
            <label htmlFor="">Revision Number</label>
            <input 
              type="number" 
              name="revisionNumber" 
              onChange={handleChange}
              
            />
            {errors.revisionNumber && <div className="error">{errors.revisionNumber}</div>}

            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design"  />
              <button type="submit">add</button>
            </form>
            {errors.features && <div className="error">{errors.features}</div>}

            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>

            <label htmlFor="">Price</label>
            <input type="number" onChange={handleChange} name="price"  />
            {errors.price && <div className="error">{errors.price}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;