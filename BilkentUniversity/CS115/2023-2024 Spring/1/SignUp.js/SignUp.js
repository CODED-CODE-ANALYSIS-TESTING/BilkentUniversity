import './assets/bootstrap/css/bootstrap.min.css';
import logo from "./assets/img/chatbot/logo.png";
import Footer from './Footer';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const SignUp = () => {
    const navigate= useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        password_repeat: '',
        university_id: '',
        school_id: '',
        department: '',
    });
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [universities, setUniversities] = useState([]);
    const [errors, setErrors] = useState({});
    const [buttonHovered, setButtonHovered] = useState(false);
    const [accountButtonHovered, setAccountButtonHovered] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const history = useNavigate();
    // const handleUniversityChange = (e) => {
    //     const university_id = e.target.value;
    //     setSelectedUniversity(university_id);
    //     setFormData(prev => ({ ...prev, university_id: university_id }));

       
    // };
    const handleUniversityChange = async (e) => {
        const university_id = e.target.value;
        setSelectedUniversity(university_id);
        setFormData(prev => ({ ...prev, university_id: university_id }));
    
        try {
            // Adjust this URL to match your actual API endpoint
            const response = await fetch(`http://localhost:8080/university/${university_id}/departments`);
            if (response.ok) {
                const fetchedDepartments = await response.json();
                setDepartments(fetchedDepartments);
            } else {
                // Handle response errors (e.g., university not found, server error)
                console.error('Failed to fetch departments handle uni change');
                setDepartments([]); // Reset departments on error
            }
        } catch (error) {
            // Handle network errors
            console.error('Network error when fetching departments:', error);
            setDepartments([]); // Reset departments on network error
        }
    };
    
    
    const handleDepartmentChange = (e) => {
        const selectedDepartmentId = e.target.value;
        setSelectedDepartment(selectedDepartmentId); // This updates the local state for the selected department ID
        // Here, ensure the form state is updated to match what your backend expects
        setFormData(prev => ({ ...prev, department: selectedDepartmentId })); // Assuming backend expects "department"
        console.log('Selected department ID:', selectedDepartmentId);
    };
    
    const handleSignUp = (e) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            alert('Passwords do not match');
            return;
        }

        // Send data to backend or store it in context for later use
        // For simplicity, let's just navigate to the second page
        history(`/signupcont?self=${email}&password=${password}`);
    };
    


    useEffect(() => {
        // Function to fetch universities
        const fetchUniversities = async () => {
            try {
                const response = await axios.get("http://localhost:8080/university"); 
                console.log("Fetched Universities:", response.data); // Log the fetched data
                setUniversities(response.data); 
            } catch (error) {
                console.error('Failed to fetch universities:', error);
            }
        };

        fetchUniversities();
    }, []); // this effect runs once on component mount


    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
    
        try {
            //  POST request with fetch API
            const response = await fetch("http://localhost:8080/auth/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            console.log("Response status:", response.status);
            response.clone().json().then(data => console.log("Response body:", data));
    
            if (response.ok) {
                const data = await response.json();
                console.log('User created:', data);
                console.log("uni id is " + formData.university_id);
                console.log("dept is " + formData.department);
                console.log("surname " + formData.surname);

                const token = data.accessToken; // Ensure this matches the actual token key in your response
                localStorage.setItem('jwtToken', token); // Store the token in local storage
                console.log('Stored JWT token:', localStorage.getItem('jwtToken')); // Verify it's correctly stored
                console.log("valid"); // Verify it's correctly stored

                const decodedToken = jwtDecode(token);
                localStorage.setItem('roles', JSON.stringify(decodedToken.roles)); // Storing the user roles
                const userId = decodedToken.userId;
                localStorage.setItem('userId', JSON.stringify(userId)); // Storing the user roles
                console.log('Stored roles:', localStorage.getItem('roles')); // Printing stored roles
                console.log('Stored userId from token:', userId); // Printing stored roles

                
                // Parse the stored roles back into an array
                const roles = JSON.parse(localStorage.getItem('roles') || '[]');
                
                // for instrcutor dashboard access
                const isInstructor = roles.some(role => ['ROLE_INSTRUCTOR'].includes(role));
                
                if (isInstructor) {
                    navigate("/dashboardInst"); 
                }

            } 
            else {
                // Handle errors (e.g., display error messages)
 

                console.error('Failed to create user');
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle network errors or other exceptions
        }
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target; // Destructure name and value from event target
        setFormData(prevState => ({
            ...prevState, // Spread the previous state
            [name]: value // Update the field that changed
        }));
    };

    useEffect(() => {
        applyTextGradient('signupText', ['#2B0AFF', '#C307F9', '#EA38C1', '#FF8CAF', '#FB8F8B']);
    }, []);

    function applyTextGradient(elementId, colors) {
        var element = document.getElementById(elementId);
        if (element) {
            element.style.background = `linear-gradient(to right, ${colors.join(', ')})`;
            element.style.webkitBackgroundClip = 'text';
            element.style.color = 'transparent';
            element.style.display = 'inline-block';
        }
    };


    return (
        
        
        <>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
            />
            <title>Sign up - Brand</title>
            <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Raleway:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&display=swap"
            />
            <nav
                className="navbar navbar-expand-md fixed-top navbar-shrink py-3 navbar-light"
                id="mainNav"
                style={{
                    background: "#ffffff",
                    color: "#0077ff",
                    boxShadow: "0px 0px 13px 2px #bec1de"
                }}
            >
                <div className="container" >
                    <img
                        src={logo}
                        width={51}
                        height={51}
                        style={{ paddingRight: 0, marginRight: 6 }}
                    />
                    <a className="navbar-brand d-flex align-items-center" href="/">
                        <span style={{ color: "#1d0042", borderColor: "#FFF5E4" }}>CODED.</span>
                    </a>
                    <button
                        data-bs-toggle="collapse"
                        className="navbar-toggler"
                        data-bs-target="#navcol-1"
                    >
                        <span className="visually-hidden">Toggle navigation</span>
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navcol-1">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    href="/"
                                    style={{ color: "#1d0042" }}
                                >
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="#features"
                                    style={{ color: "#1d0042" }}
                                >
                                    Features
                                </a>
                            </li>
                            <li className="nav-item" />
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="contacts.html"
                                    style={{ color: "#1d0042" }}
                                >
                                    Contacts
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="ForgatPassword"
                                    style={{ color: "#1d0042" }}
                                >
                                    Forgotten Password
                                </a>
                            </li>
                        </ul>
                        <a
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
                                borderColor: buttonHovered ? "#ffffff" : "#a50bf6"
                            }}
                            href="Login"
                        >
                            Login
                        </a>
                    </div>
                </div>
            </nav>
            <section className="py-4 py-md-5 my-5">
                <div className="container py-md-5">
                    <div className="row">
                        <div className="col-md-6 text-center">
                            <img
                                className="img-fluid w-100"
                                src="../assets/img/illustrations/register.svg"

                            />
                        </div>
                        <div className="col-md-5 col-xl-4 text-center text-md-start">
                            <h2 className="display-6 fw-bold mb-5">
                                <span id="signupText">
                                    <strong>Sign up</strong>
                                </span>
                            </h2>
                            <form method="post" data-bs-theme="light" onSubmit={handleSubmit}>
                               <div className="mb-3">
                                    <input
                                        className="shadow-sm form-control"
                                        type="name"
                                        name="name"
                                        placeholder="Name"
                                        //value={name}
                                        //onChange={(e) => setName(e.target.value)}
                                        value={formData.name}
                                        onChange={handleChange}
                                        style={{ borderRadius: 13 }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        className="shadow-sm form-control"
                                        type="surname"
                                        name="surname"
                                        placeholder="Surname"
                                        //value={surname}
                                        value={formData.surname}
                                        //onChange={(e) => setSurname(e.target.value)}
                                        onChange={handleChange}
                                        style={{ borderRadius: 13 }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        className="shadow-sm form-control"
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        //value={self}
                                        //onChange={(e) => setEmail(e.target.value)}
                                        value={formData.email}
                                        onChange={handleChange}
                                        style={{ borderRadius: 13 }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        className="shadow-sm form-control"
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        //value={password}
                                        //onChange={(e) => setPassword(e.target.value)}
                                        value={formData.password}
                                        onChange={handleChange}
                                        style={{ borderRadius: 13 }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        className="shadow-sm form-control"
                                        type="password"
                                        name="password_repeat"
                                        placeholder="Repeat Password"
                                        //value={repeatPassword}
                                        //onChange={(e) => setRepeatPassword(e.target.value)}
                                        value={formData.repeatPassword}
                                        onChange={handleChange}
                                        style={{ borderRadius: 13 }}
                                    />
                                </div>
                                <div className="mb-3">
                                <select
                                        className="shadow form-control"
                                        id="university-select"
                                        name="university_id"// sadece university desek olmaz mı?
                                        value={formData.university_id} 
                                        onChange={handleUniversityChange}
                                        style={{ borderRadius: '13px' }}
                                    >
                                        <option value="">Select a University</option>
                                        {universities.map((uni) => (
                                            <option key={uni.id} value={uni.id}>{uni.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                <select
                                        className="shadow form-control"
                                        id="department-select"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleDepartmentChange}
                                        style={{ borderRadius: '13px' }}
                                    >
                                        <option value="">Select a Department</option>
                                        {departments.map((department) => (
                                            <option key={department.id} value={department.id}>{department.name}</option>
                                        ))}
                                    </select>
                                </div>
                              

                                <div className="mb-3">
                                    <input
                                        className="w-100 shadow-sm form-control"
                                        value={formData.schoolId}
                                        onChange={handleChange}
                                        type="text"
                                        name="school_id"
                                        placeholder="School ID"
                                        style={{ borderRadius: 13 }}
                                    />
                                </div>
                                

                                <div className="mb-5">
                                    <button
                                        onClick={handleSubmit}
                                        type="submit"
                                        className="btn btn-primary shadow"
                                        role="button"
                                        style={{
                                            background: accountButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                            color: accountButtonHovered ? "#ffffff" : "#a50bf6",
                                            boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                            borderRadius: 13,
                                            borderWidth: 3,
                                            borderColor: accountButtonHovered ? "var(--bs-navbar-active-color)" : "#a50bf6"
                                        }}
                                        
                                        onMouseEnter={() => setAccountButtonHovered(true)}
                                        onMouseLeave={() => setAccountButtonHovered(false)}

                                    >
                                        Create account
                                    </button>
                                </div>
                            </form>
                            <p className="text-muted">
                                Have an account?{" "}
                                <a href="login">
                                    Log in&nbsp;
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="icon icon-tabler icon-tabler-arrow-narrow-right"
                                    >
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <line x1={5} y1={12} x2={19} y2={12} />
                                        <line x1={15} y1={16} x2={19} y2={12} />
                                        <line x1={15} y1={8} x2={19} y2={12} />
                                    </svg>
                                </a>
                                &nbsp;
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default SignUp;
