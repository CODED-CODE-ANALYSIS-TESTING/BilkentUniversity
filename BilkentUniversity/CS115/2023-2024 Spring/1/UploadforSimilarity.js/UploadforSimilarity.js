import './assets/bootstrap/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import NavBar from './NavBar';
import axios from 'axios';

export const UploadForSimilarity = () => {
    const [buttonHovered, setButtonHovered] = useState(false);

    useEffect(() => {
        applyTextGradient(['labText', 'submissionText'], [
            [[43, 10, 255], [195, 7, 249], [234, 56, 193], [255, 140, 175], [251, 143, 139]],
            [[43, 10, 255], [195, 7, 249], [234, 56, 193], [255, 140, 175], [251, 143, 139]],
        ]);
    }, []);
    // const handleFolderSelection = (event) => {
    //     const files = event.target.files;
    //     const fileList = Array.from(files);
    
    //     console.log("Selected files:", fileList);
    // };
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFolderSelection = (event) => {
        const files = event.target.files;
        setSelectedFiles(files); // Store the files in state
        console.log("Selected files:", files);
    };

    

    // const handleSimilarityCheck = async (labId) => { // Accept the labId as a parameter
    //     const jwtToken = localStorage.getItem('jwtToken');
    //     const userId = localStorage.getItem('userId');
    
    //     if (!jwtToken) {
    //         console.error('JWT token is missing.');
    //         return;
    //     }
    
    //     // // Prepare data as JSON object including the ID
    //     // const data = {
    //     //     id: labId, // Use the labId passed as a parameter
    //     //     grade: grade,
    //     //     feedback: feedback,
    //     //     graded_by_id: userId
    //     // };
    
    //     // Define headers for the request
    //     const headers = {
    //         'Authorization': `Bearer ${jwtToken}`,
    //         'Content-Type': 'application/json',
    //     };
    
    //     axios.get('http://localhost:8080/moss/submit', { headers: headers })
    //     .then((response) => {
    //         console.log('Grade and feedback given successfully:', response.data);
    //     })
    //     .catch((error) => {
    //         console.error('Error during plag process', error);
    //     });
    
    // }

    // const handleSimilarityCheck = async (event) => {
    //     event.preventDefault(); // Prevent the default form submission behavior
    //     const jwtToken = localStorage.getItem('jwtToken');
    //     const formData = new FormData(event.target); // Get form data from the event
    
    //     if (!jwtToken) {
    //         console.error('JWT token is missing.');
    //         return;
    //     }
    
    //     // Define headers for the request
    //     const headers = {
    //         'Authorization': `Bearer ${jwtToken}`,
    //     };
    
    //     axios.post('http://localhost:8080/moss/upload-and-submit', formData, {
    //         headers: headers
    //     })
    //     .then((response) => {
    //         console.log('Files processed successfully:', response.data);
    //     })
    //     .catch((error) => {
    //         console.error('Error during file processing:', error);
    //     });
    // }

    const [selectedLanguage, setSelectedLanguage] = useState('python'); // Default to Python

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };
    const handleSimilarityCheck = async (event) => {
        event.preventDefault(); // Prevent the default form submission
        if (!selectedFiles.length) {
            console.error('No files selected.');
            return;
        }
    
        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append("files", selectedFiles[i]);
        }
    
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            console.error('JWT token is missing.');
            return;
        }
    
        formData.append("language", "python");


        try {
            const response = await axios.post('http://localhost:8080/moss/upload-and-submit', formData, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log('Moss submission successful:', response.data);
            // Redirect to the URL returned from the server
            window.location.href = response.data;
        } catch (error) {
            console.error('Error submitting to Moss:', error);
            alert('Failed to submit to Moss.');
        }
    };
    

    function applyTextGradient(elementIds, colors) {
        elementIds.forEach((elementId, index) => {
            var element = document.getElementById(elementId);
            if (element) {
                element.style.background = `linear-gradient(to right, rgb(${colors[index][0]}), rgb(${colors[index][1]}), rgb(${colors[index][2]}), rgb(${colors[index][3]}), rgb(${colors[index][4]}))`;
                element.style.webkitBackgroundClip = 'text';
                element.style.color = 'transparent';
                element.style.display = 'inline-block';
            }
        });
    }

    return (
        <>
            <>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
                />
                <title>Home - Brand</title>
                <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Raleway:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&display=swap"
                />
                <link rel="stylesheet" href="assets/css/Drag-Drop-File-Input-Upload.css" />
                <NavBar></NavBar>
                
                <header>
                    <div className="container pt-4 pt-xl-5">
                        <hr />
                        <div className="row pt-5">
                            <div className="col-md-8 col-lg-9 text-center text-md-start mx-auto">
                                <div className="text-center">
                                    <h1 className="display-4 fw-bold mb-5" style={{ fontSize: 30 }} id='submissionText'>
                                        Upload Your Folder for Similarity Check
                                    </h1>
                                </div>
                                <div
                                    className="table-responsive text-center d-lg-flex"
                                    style={{ boxShadow: "0px 0px 14px 2px #bec1de" }}
                                >
                                    {/* <table className="table table-striped-columns table-hover">
                                        <thead>
                                            <tr>
                                                <th className="text-center">File Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Yildirim_Elif_lab03.zip</td>
                                                <td>
                                                    <a href='lab.pdf'> Download </a>
                                                </td>
                                                <td>
                                                    <a href='lab.pdf'> Delete </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Kaya_Murat_lab03.zip</td>
                                                <td>
                                                    <a href='lab.pdf'> Download </a>
                                                </td>
                                                <td>
                                                    <a href='lab.pdf'> Delete </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Gökcan_Mert_lab03.zip</td>
                                                <td>
                                                    <a href='lab.pdf'> Download </a>
                                                </td>
                                                <td>
                                                    <a href='lab.pdf'> Delete </a>
                                                </td>
                                            </tr>
                                            <tr />
                                        </tbody>
                                    </table> */}
                                </div>
                                <div className="text-center position-relative" />
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container d-flex justify-content-center align-items-center">
                    {/* Centered container for file upload */}
                    <div className="row pt-5">
                    <form onSubmit={handleSimilarityCheck}>
                    <div className="row pt-5">
                        <div className="col-md-8 text-center text-md-start mx-auto">
                        <div className="files color form-group mb-3">
                            <input type="file" webkitdirectory="true" directory="true" multiple name="files" onChange={handleFolderSelection} />
                        </div>
                        <select value={selectedLanguage} onChange={handleLanguageChange}>
                            <option value="python">Python</option>
                            <option value="c">C</option>
                        </select>

                        <div className="text-center">
                                <button
                                    type="submit"
                                    className="btn btn-primary shadow"
                                    onMouseEnter={() => setButtonHovered(true)}
                                    onMouseLeave={() => setButtonHovered(false)}
                                    style={{
                                        background: buttonHovered
                                            ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)`
                                            : "#ffffff",
                                        color: buttonHovered ? "#ffffff" : "#a50bf6",
                                        boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                        borderRadius: 13,
                                        borderWidth: 3,
                                        marginBottom: 40,
                                        marginTop: 15,
                                        borderColor: buttonHovered ? "var(--bs-navbar-active-color)" : "#a50bf6",
                                    }}
                                >
                                    Check for Similarity
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                    </div>
                </div>
            </>

            <Footer />
        </>
    )
}