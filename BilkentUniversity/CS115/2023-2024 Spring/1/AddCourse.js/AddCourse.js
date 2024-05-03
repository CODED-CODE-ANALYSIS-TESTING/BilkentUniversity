import './assets/bootstrap/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import axios from "axios";

export const AddCourse = () => {
    const [cancelButtonHovered, setCancelButtonHovered] = useState(false);
    const [saveButtonHovered, setSaveButtonHovered] = useState(false);
    const [nextButtonHovered, setNextButtonHovered] = useState(false);
    const [prevButtonHovered, setPrevButtonHovered] = useState(false);
    const [uploadButtonHovered, setUploadButtonHovered] = useState(false);
    const path = useNavigate();

    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');

    const [isCourseNameFilled, setIsCourseNameFilled] = useState(false);
    const [showSelects, setShowSelects] = useState(false);
    const [taInputValue, setTaInputValue] = useState('');
    const [secInputValue, setSecInputValue] = useState('');
    const [numberOfSelects, setNumberOfSelects] = useState(0);
    const [numberOfTAs, setNumberOfTAs] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState(new Array(numberOfSelects).fill(''));
    const [selectedPdf, setSelectedPdf] = useState(null);

    const [step, setStep] = useState(1);
    const [numberOfSections, setNumberOfSections] = useState(1);
    const [sameTAs, setSameTAs] = useState('');

    const [selectedInstOptions, setSelectedInstOptions] = useState([]);
    const [instructors, setInstructors] = useState([]);

    const [ fileKey, setFileKey] = useState('');
    const [ courseId, setCourseId] = useState('');
    const [ universityId, setUniversityId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (fileKey) {
            createUsers();
        }
    }, [fileKey]);



    const handleFileSelect = (event) => {
        const file = event.target.files[0]; // Get the first selected file
        setSelectedPdf(file); // Set the selectedPdf state variable to the selected file
    };

    const handleUpload = () => {
        return new Promise((resolve, reject) => {
            const jwtToken = localStorage.getItem('jwtToken');
            console.log('Stored JWT token:', jwtToken); // Verify it's correctly stored
            const userId = localStorage.getItem('userId');

            if (!selectedPdf || !jwtToken) {
                console.error('Selected file or JWT token is missing.');
                // You can add code here to handle the missing file or token, such as displaying an error message
                return;
            }

            const formData = new FormData(); // Create a FormData object to send the file
            formData.append('file', selectedPdf); // Append the selected file to the FormData object
            formData.append('bucketName', 'coded-bucket');
            formData.append('key', `user-uploads/${userId}/${new Date().getTime()}-${selectedPdf.name}`);

            //setFileKey(`user-uploads/${userId}/${new Date().getTime()}-${selectedPdf.name}`);

            const newFileKey = `user-uploads/${userId}/${new Date().getTime()}-${selectedPdf.name}`;
            setFileKey(newFileKey);
            createUsers( newFileKey);

            // Define headers for the request
            const headers = {
                'Authorization': `Bearer ${jwtToken}`, // Include JWT token in the Authorization header
                'Content-Type': 'multipart/form-data', // Set content type for FormData
            };

            // Send a POST request to your backend to upload the file to S3
            axios.post('http://localhost:8080/api/upload', formData, { headers: headers })
                .then((response) => {
                    // Handle successful upload
                    console.log('File uploaded successfully:', response.data);

                    if (fileKey) {
                        createUsers();
                    }
                })
                .catch((error) => {
                    // Handle upload error
                    console.error('Error uploading file:', error);
                });
        });
    };


    useEffect(() => {
        const fetchInstructors = async () => {
            const jwtToken = localStorage.getItem('jwtToken'); // Retrieve the stored JWT token

            try {
                const response = await axios.get('http://localhost:8080/user/instructors', {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });
                console.log("Fetched Instructors:", response.data);
                setInstructors(response.data);

            } catch (error) {
                console.error('Failed to fetch instructors:', error);
            }
        };

        fetchInstructors();
    }, []);


    const handleSelectInstChange = (e) => {
        const selectedInstructorNames = Array.from(e.target.selectedOptions, option => option.value);
        const selectedInstructors = instructors.filter(instructor => selectedInstructorNames.includes(instructor.name));
        setSelectedInstOptions(selectedInstructors);
    };

    const [TAs, setTAs] = useState([]);
    const [selectedTAOptions, setSelectedTAOptions] = useState([]);

    useEffect(() => {
        const fetchTAs = async () => {
            const jwtToken = localStorage.getItem('jwtToken'); // Retrieve the stored JWT token

            try {
                const response = await axios.get('http://localhost:8080/user/TAs', {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });
                console.log("Fetched TAs:", response.data);
                setTAs(response.data);

            } catch (error) {
                console.error('Failed to fetch TAs:', error);
            }
        };

        fetchTAs();
    }, []);

    const [selectedTAsForAllSections, setSelectedTAsForAllSections] = useState([]);
    const [selectedTAsBySection, setSelectedTAsBySection] = useState([]);

// Define a function to handle changes in TA selection for each section
    const handleSelectedTAsChange = (selectedTAs, sectionIndex) => {
        const updatedSelectedTAsBySection = [...selectedTAsBySection];
        updatedSelectedTAsBySection[sectionIndex] = selectedTAs;
        setSelectedTAsBySection(updatedSelectedTAsBySection);
    };



    const nextStep = () => {
        setStep( step + 1 );
    }

    const prevStep = () => {
        setStep( step - 1 );
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

    const handleCourseNameChange = (e) => {
        const value = e.target.value;
        setCourseName(value);
        setIsCourseNameFilled(value.trim() !== '');
    };

    const handleCourseCodeChange = (e) => {
        const value = e.target.value;
        setCourseCode(value);
    };

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

    const handleSave = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        console.log('Stored JWT token:', localStorage.getItem('jwtToken')); // Verify it's correctly stored

        try {
            // Send the course data to the backend
            const response = await fetch("http://localhost:8080/course", {
                method: "POST",
                body: JSON.stringify({
                    voice_response_enabled: false,
                    addedBy: "Create Course",
                    courseCode: courseCode,
                    courseName: courseName,
                    noOfSections: secInputValue,
                    semester: "semester",
                    instructors: selectedInstOptions,
                    coordinator: null,
                    sections: [], // Placeholder for section data
                    university: null,
                    graders: []
                }),
                headers: {
                    'Authorization': 'Bearer ' + jwtToken,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to create the course');
            }

            const courseData = await response.json();

            // Handle successful response from the backend
            console.log("Course created successfully:", courseData);
            handleUpload();
            setCourseId(parseInt(courseData.id));
            setUniversityId(1);

            // After the course is created, create sections
            await createSections(courseData.id, courseData.noOfSections); // Pass the course ID and number of sections

            console.log('File Key:', fileKey);

            navigate(`/dashboardInst`);
        } catch (error) {
            // Handle errors that occur during course creation
            console.error("Error creating the course:", error);
            // Optionally, you can display an error message to the user
        }
    };

    const createSections = (courseId, numberOfSections) => {
        const jwtToken = localStorage.getItem('jwtToken');
        console.log('Stored JWT token:', localStorage.getItem('jwtToken')); // Verify it's correctly stored

        // Prepare section data to send to the backend
        const sectionData = {
            courseId: courseId,
            numberOfSections: numberOfSections
        };

        console.log('Section Data:', courseId, ' ', numberOfSections)

        // Send the section data to the backend
        fetch("http://localhost:8080/section/create", {
            method: "POST",
            body: JSON.stringify(sectionData),
            headers: {
                'Authorization': 'Bearer ' + jwtToken,
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create sections');
                }
                return response.json();
            })
            .then(data => {
                // Handle successful response from the backend
                console.log("Sections created successfully!!:", data);

                if (sameTAs === 'yes') {
                    // If same TAs are selected for all sections
                    const selectedTAs = selectedTAsForAllSections;
                    for (let i = 1; i <= numberOfSections; i++) {
                        //console.log("IIII:", data[i - 1].id);
                        console.log("TASSSSS:", selectedTAs);
                        //updateTASection(selectedTAs, data[i - 1].id);
                    }
                } else if (sameTAs === 'no') {
                    // If different TAs are selected for each section
                    for (let i = 1; i <= numberOfSections; i++) {
                        const selectedTAs = selectedTAOptions[`section${i}`];
                        updateTASection(selectedTAs, data[`section${i}`]);
                    }
                }
                // Optionally, you can perform additional actions after successful creation
            })
            .catch(error => {
                // Handle errors that occur during section creation
                console.error("Error creating sections:", error);
                // Optionally, you can display an error message to the user
            });
    };

    const createUsers = async (newFileKey) => {
        console.log( "IN, FILE KEY: ", newFileKey)
        if( fileKey){
        try {
            const response = await fetch('http://ec2-34-227-46-113.compute-1.amazonaws.com:8001/sendWelcomeEmailFromCSV', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file_key: newFileKey,
                    course_id: 2, //courseId
                    university_id: 1 //universityId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send request');
            }

            const data = await response.json();
            // Handle the response data here

        } catch (error) {
            console.error('Error:', error);
        }
        }
    };


    const updateTASection = async (selectedTAs, sectionId) => {
        const jwtToken = localStorage.getItem('jwtToken');

        // Define a function to send a single request
        const sendRequest = async (ta) => {

            console.log( "TA ID::: ", ta, "Section ID::: ", sectionId);

            try {
                const response = await fetch(`http://localhost:8080/section/update-ta?taId=${ta}&sectionId=${sectionId}`, {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + jwtToken,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to update TA_section table');
                }

                const data = await response.json();
                console.log("TA_section table updated successfully:", data);
            } catch (error) {
                console.error("Error updating TA_section table:", error);
                // Optionally, handle the error
            }
        };

        // Send requests sequentially using Promise chaining
        selectedTAs.reduce((promiseChain, ta) => {
            return promiseChain.then(() => sendRequest(ta));
        }, Promise.resolve());
    };


    return (

        <>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
            />
            <title>CODED | Add Course</title>
            <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Raleway:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&display=swap"
            />
            <NavBar />

            {/* <section className="py-4 py-md-5 my-5" style={{ background: "#ffffff" }}>
                <div className="container py-md-3">
                    <div className="add-course-header">
                        <h2 className="display-6 fw-bold mb-3" style={{ color: "#3c76ad", textAlign: "center" }}>
                            <span id="headerText">
                                <strong>Add a New Course</strong>
                            </span>
                        </h2>
                    </div>
                </div>
            </section> */}

            <div style={{marginTop:'20vh'}}>
                <h2 className="display-6 fw-bold mb-3" style={{ color: "#3c76ad", textAlign: "center" }}>
                    <span id="headerText">
                        <strong>Add a New Course</strong>
                    </span>
                </h2>
            </div>
            
            {step === 1 && (
                <section style={{ background: "#ffffff", marginBottom: '10vh' }}>
                    <div className="container py-md-3">
                        {/* <div className="add-course-header">
                            <h2 className="display-6 fw-bold mb-3" style={{ color: "#3c76ad", textAlign: "center" }}>
                                <span className="underline pb-1" id="headerText">
                                    <strong>Add a New Course</strong>
                                </span>
                            </h2>
                        </div> */}
                        <div align="center">
                            <h4 id="course-name-header" style={{marginBottom: '1vh', color: "#1d0042"}}>
                                <strong>Course Name</strong>
                            </h4>
                            <form method="post" data-bs-theme="light">
                                <div className="mb-3">
                                    <input
                                        className="shadow form-control"
                                        type="courseName"
                                        name="courseName"
                                        placeholder="'Introduction to Data Structures'"
                                        style={{borderRadius: 13}}
                                        required
                                        value={courseName}
                                        onChange={handleCourseNameChange}
                                    />
                                </div>
                            </form>
                            <h4 id="course-name-header" style={{marginBottom: '1vh', color: "#1d0042"}}>
                                <strong>Course Code</strong>
                            </h4>
                            <form method="post" data-bs-theme="light">
                                <div className="mb-3">
                                    <input
                                        className="shadow form-control"
                                        type="courseCode"
                                        name="courseCode"
                                        placeholder="'CS 115'"
                                        style={{borderRadius: 13}}
                                        required
                                        value={courseCode}
                                        onChange={handleCourseCodeChange}
                                    />
                                </div>
                            </form>
                        </div>


                        <div style={{textAlign: "center"}}>
                            <h4 id="ta-select-header" style={{marginBottom: '1vh', marginTop: '1vh', color: "#1d0042"}}>
                                <strong>Sections</strong>
                            </h4>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1em'
                        }}>
                            <label htmlFor="numberOfSelects" style={{marginRight: '0.5em', display: 'block'}}>Enter the
                                number of sections:</label>
                            <input
                                type="number"
                                id="numberOfSelects"
                                name="numberOfSelects"
                                min="1"
                                max="15"
                                value={secInputValue}
                                onChange={handleSecInputChange}
                                style={{marginRight: '1rem', display: 'block', borderRadius: 13, width: '5em'}}
                                required
                            />
                        </div>

                        <div style={{textAlign: "center"}}>
                            <h4 id="ta-select-header" style={{marginBottom: '1vh', marginTop: '1vh', color: "#1d0042"}}>
                                <strong>Students</strong>
                            </h4>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1em'
                        }}>
                            <label htmlFor="numberOfSelects" style={{marginRight: '0.5em', display: 'block'}}>Upload the
                                csv file of students taking the course</label>
                        </div>
                        <div className="files color form-group mb-3">
                            <input type="file" multiple="" name="files" onChange={handleFileSelect}/>
                        </div>

                        <h4 id="ta-select-header" style={{marginBottom: '1vh', marginTop: '1vh', color: "#1d0042"}}>
                            <strong>Instructors</strong>
                        </h4>
                        <div style={{textAlign: 'center'}}>
                            <div style={{marginBottom: '1em'}}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <select
                                        className="shadow form-select"
                                        multiple  // Allow multiple selections
                                        value={selectedInstOptions.map(instructor => instructor.name)}  // Use an array of instructor names to track selected options
                                        onChange={(e) => handleSelectInstChange(e)}  // Adjust the handler to handle multiple selections
                                        required
                                        style={{width: '50%', borderRadius: 13, marginBottom: '0.5em'}}
                                    >
                                        {instructors.map(instructor => (
                                            <option key={instructor.id} value={instructor.name}>
                                                {instructor.name}  {instructor.surname}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                            </div>
                        </div>


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
                                    if (courseName && secInputValue > 0) {
                                        nextStep();
                                    } else {

                                        alert("Please fill all the fileds!");
                                    }
                                    setNextButtonHovered(false);
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
            {step === 2 && (
                <section style={{background: "#ffffff", marginBottom: '10vh'}}>
                    <div className="container py-md-3">
                        <div align="center">
                            <div style={{textAlign: "center"}}>
                                <h4 id="ta-select-header" style={{marginBottom: '1vh', marginTop: '1vh', color: "#1d0042"}}>
                                    <strong>TAs</strong>
                                </h4>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1em' }}>
                                    <label htmlFor="numberOfSelects" style={{ marginRight: '0.5em', display: 'block'}}>Will each section have the same TAs?</label>
                                    <label style={{ marginRight: '0.5em' }}>
                                        <input
                                            type="radio"
                                            value="yes"
                                            checked={ sameTAs === 'yes' }
                                            onChange={ () => setSameTAs( 'yes' ) }
                                        />
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="no"
                                            checked={ sameTAs === 'no' }
                                            onChange={ () => setSameTAs( 'no' ) }
                                        />
                                        No
                                    </label>
                                </div>
                            </div>

                            {sameTAs === 'yes' &&
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1em' }}>
                                        <label htmlFor="taDropdown" style={{ marginRight: '0.5em', display: 'block'}}>Select TA(s):</label>
                                        <select
                                            multiple
                                            id="taDropdown"
                                            className="shadow form-select"
                                            value={selectedTAsForAllSections} // Use selectedTAsForAllSections here
                                            onChange={(e) => setSelectedTAsForAllSections(Array.from(e.target.selectedOptions, option => option.value))}
                                            style={{ borderRadius: 13, width: '15em' }}
                                            required
                                        >
                                            <option value="">Choose TA(s)</option>
                                            {TAs.map(TA => (
                                                <option key={TA.id} value={TA.id}>
                                                    {TA.name} {TA.surname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            }

                            {sameTAs === 'no' &&
                                <div style={{ textAlign: 'center' }}>
                                    {[...Array(numberOfSections)].map((_, sectionIndex) => (
                                        <div key={sectionIndex} style={{marginBottom: '1em'}}>
                                            <h4 style={{marginBottom: '0.5em'}}>Section {sectionIndex + 1}</h4>
                                            <select
                                                multiple
                                                id={`taDropdown_${sectionIndex}`} // Use unique id for each select element
                                                className="shadow form-select"
                                                value={selectedTAsBySection[sectionIndex]} // Use separate state variable for each section
                                                onChange={(e) => handleSelectedTAsChange(e.target.value, sectionIndex)} // Pass section index to the handler function
                                                style={{borderRadius: 13, width: '15em', alignItems: 'center'}}
                                                required
                                            >
                                                <option value="">Choose TA(s)</option>
                                                {TAs.map(TA => (
                                                    <option key={TA.id} value={TA.id}>
                                                        {TA.name} {TA.surname}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            }


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
                                onClick={(e) => handleSave(e)}
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


            <Footer />
        </> 
    );
};
export default AddCourse;