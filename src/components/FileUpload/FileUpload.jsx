import { useState } from "react";
import "./FileUpload.css";

export default function FileUpload({ setSelectedFile, setIsFilePicked }) {
  const [fileName, setFileName] = useState("");

  const getBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      cb(reader.result);
    };
  };

  const changeHandler = (event) => {
    const file = event.target.files[0];
    if (file.size > 32 * 1024 ** 2) {
      setInvalidSize(true);
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg"
      ) {
        setWrongExtension(true);
      } else {
        setWrongExtension(false);
      }
      setIsFilePicked(false);
      return;
    } else if (
      file.type !== "image/png" &&
      file.type !== "image/jpeg" &&
      file.type !== "image/jpg"
    ) {
      setWrongExtension(true);
      setInvalidSize(false);
      setIsFilePicked(false);
      return;
    } else {
      setInvalidSize(false);
      setWrongExtension(false);
      try {
        getBase64(file, (result) => {
          setIsFilePicked(true);
          setSelectedFile(result);
          setFileName(file.name);
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const [wrongExtension, setWrongExtension] = useState(false);
  const [invalidSize, setInvalidSize] = useState(false);

  return (
    <div className="file-upload">
      <div className="upload-input=container">
        <label htmlFor="file-input" className="file-input-label button-6">
          <div className="file-input-text">Optional: Upload Party Image</div>
          <input
            id="file-input"
            type="file"
            name="file"
            accept="image/png, image/jpg, image/jpeg"
            onChange={changeHandler}
            label="Optiona: Upload Party Image"
          ></input>
          <div className="image-name" id="image-name">
            {fileName}
          </div>
        </label>
      </div>
      {wrongExtension ? (
        <div className="invalid-extension">
          Invalid File Extension! Supported Extensions: .png, .jpeg, .jpg
        </div>
      ) : (
        ""
      )}
      {invalidSize ? (
        <div className="invalid-size">
          Invalid File Size! Maximum size: 64 MB
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
