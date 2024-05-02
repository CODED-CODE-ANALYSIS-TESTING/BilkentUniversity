import './assets/bootstrap/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import {useNavigate, useParams} from 'react-router-dom';
import Footer from './Footer';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';


export const CreateNewLab = () => {

    const [labName, setLabName] = useState('');
    const [labNo, setLabNo] = useState('');
    const [publishTime, setPublishTime] = useState('');
    const [plagCheck, setPlagCheck] = useState('');
    const [objective, setObjective] = useState('');
    const [noOfParts, setNoOfParts] = useState('');
    const [codeAnalyzer, setCodeAnalyzer] = useState('');
    const [lateSubmission, setLateSubmission] = useState('');
    const [latePolicyRate, setLatePolicyRate] = useState('');
    const [autoGrading, setAutoGrading] = useState('');
    const [viewTestCaseResult, setViewTestCaseResult] = useState('');
    const [labAnalytics, setLabAnalytics] = useState('');

    const [ pdfPath, setPdfPath] = useState('');


    // Handler functions for input changes

    const handleLabNameChange = (e) => {
        const value = e.target.value;
        setLabName(value);
        setIsLabNameFilled(value.trim() !== '');
    };

    const handleLabNoChange = (event) => {
        setLabNo(event.target.value);
    };

    const handlePublishTimeChange = (event) => {
        setPublishTime(event.target.value);
    };

 

    const handlePlagCheckChange = (event) => {
        setPlagCheck(event.target.value);
    };

    const handleObjectiveChange = (event) => {
        setObjective(event.target.value);
    };

    const handleNoOfPartsChange = (event) => {
        setNoOfParts(event.target.value);
    };

    const handleCodeAnalyzerChange = (event) => {
        setCodeAnalyzer(event.target.value);
    };

    const handleLateSubmissionChange = (event) => {
        setLateSubmission(event.target.value);
    };

    const handleLatePolicyRateChange = (event) => {
        setLatePolicyRate(event.target.value);
    };

    const handleAutoGradingChange = (event) => {
        setAutoGrading(event.target.value);
    };

    const handleViewTestCaseResultChange = (event) => {
        setViewTestCaseResult(event.target.value);
    };

    const handleLabAnalyticsChange = (event) => {
        setLabAnalytics(event.target.value);
    };

    const [cancelButtonHovered, setCancelButtonHovered] = useState(false);
    const [saveButtonHovered, setSaveButtonHovered] = useState(false);
    const [nextButtonHovered, setNextButtonHovered] = useState(false);
    const [prevButtonHovered, setPrevButtonHovered] = useState(false);
    const [uploadButtonHovered, setUploadButtonHovered] = useState(false);
    const [testButtonHovered, setTestButtonHovered] = useState(false);

    const path = useNavigate();


    const [isLabNameFilled, setIsLabNameFilled] = useState(false);
    const [showSelects, setShowSelects] = useState(false);
    const [taInputValue, setTaInputValue] = useState('');
    const [secInputValue, setSecInputValue] = useState('');
    const [numberOfSelects, setNumberOfSelects] = useState(0);
    const [numberOfTAs, setNumberOfTAs] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState(new Array(numberOfSelects).fill(''));

    const [step, setStep] = useState(1);
    // const [analysis, setAnalysis] = useState('');
    // const [selectedPdf, setSelectedPdf] = useState(null);
    // const [latePolicy, setLatePolicy] = useState(null);
    const { courseId } = useParams();

    const [courses, setCourses] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    const [numberOfSections, setNumberOfSections] = useState(1);
    const [numberOfCourseSections, setNumberOfCourseSections] = useState(1);
    const [sectionDeadlines, setSectionDeadlines] = useState(Array(numberOfCourseSections).fill(null));

    const navigate = useNavigate();

    const [testCases, setTestCases] = useState([]);
    const [labPart, setLabPart] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleTestCase = () => {
        // Check if lab part, input, and output are not empty
        if (labPart && input && output) {
            // Create a new test case object
            const newTestCase = {
                id: testCases.length + 1,
                labPart: labPart,
                input: input,
                output: output
            };
            // Add the new test case to the corresponding part's test cases
            setTestCases(prevTestCases => {
                const updatedTestCases = [...prevTestCases];
                const partIndex = Number(labPart.substr(labPart.length - 1)) - 1;
                updatedTestCases[partIndex] = [...(updatedTestCases[partIndex] || []), newTestCase];
                return updatedTestCases;
            });
            // Clear input and output fields
            setInput('');
            setOutput('');
            setLabPart( '');
        } else {
            alert('Please fill in all fields');
        }
    };

    const handleSectionDeadlineChange = (date, index) => {
        const updatedDeadlines = [...sectionDeadlines];
        updatedDeadlines[index] = date;
        setSectionDeadlines(updatedDeadlines);
    };

    const [partInputValue, setPartInputValue] = useState('');
    const [numberOfParts, setNumberOfParts] = useState(1);

    const handlePartInputChange = (e) => {
        setPartInputValue(e.target.value);
        const value = parseInt(e.target.value, 10); // Parse input as integer
        setNumberOfParts(value);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]); // Set the selected file to the first file in the list
    };


    const handleUpload = () => {
        return new Promise((resolve, reject) => {
            const jwtToken = localStorage.getItem('jwtToken');
            console.log('Stored JWT token:', jwtToken); // Verify it's correctly stored
            const userId = localStorage.getItem('userId');

            if (!selectedFile || !jwtToken) {
                console.error('Selected file or JWT token is missing.');
                // You can add code here to handle the missing file or token, such as displaying an error message
                return;
            }

            const formData = new FormData(); // Create a FormData object to send the file
            formData.append('file', selectedFile); // Append the selected file to the FormData object
            formData.append('bucketName', 'coded-bucket');
            formData.append('key', `user-uploads/${userId}/${new Date().getTime()}-${selectedFile.name}`);

            setPdfPath(`user-uploads/${userId}/${new Date().getTime()}-${selectedFile.name}`);


            // Define headers for the request
            const headers = {
                'Authorization': `Bearer ${jwtToken}`, // Include JWT token in the Authorization header
                'Content-Type': 'multipart/form-data', // Set content type for FormData
            };

            // Send a POST request to your backend to upload the file to S3
            axios.post('http://localhost:8080/api/upload', formData, { headers: headers })
                .then((response) => {
                    // Handle successful upload
                    console.log('File uploaded successfully123:', response.data);
                })
                .catch((error) => {
                    // Handle upload error
                    console.error('Error uploading file:', error);
                });
        });
    };

    // useEffect(() => {
    //     const fetchTestCases = async () => {
    //         try {
    //             const response = await fetch('http://localhost:8080/test_case');
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch test cases');
    //             }
    //             const data = await response.json();
    //             setTestCases(data);
    //         } catch (error) {
    //             console.error('Error fetching test cases:', error);
    //         }
    //     };
    //
    //     fetchTestCases();
    // }, []); // this effect runs once on component mount

    const fetchNumberOfCourseSections = async ( courseId) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken'); // Retrieve the stored JWT token
            const response = await axios.get(`http://localhost:8080/course/${courseId}/num_sections`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}` // Use JWT token for authorization
                }
            });
            console.log("Fetched sections:", response.data);
            setNumberOfCourseSections(response.data); // Update the labs state with fetched data
        } catch (error) {
            console.error('Failed to fetch labs:', error);
        }
    };

    // Use useEffect to call fetchLabs when the component mounts or courseId changes
    useEffect(() => {
        fetchNumberOfCourseSections( courseId);
    }, [courseId]);

    const nextStep = () => {
        setStep(step + 1);
    }

    const prevStep = () => {
        setStep(step - 1);
    }

    useEffect(() => {
        applyTextGradient('headerText', ['#2B0AFF', '#C307F9']);
    }, []);

    function applyTextGradient(elementId, colors) {
        var element = document.getElementById(elementId);
        if (element) {
            element.style.background = `linear-gradient(to right, ${colors.join(', ')})`;
            element.style.webkitBackgroundClip = 'text';
            element.style.color = 'transparent';
            element.style.display = 'inline-block';
        }
    }


    const handleTaInputChange = (e) => {
        setTaInputValue(e.target.value);
        const value = parseInt(e.target.value, 10); // Parse input as integer
        setNumberOfTAs(value);
    };

    const handleSecInputChange = (e) => {
        setSecInputValue(e.target.value);
        const value = parseInt(e.target.value, 10); // Parse input as integer
        setNumberOfSections(value);
    };

    const handleApplyClick = () => {
        const value = parseInt(taInputValue, 10);
        if (taInputValue === '' || (value >= 0 && value <= 10)) {
            setNumberOfSelects(taInputValue === '' ? 0 : value);
            setSelectedOptions(new Array(taInputValue).fill(''));
            setShowSelects(true);
        }
    };

    const handleSelectChange = (index, e) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[index] = e.target.value;
        setSelectedOptions(newSelectedOptions);
    };

    const handleCancelClick = () => {
        const confirmation = window.confirm('Are you sure you want to cancel? Your progress will be lost.');
        if (confirmation) {
            path('/dashboardInst');
            setCancelButtonHovered(false);
        }
    };

    // const handleSave = (e) => {
    //     e.preventDefault();
    //     const form = e.target;
    //     if (form.checkValidity()) {
    //         // saveLab();
    //         alert('Lab has been saved!');
    //         path('/dashboardInst');
    //     } else {
    //         alert('Please fill in all the fields!');
    //     }
    // };

    const handleSave = (sectionDeadlines) => {
        const jwtToken = localStorage.getItem('jwtToken');
        console.log('Stored JWT token:', localStorage.getItem('jwtToken')); // Verify it's correctly stored

        const uploadPromises = [];

        let data;

        // Iterate over sectionDeadlines array to send each deadline along with other properties
        console.log("!!!!!!!!!!uplaod path is ", pdfPath)
        sectionDeadlines.forEach((deadline, index) => {

            const uploadPromise = fetch(`http://localhost:8080/lab_assignment/add-lab?courseId=${courseId}`, {
                method: "POST",
                body: JSON.stringify({
                    addedBy: "Create Lab",
                    labNo: labNo,
                    deadline: deadline,
                    publish_time: new Date().toISOString(),
                    version: 1,
                    plagCheck: true,
                    objective: labName,
                    partialPoints: false,
                    noOfParts: 0,
                    similarityRate: null,
                    codeAnalyzer: codeAnalyzer,
                    lateSubmission: lateSubmission,
                    latePolicyRate: latePolicyRate,
                    autoGrading: false,
                    viewTestCaseResult: viewTestCaseResult,
                    latePolicyInterval: null,
                    labAnalytics: null,
                    upload_key:pdfPath,
                    section: index + 1 // Assuming sections are indexed starting from 1
                }),
                headers: {
                    'Authorization': 'Bearer ' + jwtToken,
                    'Content-Type': 'application/json'
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to create the lab');
                    }
                    return response.json();
                })
                .then(labData => {

                    parsePdf( pdfPath, labData.id)
                    // Update section_lab relationship
                    return fetch(`http://localhost:8080/lab_assignment/${labData.id}/assign-section?sectionNo=${index + 1}&courseId=${courseId}&labId=${labData.id}`, {
                        method: "POST",
                        headers: {
                            'Authorization': 'Bearer ' + jwtToken,
                            'Content-Type': 'application/json'
                        },
                    });
                })
                .catch(error => {
                    // Handle errors that occur during course creation
                    console.error("Error creating the lab:", error);
                    // Optionally, you can display an error message to the user
                });
                uploadPromises.push(uploadPromise);
        });

        Promise.all(uploadPromises)
            .then(() => {
                navigate(`/ViewUploadedLabs/${courseId}`);
            })
            .catch(error => {
                console.error("Error during operations:", error);
                // Optionally, handle error states here, e.g., showing an error message
            });
    };

    const parsePdf = (pdfPath, labAssignmentId) => {
        const jwtToken = localStorage.getItem('jwtToken');
        console.log('Stored JWT token:', jwtToken); // Verify it's correctly stored

        const requestData = {
            key: pdfPath,
            labAssignment: labAssignmentId
        };

        // Make a POST request to send the PDF key
        fetch(`http://localhost:8080/api/retrieve?key=${encodeURIComponent(pdfPath)}&labAssignmentId=${labAssignmentId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to retrieve PDF file');
                }
                return response.blob();
            })
            .then(blob => {
                // Convert blob to ArrayBuffer
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsArrayBuffer(blob);
                });
            })
            .then(arrayBuffer => {
                // Convert ArrayBuffer to byte array
                const byteArray = new Uint8Array(arrayBuffer);

                // Now you can send the byteArray to your backend for parsing
                // Example: call a function to send byteArray to the backend
                // parsePdfByteArray(byteArray);
                console.log('Byte array:', byteArray);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (

        <>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
            />
            <title>CODED | Add Lab</title>
            <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Raleway:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&display=swap"
            />
            <NavBar />

            <div style={{ marginTop: '20vh' }}>
                <h2 className="display-6 fw-bold mb-3" style={{ color: "#3c76ad", textAlign: "center" }}>
                    <span id="headerText">
                        <strong>Add a New Lab</strong>
                    </span>
                </h2>
            </div>

            {step === 1 && (
                <section style={{ background: "#ffffff", marginBottom: '10vh' }}>
                    <div className="container py-md-3">
                    <div align="center">
                            <h4 id="lab-name-header" style={{marginBottom: '1vh', color: "#1d0042"}}>
                                <strong>Lab Number</strong>
                            </h4>
                            <form method="post" data-bs-theme="light">
                                <div className="mb-3">
                                <input
                                    className="shadow form-control"
                                    type="number"
                                    name="labName"
                                    style={{ borderRadius: 13, width: '300px' }}  
                                    required
                                    value={labNo}
                                    onChange={handleLabNoChange}
                                />

                                </div>
                            </form>
                        </div>
                        <div align="center">
                            <h4 id="lab-name-header" style={{marginBottom: '1vh', color: "#1d0042"}}>
                                <strong>Lab Objective</strong>
                            </h4>
                            <form method="post" data-bs-theme="light">
                                <div className="mb-3">
                                    <input
                                        className="shadow form-control"
                                        type="labName"
                                        name="labName"
                                        placeholder="Strings, loops"
                                        style={{borderRadius: 13}}
                                        required
                                        value={labName}
                                        onChange={handleLabNameChange}
                                    />
                                </div>
                            </form>
                        </div>

                        <div style={{textAlign: "center"}}>
                            <h4 id="ta-select-header" style={{marginBottom: '1vh', marginTop: '1vh', color: "#1d0042"}}>
                                <strong>Lab File</strong>
                            </h4>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1em'
                        }}>
                            <div className="container d-flex justify-content-center align-items-center">
                                <div className="row pt-5">
                                    <div className="col-md-8 text-center text-md-start mx-auto">
                                        <div className="files color form-group mb-3">
                                            <input type="file" multiple="" name="files" onChange={handleFileChange}/>
                                        </div>
                                        <div className="text-center">
                                            <button
                                                className="btn btn-primary shadow"
                                                role="button"
                                                onMouseEnter={() => setUploadButtonHovered(true)}
                                                onMouseLeave={() => setUploadButtonHovered(false)}
                                                onClick={handleUpload}
                                                style={{
                                                    background: uploadButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                                    color: uploadButtonHovered ? "#ffffff" : "#a50bf6",
                                                    boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                                    borderRadius: 13,
                                                    borderWidth: 3,
                                                    marginBottom: 40,
                                                    marginTop: 15,
                                                    borderColor: uploadButtonHovered ? "var(--bs-navbar-active-color)" : "#a50bf6"
                                                }}
                                            >
                                                Upload
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/*<div style={{textAlign: "center"}}>*/}
                        {/*    <h4 id="ta-select-header"*/}
                        {/*        style={{marginBottom: '1vh', marginTop: '1vh', color: "#1d0042"}}>*/}
                        {/*        <strong>Lab Parts</strong>*/}
                        {/*    </h4>*/}
                        {/*</div>*/}
                        {/*<div style={{*/}
                        {/*    display: 'flex',*/}
                        {/*    alignItems: 'center',*/}
                        {/*    justifyContent: 'center',*/}
                        {/*    marginBottom: '1em'*/}
                        {/*}}>*/}
                        {/*    <label htmlFor="numberOfSelects" style={{marginRight: '0.5em', display: 'block'}}>Enter*/}
                        {/*        the number of lab parts:</label>*/}
                        {/*    <input*/}
                        {/*        type="number"*/}
                        {/*        id="numberOfParts"*/}
                        {/*        name="numberOfParts"*/}
                        {/*        min="1"*/}
                        {/*        max="15"*/}
                        {/*        value={noOfParts}*/}
                        {/*        onChange={handleNoOfPartsChange}*/}
                        {/*        style={{marginRight: '1rem', display: 'block', borderRadius: 13, width: '5em'}}*/}
                        {/*        required*/}
                        {/*    />*/}
                        {/*</div>*/}

                        <div align="center">
                            <button
                                className="btn btn-primary shadow"
                                role="button"
                                onMouseEnter={() => setCancelButtonHovered(true)}
                                onMouseLeave={() => setCancelButtonHovered(false)}
                                onClick={handleCancelClick}
                                style={{
                                    background: cancelButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                    color: cancelButtonHovered ? "#ffffff" : "#a50bf6",
                                    boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                    borderRadius: 13,
                                    borderWidth: 3,
                                    borderColor: cancelButtonHovered ? "#ffffff" : "#a50bf6",
                                    width: '150px',
                                    marginRight: '2em'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary shadow"
                                role="button"
                                onMouseEnter={() => setNextButtonHovered(true)}
                                onMouseLeave={() => setNextButtonHovered(false)}
                                onClick={(e) => {
                                    nextStep();
                                    /*if (labName > 0) {
                                        nextStep();
                                    }
                                    else {

                                        alert("Please fill all the fileds!");
                                    }
                                    setNextButtonHovered(false);*/
                                }}
                                style={{
                                    background: nextButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                    color: nextButtonHovered ? "#ffffff" : "#a50bf6",
                                    boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                    borderRadius: 13,
                                    borderWidth: 3,
                                    borderColor: nextButtonHovered ? "#ffffff" : "#a50bf6",
                                    width: '150px'
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </section>
            )}
            {step == 2 && (
                <section style={{background: "#ffffff", marginBottom: '10vh'}}>
                    <div className="container py-md-3">
                        <div align="center">

                            <div style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1em' }}>
                                    <label htmlFor="numberOfSelects" style={{ marginRight: '0.5em', display: 'block' }}>Allow test case results to be seen</label>
                                    <label style={{ marginRight: '0.5em' }}>
                                        <input
                                            type="radio"
                                            value="yes"
                                            checked={ viewTestCaseResult === true }
                                            onChange={() => setViewTestCaseResult(true)}
                                        />
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="no"
                                            checked={ viewTestCaseResult === false }
                                            onChange={() => setViewTestCaseResult(false )}
                                        />
                                        No
                                    </label>
                                </div>
                            </div>


                            <div style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1em' }}>
                                    <label htmlFor="numberOfSelects" style={{ marginRight: '0.5em', display: 'block' }}>Allow code analysis</label>
                                    <label style={{ marginRight: '0.5em' }}>
                                        <input
                                            type="radio"
                                            value="yes"
                                            checked={codeAnalyzer === true}
                                            onChange={() => setCodeAnalyzer(true)}
                                        />
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="no"
                                            checked={codeAnalyzer === false}
                                            onChange={() => setCodeAnalyzer(false)}
                                        />
                                        No
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1em' }}>
                                <label htmlFor="latesubmission" style={{ marginRight: '0.5em', display: 'block' }}>Allow late submission</label>
                                    <label style={{ marginRight: '0.5em' }}>
                                        <input
                                            type="radio"
                                            value="yes"
                                            checked={lateSubmission === true }
                                            onChange={() => {
                                                setLateSubmission(true );
                                                setLatePolicyRate('');
                                            }}
                                        />
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="no"
                                            checked={lateSubmission === false }
                                            onChange={() => {
                                                setLateSubmission(false );
                                                setLatePolicyRate('');
                                            }}
                                        />
                                        No
                                    </label>
                                </div>
                                {/* Additional input field for late policy */}
                                {lateSubmission === 'yes' && (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1em' }}>
                                            <label htmlFor="latePolicy" style={{ marginRight: '0.5em', display: 'block' }}>Late Policy:</label>
                                            <input
                                                type="text"
                                                value={latePolicyRate}
                                                onChange={(e) => setLatePolicyRate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                            <button
                                className="btn btn-primary shadow"
                                role="button"
                                onMouseEnter={() => setPrevButtonHovered(true)}
                                onMouseLeave={() => setPrevButtonHovered(false)}
                                onClick={(e) => {
                                    prevStep();
                                    setPrevButtonHovered(false);
                                }}
                                style={{
                                    background: prevButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                    color: prevButtonHovered ? "#ffffff" : "#a50bf6",
                                    boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                    borderRadius: 13,
                                    borderWidth: 3,
                                    borderColor: prevButtonHovered ? "#ffffff" : "#a50bf6",
                                    width: '150px',
                                    marginRight: '2em'
                                }}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-primary shadow"
                                role="button"
                                onMouseEnter={() => setCancelButtonHovered(true)}
                                onMouseLeave={() => setCancelButtonHovered(false)}
                                onClick={handleCancelClick}
                                style={{
                                    background: cancelButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                    color: cancelButtonHovered ? "#ffffff" : "#a50bf6",
                                    boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                    borderRadius: 13,
                                    borderWidth: 3,
                                    borderColor: cancelButtonHovered ? "#ffffff" : "#a50bf6",
                                    width: '150px',
                                    marginRight: '2em'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary shadow"
                                role="button"
                                onMouseEnter={() => setNextButtonHovered(true)}
                                onMouseLeave={() => setNextButtonHovered(false)}
                                onClick={(e) => {
                                    nextStep();
                                }}
                                style={{
                                    background: nextButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                    color: nextButtonHovered ? "#ffffff" : "#a50bf6",
                                    boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                    borderRadius: 13,
                                    borderWidth: 3,
                                    borderColor: nextButtonHovered ? "#ffffff" : "#a50bf6",
                                    width: '150px'
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {step == 3 && (
                <section style={{background: "#ffffff", marginBottom: '10vh'}}>
                    <div className="container py-md-3">
                        <div align="center">
                            <div style={{textAlign: 'center'}}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1em'
                                }}>
                                    <div align="center">
                                        <h4 id="lab-name-header" style={{marginBottom: '1vh', color: "#1d0042"}}>
                                            <strong>Set Lab Deadlines for Each Section</strong>
                                        </h4>
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>Section</th>
                                                <th>Deadline</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {Array.from({length: numberOfCourseSections}).map((_, index) => (
                                                <tr key={index}>
                                                    <td>{`Section ${index + 1}`}</td>
                                                    <td>
                                                        <DatePicker
                                                            className="shadow form-control"
                                                            selected={sectionDeadlines[index]} // Assuming you have an array `sectionDeadlines` to hold deadlines for each section
                                                            onChange={(date) => handleSectionDeadlineChange(date, index)} // Assuming you have a function `handleSectionDeadlineChange` to handle deadline changes
                                                            dateFormat="yyyy-MM-dd"
                                                            placeholder="yyyy-MM-dd"
                                                            minDate={new Date()}
                                                            style={{borderRadius: 13}}
                                                            required
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary shadow"
                                role="button"
                                onMouseEnter={() => setPrevButtonHovered(true)}
                                onMouseLeave={() => setPrevButtonHovered(false)}
                                onClick={(e) => {
                                    prevStep();
                                    setPrevButtonHovered(false);
                                }}
                                style={{
                                    background: prevButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                    color: prevButtonHovered ? "#ffffff" : "#a50bf6",
                                    boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                    borderRadius: 13,
                                    borderWidth: 3,
                                    borderColor: prevButtonHovered ? "#ffffff" : "#a50bf6",
                                    width: '150px',
                                    marginRight: '2em'
                                }}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-primary shadow"
                                role="button"
                                onMouseEnter={() => setCancelButtonHovered(true)}
                                onMouseLeave={() => setCancelButtonHovered(false)}
                                onClick={handleCancelClick}
                                style={{
                                    background: cancelButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                    color: cancelButtonHovered ? "#ffffff" : "#a50bf6",
                                    boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                    borderRadius: 13,
                                    borderWidth: 3,
                                    borderColor: cancelButtonHovered ? "#ffffff" : "#a50bf6",
                                    width: '150px',
                                    marginRight: '2em'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary shadow"
                                role="button"
                                onMouseEnter={() => setNextButtonHovered(true)}
                                onMouseLeave={() => setNextButtonHovered(false)}
                                onClick={(e) => {
                                    nextStep();
                                }}
                                style={{
                                    background: nextButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                    color: nextButtonHovered ? "#ffffff" : "#a50bf6",
                                    boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                    borderRadius: 13,
                                    borderWidth: 3,
                                    borderColor: nextButtonHovered ? "#ffffff" : "#a50bf6",
                                    width: '150px'
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/*{step == 4 && (*/}

            {/*    <section style={{background: "#ffffff", marginBottom: '10vh'}}>*/}
            {/*        <div className="container py-md-3">*/}
            {/*            <div align="center">*/}
            {/*                <div style={{textAlign: "center"}}>*/}
            {/*                    <h1 id="ta-select-header"*/}
            {/*                        style={{marginBottom: '10vh', marginTop: '1vh', color: "#1d0042"}}>*/}
            {/*                        <strong>Add Test Cases</strong>*/}
            {/*                    </h1>*/}
            {/*                </div>*/}
            {/*                {[...Array( numberOfParts)].map((_, index) => (*/}
            {/*                    <div key={index} className="row pt-5">*/}
            {/*                        <div className="col-md-8 col-lg-9 text-center text-md-start mx-auto">*/}
            {/*                            <h3 className="text-center">Part {index + 1}</h3>*/}
            {/*                            <div*/}
            {/*                                className="table-responsive text-center d-lg-flex"*/}
            {/*                                style={{boxShadow: "0px 0px 14px 2px #bec1de", borderRadius: '13px'}}*/}
            {/*                            >*/}
            {/*                                <table className="table table-striped-columns table-hover">*/}
            {/*                                    <thead>*/}
            {/*                                    <tr>*/}
            {/*                                        <th className="text-center">Test Case</th>*/}
            {/*                                        <th className="text-center">Inputs</th>*/}
            {/*                                        <th className="text-center">Outputs</th>*/}
            {/*                                        <th className="text-center">Actions</th>*/}
            {/*                                    </tr>*/}
            {/*                                    </thead>*/}
            {/*                                    <tbody>*/}
            {/*                                    {testCases[index] && testCases[index].map(testCase => (*/}
            {/*                                        <tr key={testCase.id}>*/}
            {/*                                            <td>{testCase.id}</td>*/}
            {/*                                            <td>{testCase.input}</td>*/}
            {/*                                            <td>{testCase.output}</td>*/}
            {/*                                            <td>*/}
            {/*                                                <a href={`edit/${testCase.id}`}>Edit</a>*/}
            {/*                                                &nbsp;|&nbsp;*/}
            {/*                                                <a href={`delete/${testCase.id}`}>Delete</a>*/}
            {/*                                            </td>*/}
            {/*                                        </tr>*/}
            {/*                                    ))}*/}
            {/*                                    </tbody>*/}
            {/*                                </table>*/}
            {/*                            </div>*/}
            {/*                            <div className="text-center position-relative"/>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                ))}*/}
            {/*                <div className="container d-flex justify-content-center align-items-center">*/}
            {/*                    <div className="row pt-5 justify-content-center">*/}
            {/*                        <div className="col-md-8 text-center text-md-start">*/}
            {/*                            <div className="text-center">*/}
            {/*                                <select*/}
            {/*                                    className="form-select mb-3"*/}
            {/*                                    aria-label="Choose lab part"*/}
            {/*                                    style={{*/}
            {/*                                        borderRadius: 13,*/}
            {/*                                        borderWidth: 3,*/}
            {/*                                    }}*/}
            {/*                                    value={labPart}*/}
            {/*                                    onChange={(e) => setLabPart(e.target.value)}*/}
            {/*                                >*/}
            {/*                                    <option value="">Choose Lab Part</option>*/}
            {/*                                    {[...Array(numberOfParts)].map((_, index) => (*/}
            {/*                                        <option key={index}*/}
            {/*                                                value={`Part ${index + 1}`}>Part {index + 1}</option>*/}
            {/*                                    ))}*/}
            {/*                                </select>*/}
            {/*                                <input*/}
            {/*                                    type="text"*/}
            {/*                                    className="form-control mb-3"*/}
            {/*                                    placeholder="Inputs"*/}
            {/*                                    style={{*/}
            {/*                                        borderRadius: 13,*/}
            {/*                                        borderWidth: 3,*/}
            {/*                                    }}*/}
            {/*                                    value={input}*/}
            {/*                                    onChange={(e) => setInput(e.target.value)}*/}
            {/*                                />*/}
            {/*                                <input*/}
            {/*                                    type="text"*/}
            {/*                                    className="form-control mb-3"*/}
            {/*                                    placeholder="Outputs"*/}
            {/*                                    style={{*/}
            {/*                                        borderRadius: 13,*/}
            {/*                                        borderWidth: 3,*/}
            {/*                                    }}*/}
            {/*                                    value={output}*/}
            {/*                                    onChange={(e) => setOutput(e.target.value)}*/}
            {/*                                />*/}
            {/*                                <button*/}
            {/*                                    className="btn btn-primary shadow"*/}
            {/*                                    role="button"*/}
            {/*                                    onMouseEnter={() => setTestButtonHovered(true)}*/}
            {/*                                    onMouseLeave={() => setTestButtonHovered(false)}*/}
            {/*                                    style={{*/}
            {/*                                        background: testButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",*/}
            {/*                                        color: testButtonHovered ? "#ffffff" : "#a50bf6",*/}
            {/*                                        boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",*/}
            {/*                                        borderRadius: 13,*/}
            {/*                                        borderWidth: 3,*/}
            {/*                                        marginBottom: 40,*/}
            {/*                                        marginTop: 15,*/}
            {/*                                        borderColor: testButtonHovered ? "var(--bs-navbar-active-color)" : "#a50bf6",*/}
            {/*                                        width: 200*/}
            {/*                                    }}*/}
            {/*                                    onClick={handleTestCase} // Show the modal when the button is clicked*/}
            {/*                                >*/}
            {/*                                    Add Test Case*/}
            {/*                                </button>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <button*/}
            {/*                    className="btn btn-primary shadow"*/}
            {/*                    role="button"*/}
            {/*                    onMouseEnter={() => setPrevButtonHovered(true)}*/}
            {/*                    onMouseLeave={() => setPrevButtonHovered(false)}*/}
            {/*                    onClick={(e) => {*/}
            {/*                        prevStep();*/}
            {/*                        setPrevButtonHovered(false);*/}
            {/*                    }}*/}
            {/*                    style={{*/}
            {/*                        background: prevButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",*/}
            {/*                        color: prevButtonHovered ? "#ffffff" : "#a50bf6",*/}
            {/*                        boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",*/}
            {/*                        borderRadius: 13,*/}
            {/*                        borderWidth: 3,*/}
            {/*                        borderColor: prevButtonHovered ? "#ffffff" : "#a50bf6",*/}
            {/*                        width: '150px',*/}
            {/*                        marginRight: '2em'*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    Previous*/}
            {/*                </button>*/}
            {/*                <button*/}
            {/*                    className="btn btn-primary shadow"*/}
            {/*                    role="button"*/}
            {/*                    onMouseEnter={() => setCancelButtonHovered(true)}*/}
            {/*                    onMouseLeave={() => setCancelButtonHovered(false)}*/}
            {/*                    onClick={handleCancelClick}*/}
            {/*                    style={{*/}
            {/*                        background: cancelButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",*/}
            {/*                        color: cancelButtonHovered ? "#ffffff" : "#a50bf6",*/}
            {/*                        boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",*/}
            {/*                        borderRadius: 13,*/}
            {/*                        borderWidth: 3,*/}
            {/*                        borderColor: cancelButtonHovered ? "#ffffff" : "#a50bf6",*/}
            {/*                        width: '150px',*/}
            {/*                        marginRight: '2em'*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    Cancel*/}
            {/*                </button>*/}
            {/*                <button*/}
            {/*                    className="btn btn-primary shadow"*/}
            {/*                    role="button"*/}
            {/*                    onMouseEnter={() => setNextButtonHovered(true)}*/}
            {/*                    onMouseLeave={() => setNextButtonHovered(false)}*/}
            {/*                    onClick={(e) => {*/}
            {/*                        nextStep();*/}
            {/*                    }}*/}
            {/*                    style={{*/}
            {/*                        background: nextButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",*/}
            {/*                        color: nextButtonHovered ? "#ffffff" : "#a50bf6",*/}
            {/*                        boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",*/}
            {/*                        borderRadius: 13,*/}
            {/*                        borderWidth: 3,*/}
            {/*                        borderColor: nextButtonHovered ? "#ffffff" : "#a50bf6",*/}
            {/*                        width: '150px'*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    Next*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </section>*/}

            {/*)}*/}

            {
                step == 4 && (
                    <section style={{background: "#ffffff", marginBottom: '10vh'}}>
                        <div className="container py-md-3">
                            <div align="center">
                                <div style={{textAlign: "center"}}>
                                    <h1 id="ta-select-header"
                                        style={{marginBottom: '10vh', marginTop: '1vh', color: "#1d0042"}}>
                                        <strong>Lab Summary</strong>
                                    </h1>
                                </div>
                                <table className="table table-striped-columns table-hover"
                                       style={{maxWidth: '70%', marginBottom: '5vh'}}>
                                    <tbody>
                                    <tr>
                                        <td>Lab Name</td>
                                        <td>{labName}</td>
                                    </tr>
                                    <tr>
                                        <td>Testcase</td>
                                        <td>{viewTestCaseResult ? 'Yes' : 'No'}</td>
                                    </tr>
                                    <tr>
                                        <td>Analysis</td>
                                        <td>{codeAnalyzer ? 'Yes' : 'No'}</td>
                                    </tr>
                                    <tr>
                                        <td>Late Sumbission</td>
                                        <td>{lateSubmission ? 'Yes' : 'No'}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div align="center">
                                <embed src={URL.createObjectURL( selectedFile)} type="application/pdf" width="80%"
                                       height="600px"/>
                            </div>


                            <div align="center">
                            <button
                                    className="btn btn-primary shadow"
                                    role="button"
                                    onMouseEnter={() => setPrevButtonHovered(true)}
                                    onMouseLeave={() => setPrevButtonHovered(false)}
                                    onClick={(e) => {
                                        prevStep();
                                        setPrevButtonHovered(false);
                                    }}
                                    style={{
                                        background: prevButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                        color: prevButtonHovered ? "#ffffff" : "#a50bf6",
                                        boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                        borderRadius: 13,
                                        borderWidth: 3,
                                        borderColor: prevButtonHovered ? "#ffffff" : "#a50bf6",
                                        width: '150px',
                                        marginRight: '2em'
                                    }}
                                >
                                    Previous
                                </button>
                                <button
                                    className="btn btn-primary shadow"
                                    role="button"
                                    onMouseEnter={() => setCancelButtonHovered(true)}
                                    onMouseLeave={() => setCancelButtonHovered(false)}
                                    onClick={handleCancelClick}
                                    style={{
                                        background: cancelButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                        color: cancelButtonHovered ? "#ffffff" : "#a50bf6",
                                        boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                        borderRadius: 13,
                                        borderWidth: 3,
                                        borderColor: cancelButtonHovered ? "#ffffff" : "#a50bf6",
                                        width: '150px',
                                        marginRight: '2em'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary shadow"
                                    role="button"
                                    onMouseEnter={() => setSaveButtonHovered(true)}
                                    onMouseLeave={() => setSaveButtonHovered(false)}
                                    onClick={(e) => {
                                        handleSave(sectionDeadlines); // Call handleSave with sectionDeadlines
                                    }}

                                    style={{
                                        background: saveButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                        color: saveButtonHovered ? "#ffffff" : "#a50bf6",
                                        boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                        borderRadius: 13,
                                        borderWidth: 3,
                                        borderColor: saveButtonHovered ? "#ffffff" : "#a50bf6",
                                        width: '150px'
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </section>

                )}
            <Footer/>
        </>
    );
};
export default CreateNewLab;