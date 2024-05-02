import './assets/bootstrap/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import NavBar from './NavBar';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';


export const TestCases = () => {

    const [testCases, setTestCases] = useState([]);
    const [labPartIds, setLabPartIds] = useState(null);

    const jwtToken = localStorage.getItem('jwtToken');

    const { labId } = useParams();

    const [buttonHovered, setButtonHovered] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [labParts, setLabParts] = useState([]);

    useEffect(() => {
        const fetchLabParts = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                const response = await axios.get(`http://localhost:8080/lab_assignment/${labId}/lab_parts`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });
                console.log("Fetched lab parts:", response.data);
                setLabParts(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch lab parts:', error);
            }
        };
        fetchLabParts();
    }, [labId]);

    useEffect(() => {
        const fetchTestCases = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                const response = await axios.get(`http://localhost:8080/lab_assignment/${labId}/test_cases`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });
                console.log("Fetched test cases:", response.data);
                setTestCases(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch test cases:', error);
            }
        };
        fetchTestCases();
    }, [labId]);


    useEffect(() => {
        applyTextGradient(['labText', 'submissionText'], [
            [[43, 10, 255], [195, 7, 249], [234, 56, 193], [255, 140, 175], [251, 143, 139]],
            [[43, 10, 255], [195, 7, 249], [234, 56, 193], [255, 140, 175], [251, 143, 139]],
        ]);
    }, []);


    // const fetchLabParts = async ( labId) => {
    //     try {
    //         const jwtToken = localStorage.getItem('jwtToken'); // Retrieve the stored JWT token
    //         const response = await axios.get(`http://localhost:8080/lab_assignment/${labId}/lab_parts`, {
    //             headers: {
    //                 'Authorization': `Bearer ${jwtToken}` // Use JWT token for authorization
    //             }
    //         });
    //         console.log("Fetched lab parts:", response.data);
    //         console.log( "Test case ids: ", response.data[0].testCaseIDs)
    //         setLabParts(response.data); // Update the lab parts state with fetched data
    //         setIsLoading(false);
    //     } catch (error) {
    //         console.error('Failed to fetch lab parts:', error);
    //     }
    // };
    //
    // useEffect(() => {
    //     fetchLabParts( labId);
    // }, [labId]);

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

    const downloadFile = (fileName) => {
        window.location.href = `http://localhost:3000/api/files/download?fileName=${fileName}`;
    };

    const navigate = useNavigate();

    const handleTestCase = () => {
        // Redirect to the LandingPage route
        navigate(`/AddTestCase/${labId}`);
    };

    const closeModal = () => {
        // Close the modal
        setShowModal(false);
        console.log("showModal state:", showModal); // Add this line
    };


    if (isLoading) {
        return <div className="App">Loading...</div>;
    } else {
        return (

            <>
                <meta charSet="utf-8"/>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
                />
                <title>Home - Brand</title>
                <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css"/>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Raleway:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&display=swap"
                />
                <link rel="stylesheet" href="assets/css/Drag-Drop-File-Input-Upload.css"/>
                <NavBar/>
                <header className="pt-5">
                    <div className="container pt-4 pt-xl-5">
                        <div className="row pt-5">
                            <div className="col-md-8 text-center text-md-start mx-auto">
                                <div className="text-center">
                                    <h1 className="display-4 fw-bold mb-5">
                                        <span id="labText">Lab 1 &nbsp;</span>
                                        Test Cases
                                    </h1>
                                </div>
                                <div className="text-center position-relative"/>
                            </div>
                        </div>
                    </div>
                </header>
                <header>

                    <div className="container pt-4 pt-xl-5">
                        <hr/>
                        {labParts.map((labPart, index) => (
                            <div key={index} className="text-center mb-4"> {/* Added mb-4 class for margin bottom */}
                                <h3>Part {labPart.partNo}</h3>
                                <div className="table-responsive d-lg-flex mx-auto" style={{
                                    maxWidth: '800px',
                                    boxShadow: "0px 0px 14px 2px #bec1de",
                                    borderRadius: '13px',
                                    padding: '15px'
                                }}> {/* Added padding */}
                                    <table className="table table-striped-columns table-hover mx-auto">
                                        <thead>
                                        <tr>
                                            <th className="text-center">Test Case</th>
                                            <th className="text-center">Inputs</th>
                                            <th className="text-center">Outputs</th>
                                            <th></th>
                                            {/* Empty cell for Edit column */}
                                            <th></th>
                                            {/* Empty cell for Delete column */}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {labPart.testCaseIDs.map((testCaseId, idx) => {
                                            const testCase = testCases.find(tc => tc.id === testCaseId);
                                            return (
                                                <tr key={idx}>
                                                    <td>{testCase ? testCase.id : '-'}</td>
                                                    <td>{testCase ? testCase.input : '-'}</td>
                                                    <td>{testCase ? testCase.output : '-'}</td>
                                                    <td>
                                                        {testCase && (
                                                            <a href={`edit/${testCase.id}`}>Edit</a>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {testCase && (
                                                            <a href={`delete/${testCase.id}`}>Delete</a>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>

                </header>
                <div className="container d-flex justify-content-center align-items-center">
                    <div className="row pt-5">
                        <div className="col-md-8 text-center text-md-start mx-auto">
                            <div className="text-center">
                                <button
                                    className="btn btn-primary shadow"
                                    role="button"
                                    onMouseEnter={() => setButtonHovered(true)}
                                    onMouseLeave={() => setButtonHovered(false)}
                                    style={{
                                        background: buttonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                        color: buttonHovered ? "#ffffff" : "#a50bf6",
                                        boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                        borderRadius: 13,
                                        borderWidth: 3,
                                        marginBottom: 40,
                                        marginTop: 15,
                                        borderColor: buttonHovered ? "var(--bs-navbar-active-color)" : "#a50bf6",
                                        width: 200
                                    }}
                                    onClick={handleTestCase} // Show the modal when the button is clicked
                                >
                                    Add New Test Case
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>&times;</span>
                            <h2>Add New Test Case</h2>
                            {/* Your form fields for adding test case */}
                        </div>
                    </div>
                )}

                <Footer/>
            </>
        );
    }
};
