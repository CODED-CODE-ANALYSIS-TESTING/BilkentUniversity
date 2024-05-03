import './assets/bootstrap/css/bootstrap.min.css';
import Footer from './Footer';
import NavBar from './NavBar';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import { FaPlayCircle } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import { Box, Typography } from '@mui/material';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';


export const AllStudentsTestCase = () => {
    // useEffect(() => {
    //     document.title = 'CODED. | Test Case Results';
    //   }, []);

    const [isLoading, setIsLoading] = useState(true);

    const [labNo, setLabNo] = useState(null);
    const [courseCode, setCourseCode] = useState(null);
    const [labParts, setLabParts] = useState(null);
    const [uploadedLabs, setUploadedLabs] = useState(null);
    const [testCaseResults, setTestCaseResults] = useState(null);
    const [grades, setGrades] = useState(null);
    const [testCases, setTestCases] = useState(null);

    const { courseId, labId } = useParams();
    const jwtToken = localStorage.getItem('jwtToken');

    useEffect(() => {
        const initializeData = async () => {
            try {
                if (!courseId) {
                    console.error('Course ID is not available.');
                    return;
                }
    
                if (!labId) {
                    console.error('Lab ID is not available.');
                    return;
                }
    
                console.log("Course ID:", courseId);
                console.log("Lab ID:", labId);
    
                // Fetch course code
                const fetchCourseCode = async (courseId) => {
                    try {
                        const courseResponse = await axios.get(`http://localhost:8080/course/${courseId}`, {
                            headers: {
                                'Authorization': `Bearer ${jwtToken}`
                            }
                        });
                        console.log("Course:", courseResponse.data.courseCode);
                        return courseResponse.data.courseCode;
                    } catch (error) {
                        console.error('Failed to fetch course: ', error);
                        return null;
                    }
                };
    
                // Fetch lab parts
                const fetchLabParts = async (labId) => {
                    try {
                        const labPartResponse = await axios.get(`http://localhost:8080/lab_part/by_lab_id/${labId}`, {
                            headers: {
                                'Authorization': `Bearer ${jwtToken}`
                            }
                        });
                        console.log("Lab Parts:", labPartResponse.data);
                        return labPartResponse.data;
                    } catch (error) {
                        console.error('Failed to fetch lab parts: ', error);
                        return null;
                    }
                };
    
                // Fetch uploaded lab details
                const fetchUploadedLabs = async (labId) => {
                    try {
                        const uploadedLabResponse = await axios.get(`http://localhost:8080/uploadedLab/lab/${labId}`, {
                            headers: {
                                'Authorization': `Bearer ${jwtToken}`
                            }
                        });
                        console.log("Uploaded Labs:", uploadedLabResponse.data);
                        return uploadedLabResponse.data;
                    } catch (error) {
                        console.error('Failed to fetch uploaded labs: ', error);
                        return null;
                    }
                };

                const fetchTestCases = async () => {
                    try {
                        const jwtToken = localStorage.getItem('jwtToken');
                        const response = await axios.get(`http://localhost:8080/lab_assignment/${labId}/test_cases`, {
                            headers: {
                                'Authorization': `Bearer ${jwtToken}`
                            }
                        });
                        console.log("Fetched test cases:", response.data);
                        return response.data;
                    } catch (error) {
                        console.error('Failed to fetch test cases:', error);
                    }
                };
    
                // Fetch course code, lab parts, and uploaded lab details concurrently
                const [courseCode, labParts, uploadedLabs, tests] = await Promise.all([
                    fetchCourseCode(courseId),
                    fetchLabParts(labId),
                    fetchUploadedLabs(labId),
                    fetchTestCases()
                ]);
    
                // Set fetched data to state
                setCourseCode(courseCode);
                setLabParts(labParts);
                setUploadedLabs(uploadedLabs);
                setTestCases(tests);
    
                // Calculate test case results
                const [labRes, stuRes] = await testCaseResultsTable(labParts, uploadedLabs);

                setTestCaseResults(labRes);
                setGrades(stuRes);
                console.log("Test Results:", labRes);
                console.log("Grades:", grades);
    
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch data: ', error);
                setIsLoading(false);
            }
        };
    
        initializeData();
    }, [courseId, labId, jwtToken]);
    
    const testCaseResultsTable = async (labParts, uploadedLabs) => {
        if (!uploadedLabs || !labParts) return null;
    
        const labResults = {};
        const studentGrades = {};
        const totalTestCases = 0;
    
        for (const u in uploadedLabs) {
            const uLabResults = {};
            let studentCorrect = 0;
    
            if (uploadedLabs[u].uploadedLabPartDTOS.length !== 0) {
                for (const l in labParts) {
                    const labPartTests = {};
                    let found = false;
                    for (const dto in uploadedLabs[u].uploadedLabPartDTOS) {
                        for(let i = 0; i < labParts[l].testCaseIDs.length; i++) {
                            if (uploadedLabs[u].uploadedLabPartDTOS[dto].labPartId === labParts[l].id) {
                                if (
                                    uploadedLabs[u].uploadedLabPartDTOS[dto].testCaseResults &&
                                    uploadedLabs[u].uploadedLabPartDTOS[dto].testCaseResults.hasOwnProperty(labParts[l].testCaseIDs[i])
                                ) {
                                    if (uploadedLabs[u].uploadedLabPartDTOS[dto].testCaseResults[labParts[l].testCaseIDs[i]] === 'successful') 
                                    {
                                        // console.log("success", uploadedLabs[u].uploadedLabPartDTOS[dto].testCaseResult)
                                        labPartTests[labParts[l].testCaseIDs[i]] = 'S';
                                        studentCorrect = studentCorrect + 1;
                                    } 
                                    else if (uploadedLabs[u].uploadedLabPartDTOS[dto].testCaseResults[labParts[l].testCaseIDs[i]] === 'unsuccessful') 
                                    {
                                        labPartTests[labParts[l].testCaseIDs[i]] = 'U';
                                    } else 
                                    {
                                        // console.log("empty", uploadedLabs[u].uploadedLabPartDTOS[dto].testCaseResult[labParts[l].testCaseIDs[i]])
                                        labPartTests[labParts[l].testCaseIDs[i]] = 'X';
                                    }
                                }
                                else 
                                {
                                    labPartTests[labParts[l].testCaseIDs[i]] = 'X';
                                }
                                uLabResults[labParts[l].id] = labPartTests;
                                found = true;
                            }
                            
                            // break;
                            if (!found) {
                                labPartTests[labParts[l].testCaseIDs[i]] = 'X';
                                uLabResults[labParts[l].id] = labPartTests;
                            }
                            // totalTestCases++;
                        }
                    }
                    
                }
            } else {
                for (const l in labParts) {
                    const labPartTests = {};
                    for(let i = 0; i < labParts[l].testCaseIDs.length; i++) {
                        labPartTests[labParts[l].testCaseIDs[i]] = 'Z';
                        uLabResults[labParts[l].id] = labPartTests;
                    }
                }
            }
            labResults[uploadedLabs[u].id] = uLabResults;
            studentGrades[uploadedLabs[u].id] = studentCorrect + "/" + totalTestCases; 
        }
        return [labResults, studentGrades];
    };
    
    const tableHeaderCells = [];
    tableHeaderCells.push(
        <td key={`empty`}></td>
    );
    for (const labPart in labParts) {

        for (let i = 1; i <= labParts[labPart].testCaseIDs.length; i++) {
            tableHeaderCells.push(
                <td key={`${labPart.labNo}-test-case-${i}`}>
                    Test Case {i}
                </td>
            );
        }
    }
    tableHeaderCells.push(
        <td key={`empty`}></td>
    );
        
    useEffect(() => {
        applyTextGradient('headerText', ['#2B0AFF', '#C307F9', '#EA38C1', '#FF8CAF', '#FB8F8B']);
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

    const OneTestCaseButton = ({ id, buttonText, testCaseId, studentId }) => {
        const [isHovered, setIsHovered] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
    
        const handleMouseEnter = () => {
            setIsHovered(true);
        };
    
        const handleMouseLeave = () => {
            setIsHovered(false);
        };
    
        const handleTestCaseRun = (testCaseId, studentId) => {
            setIsLoading(true);
            const tcData = new FormData();
            tcData.append('labPartId', testCaseId);
            tcData.append('studentId', studentId);

            fetch(`http://localhost:8080/testCaseRunner/oneTestCase?testCaseId=${testCaseId}&studentId=${studentId}`, {
                method: "POST",
                body: tcData,
                headers : {
                    'Authorization': `Bearer ${jwtToken}`
                }
            })
            .then((response => {
                if (!response.ok) {
                    throw new Error('Failed to upload file');
                }
                return response.json();
            }))
            .then((data) => {
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error testing:", error);
            })
        };
    
        return (
            <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleTestCaseRun(testCaseId, studentId)}
                style={{
                    width: '100%',
                    height: '100%',
                    padding: 0,
                    margin: 0,
                    border: 'none',
                    background: isHovered ? '#f0f0f0' : 'transparent'
                }}
            >
                {isLoading ? <CircularProgress color='inherit' /> : (isHovered ? <FaPlayCircle color='#1d0042'/> : buttonText)}
            </button>
        );
    };

    const OneStudentTestCasesButton = ({ buttonText }) => {
        const [isHovered, setIsHovered] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
    
        const handleMouseEnter = () => {
            setIsHovered(true);
        };
    
        const handleMouseLeave = () => {
            setIsHovered(false);
        };
    
        const handleTestCaseRun = () => {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        };
    
        return (
            <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleTestCaseRun}
                style={{
                    width: '100%',
                    height: '100%',
                    padding: 0,
                    margin: 0,
                    border: 'none',
                    background: isHovered ? '#f0f0f0' : 'transparent'
                }}
            >
                {isLoading ? <CircularProgress color='inherit'/> : (isHovered ? <FaPlayCircle color='#1d0042'/> : buttonText)}
            </button>
        );
    };

    const AllStudentsOneTesCaseButton = () => {
        const [isHovered, setIsHovered] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
    
        const handleMouseEnter = () => {
            setIsHovered(true);
        };
    
        const handleMouseLeave = () => {
            setIsHovered(false);
        };
    
        const handleTestCaseRun = () => {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        };
    
        return (
            <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleTestCaseRun}
                style={{
                    width: '100%',
                    height: '100%',
                    padding: 0,
                    margin: 0,
                    border: 'none',
                    background: isHovered ? '#f0f0f0' : 'transparent'
                }}
            >
                    {isLoading ? <CircularProgress color='inherit'/> : <FaPlayCircle color='#1d0042'/>}
            </button>
        );
    };

    const TestCaseModalButton = ({buttonText}) => {
        const [isOpen, setIsOpen] = useState(false);

        const handleClick = () => {
            setIsOpen(true);
        };

        const handleClose = () => {
            setIsOpen(false);
        }

        return (
            <div>
                <button
                    onClick={handleClick}
                    style={{
                        borderRadius: '13px',
                        borderColor: 'transparent'
                    }}
                    >
                    {buttonText}
                </button>

                <Modal
                    open={isOpen}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                 >
                    <Box style = {{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            border: '2px solid #f0f0f0',
                            borderRadius: '13px',
                            boxShadow: 24,
                            p: '2rem',
                            '@media (max-width: 768px)': { 
                                width: '90%',
                                maxWidth: '90%',
                                p: '1rem',
                            },
                        }}>                        
                        <div>
                            <button
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: 'transparent',
                                    borderColor: 'transparent'
                                }}
                                onClick={handleClose}>
                                <RxCross2/>
                            </button>
                        </div>

                        <div>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Text in a modal
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                            </Typography>
                        </div>
                    </Box>
                </Modal>
            </div>
        );

    };

    const [allTestsButtonHovered, setAllTestsButtonHovered] = useState(false);
    const [allTestsButtonText, setAllTestsButtonText] = useState('Re-Run All Test Cases')
    const handleAllTestsClick = () => {
        setAllTestsButtonText(<CircularProgress color='inherit'/>);

        setTimeout(() => {
            setAllTestsButtonText('Re-Run All Test Cases');
        }, 2000);
    
        setAllTestsButtonHovered(false);
    };

    if (isLoading) {
        return <div className="App">Loading...</div>;
    } else {
        return(
            <>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
                />
                <title>CODED | Dashboard</title>
                <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Raleway:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&display=swap"
                />

                <NavBar/>

                <section className="py-4 py-md-5 my-5">
                    <header>
                        <div className="container pt-4 pt-l-5">
                            <div className="row">
                                <div className="col-12 col-md-8">
                                    <div className="all-courses-header">
                                        <h2 className="display-6 fw-bold mb-3" style={{ color: 'black' }}>
                                            <span id="headerText">
                                                <strong>{courseCode} Lab {labNo} Test Case Results</strong>
                                            </span>
                                        </h2>
                                </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div>
                        <div className="container pt-4 pt-xl-5">
                            <hr />
                            <div className="row pt-5">
                                <div className="col-md-8 col-lg-9 text-center text-md-start mx-auto">
                                    <div
                                        className="table-responsive text-center d-lg-flex"
                                        style={{ boxShadow: "0px 0px 14px 2px #bec1de", borderRadius: '13px' }}
                                    >
                                        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }} className="table table-striped-columns table-hover">
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: 'center', color: '#1d0042' }}>Name</th>
                                                        {Object.keys(labParts).map((labPartIndex) => (
                                                            <th key={labPartIndex} style={{ textAlign: 'center' }} colSpan={labParts[labPartIndex].testCaseIDs.length}>
                                                                Part {labParts[labPartIndex].partNo}
                                                            </th>
                                                        ))}
                                                    <th>Result</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr>
                                                    {tableHeaderCells.map((text, index) => (
                                                        <td key={index}>
                                                            {text.key === 'empty' ? '' : <TestCaseModalButton buttonText={text} />}
                                                        </td>
                                                    ))}
                                                </tr>
                                                
                                                {Object.keys(uploadedLabs).map(uploadedLabIndex => (
                                                    <tr key={uploadedLabIndex}>
                                                        <td>{uploadedLabs[uploadedLabIndex].studentFullName}</td>

                                                        {Object.keys(labParts).map(labPartIndex => (
                                                            <React.Fragment key={labPartIndex}>
                                                                {labParts[labPartIndex].testCaseIDs.map((testCaseId, index) => (
                                                                    <td key={`${uploadedLabIndex}-${labPartIndex}-${index}`}>
                                                                        <OneTestCaseButton
                                                                            id={`button-${uploadedLabs[uploadedLabIndex].id}-${labParts[labPartIndex].id}`}
                                                                            buttonText={
                                                                                testCaseResults[uploadedLabs[uploadedLabIndex].id][labParts[labPartIndex].id][testCaseId] === 'S' ? (
                                                                                    <IoMdCheckmarkCircleOutline color='green' /> 
                                                                                ) : (
                                                                                    testCaseResults[uploadedLabs[uploadedLabIndex].id][labParts[labPartIndex].id][testCaseId] === 'U' ? (
                                                                                        <IoMdCloseCircleOutline color='red' />
                                                                                    ) : (
                                                                                            <IoWarningOutline color='#cfb704' />
                                                                                    )
                                                                                ) 
                                                                            }
                                                                            testCaseId={testCaseId}
                                                                            studentId={uploadedLabs[uploadedLabIndex].studentId}
                                                                        />
                                                                    </td>
                                                                ))}
                                                            </React.Fragment>
                                                        ))}

                                                        <td style={{ textAlign: 'center' }}>
                                                            <OneStudentTestCasesButton 
                                                                buttonText={grades[uploadedLabs[uploadedLabIndex].id]}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}                                              

                                                <tr>
                                                    {tableHeaderCells.map((text, index) => (
                                                        <td>
                                                            {tableHeaderCells[index].key === 'empty' ? '' : <AllStudentsOneTesCaseButton />}    
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="mt-3 text-center"> {/* Add margin top with Bootstrap spacing classes */}
                                    <div className="row justify-content-center align-items-center"> {/* Center both horizontally and vertically */}
                                        <div className="col-12 col-md-6"> {/* Adjust column size */}
                                            <button
                                                className="btn btn-primary shadow"
                                                role="button"
                                                onMouseEnter={() => setAllTestsButtonHovered(true)}
                                                onMouseLeave={() => setAllTestsButtonHovered(false)}
                                                onClick={handleAllTestsClick}
                                                style={{
                                                    background: allTestsButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                                    color: allTestsButtonHovered ? "#ffffff" : "#a50bf6",
                                                    boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                                    borderRadius: 13,
                                                    borderWidth: 3,
                                                    borderColor: allTestsButtonHovered ? "#ffffff" : "#a50bf6",
                                                    width: '100%',
                                                    maxWidth: '250px', 
                                                    margin: 'auto' 
                                                }}
                                            >
                                                {allTestsButtonText}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )
    }
}