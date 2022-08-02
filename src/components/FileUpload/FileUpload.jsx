import { useState } from "react";
import "./FileUpload.css"

export default function FileUpload({setSelectedFile, setIsFilePicked}){


  const getBase64 = (file, cb) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      cb(reader.result);
    }
  }
  
  const changeHandler = (event) => {
    const file = event.target.files[0]
    if(file.size > 32 * (1024 ** 2)) {
      setInvalidSize(true)
      if(file.type!=="image/png" && file.type!=="image/jpeg" && file.type!=="image/jpg") {
        setWrongExtension(true)
      }
      else {
        setWrongExtension(false)
      }
      setIsFilePicked(false)
      return;
    }
    else if(file.type!=="image/png" && file.type!=="image/jpeg" && file.type!=="image/jpg") {
      setWrongExtension(true)
      setInvalidSize(false)
      setIsFilePicked(false)
      return;
    }
		else {
      setInvalidSize(false)
      setWrongExtension(false)
      try {
        getBase64(file, (result) => {
          setIsFilePicked(true);
          setSelectedFile(result)
        })
      }
      catch (err) {
        console.error(err)
      }
    }
	};

  const [wrongExtension, setWrongExtension] = useState(false)
  const [invalidSize, setInvalidSize] = useState(false)

	return(
   <div className="file-upload">
      <div className="upload-input=container">
			  <input type="file" name="file" onChange={changeHandler} />
      </div>
     {wrongExtension ? <div className="invalid-extension">Invalid File Extension! Supported Extensions: .png, .jpeg, .jpg</div>: ""}
     {invalidSize ? <div className="invalid-size">Invalid File Size! Maximum size: 64 MB</div> : ""}
  </div>
	)

}