import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { LoadingOutlined } from "@ant-design/icons"; // Import the loading icon
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CodeAnalysisUpload = () => {
  const [closeButton, setCloseButton] = useState(false);
  const [downloadButton, setDownloadButton] = useState(false);

  const [buttonHovered, setButtonHovered] = useState(false);
  const [initialBorderStyle, setInitialBorderStyle] = useState(
    "1px solid rgba(0, 0, 0, 0.125)"
  );

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [warning, setWarning] = useState(true);
  const navigate = useNavigate();
  const [fileName, setFileName] = useState(null);
  const [isClicked, setClicked] = useState(null);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    applyTextGradient("headerText", ["#2B0AFF", "#C307F9"]);
  }, []);
  function handleCloseModal() {
    
  }
  function goBack() {
    setWarning(false);
  }
  function applyTextGradient(elementId, colors) {
    var element = document.getElementById(elementId);
    if (element) {
      element.style.background = `linear-gradient(to right, ${colors.join(
        ", "
      )})`;
      element.style.webkitBackgroundClip = "text";
      element.style.color = "transparent";
      element.style.display = "inline-block";
    }
  }

  const handleFileChange = (event) => {
    event.preventDefault();
    setSelectedFile(event.target.files[0]);
  };
  
  
  const handleFileDownload = async () => {
    const jwtToken = localStorage.getItem('jwtToken'); 
    const newname = localStorage.getItem('userFile').replace(/"/g, ''); // Remove quotes if present
    console.log("after removing");
    console.log(newname);
    const encodedFileName = newname.split('/').map(part => encodeURIComponent(part)).join('/');
    try {
      const response = await fetch(`http://localhost:8080/api/downloadtolocal?key=${encodedFileName}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        // Optionally set a filename here
        a.download = newname.split('/').pop(); // This will download the file with the last part of the path as filename
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
  } catch (e) {
      console.log(e);
  }
  };
  
  function getFileNameFromPath(path) {
    // Check if the path is null or empty
    if (!path) {
        return path; // or throw an Error if needed
    }

    // Find the last index of the slash
    const lastSlashIndex = path.lastIndexOf('/');

    // Check if the slash was found and is not at the end of the string
    if (lastSlashIndex !== -1 && lastSlashIndex !== path.length - 1) {
        return path.substring(lastSlashIndex + 1);
    }

    return path; // Return the original path if no slash was found or it was at the end
}
  
  const handleFileUpload = async () => {
    setIsUploading(true);
    // Wrap the upload logic in an async function to use await
    const uploadFile = async () => {
      //const formData = new FormData();
      
      const uniName = localStorage.getItem('uniName');
      //const labId = localStorage.getItem('labId');
      const labNo = localStorage.getItem('labNo');

      //const course = localStorage.getItem('course');//olmadi cs115 yapariz yarin icin de ctis152 yapariz
      const semester = "2023-2024 Spring";
      const userId = localStorage.getItem('userId');
      const course = localStorage.getItem('courseCode'); 
      console.log("The course ", course);
      const fileName = selectedFile.name;

      const formData = new FormData(); // Create a FormData object to send the file
            formData.append('file', selectedFile); // Append the selected file to the FormData object
            formData.append('bucketName', 'coded-bucket');

            const key = `${uniName}/${course}/${semester}/${labNo}/${fileName}`;
            //const key = `user-uploads/${userId}/${new Date().getTime()}-${selectedFile.name}`;
            formData.append('key', key);
            console.log("the key value in const key ", key);

            localStorage.setItem('userFile', JSON.stringify(key)); // Storing the user roles
            console.log(localStorage.getItem('userFile'));
            //setPdfPath(`user-uploads/${userId}/${new Date().getTime()}-${selectedFile.name}`);


      //formData.append("file", selectedFile); // Assuming selectedFile is already defined
    
      try {

        // Retrieve the JWT token from local storage
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          console.error("Authentication token not found. Please log in.");
          return; // Exit if no token is found
        }
        console.log("The token");

        console.log(token);
        console.log("Before sending");
        const newname = localStorage.getItem('userFile').replace(/"/g, ''); // Remove quotes if present
        const encodedFileName = newname.split('/').map(part => encodeURIComponent(part)).join('/');
        const newKey = `${course}/${semester}/${labNo}/${fileName}`;
        localStorage.setItem('key', newKey); // Storing the user roles
        console.log("The newKey  ", newKey);

        setFileName(getFileNameFromPath(encodedFileName));
        localStorage.setItem('fileName', fileName); // Storing the user roles

        // Updated link as per your comment, with the authorization header
        console.log("uniname");
        console.log(uniName);
        console.log("key");
        console.log(key);
        console.log("uploadedlabid");
        console.log(labNo);
        console.log("studentid");
        console.log(userId);
        const queryParams = new URLSearchParams({
          reponame: uniName,
          directorypath: key,
          uploadedlabid: labNo,
          studentid: userId
      });
      
       console.log("Before uploading the key to codeanalysis/upload ", key);

        const response = await fetch(`http://localhost:8080/codeanalysis/upload?${queryParams.toString()}`, {
          method: "POST",
          headers: {
            // Include the Authorization header with the retrieved token
            'Authorization': `Bearer ${token}`,
          },

          body: formData,
        });
        console.log("After sending to codeanalysis upload");

        // Check the response content-type and process accordingly
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const responseData = await response.json(); // Process JSON response
          console.log("File upload response:", responseData);
        } else {
          const responseText = await response.text(); // Process text/plain response
          console.log("File upload response:", responseText);
        }
        
        
          // Define headers for the request
          const headers = {
            'Authorization': `Bearer ${token}`, // Include JWT token in the Authorization header
            'Content-Type': 'multipart/form-data', // Set content type for FormData
        };

        // Send a POST request to your backend to upload the file to S3

        axios.post('http://localhost:8080/api/upload', formData, { headers: headers })
            .then((response) => {
                // Handle successful upload
                console.log('File uploaded successfully123:', response.data);
                setClicked(true);

            })
            .catch((error) => {
                // Handle upload error
                console.error('Error uploading file:', error);
            });
        
        setUploaded(true);
        //navigate("/CodeAnalysis"); 
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
    

    // Simulate file upload process
    setTimeout(() => {
      uploadFile().then(() => {
        // After file upload is complete, set upload status to false
        setIsUploading(false);
      });
    }, 3000); // Adjust timeout duration as per your upload logic
  };

  return (
    <>
      <>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
        />
        <title>Contacts - Brand</title>
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Raleway:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&display=swap"
        />
        <link
          rel="stylesheet"
          href="assets/css/Drag-Drop-File-Input-Upload.css"
        />
        <NavBar activeSection="dashboard" />
        <Modal show={warning} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Warning!!! The uploaded code file will be open for the public to view!!!</Modal.Body>
        <Modal.Footer>
        <button
                      className="btn btn-primary shadow"
                      role="button"
                      onMouseEnter={() => setCloseButton(true)}
                      onMouseLeave={() => setCloseButton(false)}
                      disabled={isUploading}
                      onClick={goBack}
                      style={{
                        display: "block", // Ensure it's a block-level element
                        margin: "0 auto", // Center the button
                        background: closeButton
                          ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)`
                          : "#ffffff",
                        color: closeButton ? "#ffffff" : "#a50bf6",
                        boxShadow:
                          "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                        borderRadius: 13,
                        borderWidth: 3,
                        borderColor: closeButton
                          ? "var(--bs-navbar-active-color)"
                          : "#a50bf6",
                      }}
                    >
                      Close
                    </button>
                    
        </Modal.Footer>
      </Modal>
        <section className="py-5 mt-5">
          <div className="container py-5">
            <div className="row">
              <div className="col-md-8 col-xl-6 text-center mx-auto">
                <h2 className="display-6 fw-bold mb-4">Code Analysis Upload</h2>
                <p className="text-muted">
                  Upload your code for a thorough analysis!
                </p>
                <div />
              </div>
            </div>
            {!isUploading && isClicked && (
              <div className="col-md-8 col-xl-6 text-center mx-auto">
                <h2 className="display-6 fw-bold mb-4" />
                {fileName} &nbsp; &nbsp; &nbsp;
                <button
                  className="btn btn-primary shadow"
                  role="button"
                  onMouseEnter={() => setDownloadButton(true)}
                  onMouseLeave={() => setDownloadButton(false)}
                  disabled={isUploading}
                  onClick={handleFileDownload}
                  style={{
                    background: downloadButton
                      ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)`
                      : "#ffffff",
                    color: downloadButton ? "#ffffff" : "#a50bf6",
                    boxShadow:
                      "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                    borderRadius: 13,
                    borderWidth: 3,
                    borderColor: downloadButton
                      ? "var(--bs-navbar-active-color)"
                      : "#a50bf6",
                  }}
                >
                  Download
                </button>
                <div />
              </div>
            )}
            {isUploading && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <LoadingOutlined style={{ fontSize: "24px" }} />
                <p>Loading...</p>
              </div>
            )}

            <div className="row d-flex justify-content-center">
              <div className="col-md-6">
                <div>
                  <form
                    className="p-3 p-xl-4"
                    method="post"
                    data-bs-theme="light"
                  >
                    <div className="mb-3" />
                    <div className="files color form-group mb-3">
                      <input
                        className="form-control"
                        type="file"
                        onChange={handleFileChange}
                        multiple=""
                        name="files"
                      />
                    </div>
                    <fieldset />
                    <label className="form-label" />
                    <label className="form-label" />
                    <button
                      className="btn btn-primary shadow"
                      role="button"
                      onMouseEnter={() => setButtonHovered(true)}
                      onMouseLeave={() => setButtonHovered(false)}
                      disabled={isUploading}
                      onClick={handleFileUpload}
                      style={{
                        display: "block", // Ensure it's a block-level element
                        margin: "0 auto", // Center the button
                        background: buttonHovered
                          ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)`
                          : "#ffffff",
                        color: buttonHovered ? "#ffffff" : "#a50bf6",
                        boxShadow:
                          "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                        borderRadius: 13,
                        borderWidth: 3,
                        borderColor: buttonHovered
                          ? "var(--bs-navbar-active-color)"
                          : "#a50bf6",
                      }}
                    >
                      Upload
                    </button>
                    <fieldset />
                    { uploaded &&
                    <div className="d-flex justify-content-center align-items-center mt-3">
                      <h6>
                        <a
                          href="CodeAnalysis"
                          style={{ textDecoration: "underline" }}
                        >
                          View Your Code Analysis
                        </a>
                      </h6>
                    </div>}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </>
  );
};
export default CodeAnalysisUpload;
