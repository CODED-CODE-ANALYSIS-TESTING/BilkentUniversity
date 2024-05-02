import './assets/bootstrap/css/bootstrap.min.css';
import './assets/bootstrap/css/bootstrap.min.css';
import logo from "./assets/img/chatbot/logo.png";
import Footer from './Footer';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [buttonHovered, setButtonHovered] = useState(false);
    const [signupButtonHovered, setSignupButtonHovered] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
   
    // const handleLogin = async (e) => {
    //     e.preventDefault();

    //     try {
    //         // Send a POST request to your backend API
    //         const response = await fetch("http://localhost:8080/auth/login", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ self, password }),
    //         });
    
    //         if (response.ok) {
    //             // Login successful, get the JWT token and userId from the response
    //             const data = await response.json();
    //             const token = data.token;
    //             const userId = data.userId; // Replace 'userId' with the actual key in your response JSON
    
    //             // Store the token and userId in local storage for subsequent authenticated requests
    //             localStorage.setItem("token", token);
    //             localStorage.setItem("userId", userId);
    
    //             // Determine the route based on the self
    //             if (self.includes("ug")) {
    //                 // Email contains "ug", redirect to student dashboard
    //                 window.location.replace("/dashboardStu");
    //             } else {
    //                 // Email does not contain "ug", redirect to instructor dashboard
    //                 window.location.replace("/dashboardInst");
    //             }
    //         } else {
    //             // Login failed, display an error message
    //             setError("Invalid credentials. Please try again.");
    //         } } catch (error) {
    //             console.error("Error logging in:", error);
    //         }
                
            
    //     };
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Send a POST request to your backend API
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            console.log("Response status:", response.status);
            response.clone().json().then(data => console.log("Response body:", data));

    
            if (response.ok) {
                // Login successful, get the JWT token from the response
                const data = await response.json();
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
                                
                // check if the user has the student role
                const isStudent = roles.includes('ROLE_STUDENT');
                const isTA = roles.includes('ROLE_TA');
                const isInstructor = roles.includes('ROLE_INSTRUCTOR');
                const isTutor = roles.includes('ROLE_TUTOR');

                
                if (isInstructor) {
                    navigate("/dashboardInst"); 
                } else if (isStudent) {
                    navigate("/dashboardStu"); 
                    
                } else if (isTA) {
                    navigate("/tadashboard"); 
                    
                }else if (isTutor) {
                    navigate("/tadashboard"); 
                    
                }else {
                    console.log('User role not recognized.');
                    //  error page maybe
                }
                
    
            } else {

                // Login failed, display an error message based on response
                const errorData = await response.json(); // Assuming backend sends readable error message
                setError(errorData.message || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setError("An error occurred. Please try again.");
        }
    };

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

    return (
        <>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
            />
            <title>Log in - Brand</title>
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
                        src= {logo}
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
                                    href="ForgetPassword"
                                    style={{ color: "#1d0042" }}
                                >
                                    Forgotten Password
                                </a>
                            </li>
                        </ul>
                        <a
                            className="btn btn-primary shadow"
                            role="button"
                            onMouseEnter={() => setSignupButtonHovered(true)}
                            onMouseLeave={() => setSignupButtonHovered(false)}
                            style={{
                                background: signupButtonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                color: signupButtonHovered ? "#ffffff" : "#a50bf6",
                                boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                borderRadius: 13,
                                borderWidth: 3,
                                borderColor: signupButtonHovered ? "#ffffff" : "#a50bf6"
                            }}
                            href="Signup"
                        >
                            Signup
                        </a>
                    </div>
                </div>
            </nav>
            <section className="py-4 py-md-5 my-5" style={{ background: "#ffffff" }}>
                <div className="container py-md-5">
                    <div className="row">
                        <div className="col-md-6 text-center">
                            <img
                                className="img-fluid"
                                src="assets/img/illustrations/startup.svg"
                                alt="Logo"
                                width="600"
                                height="400"
                            />
                        </div>
                        <div className="col-md-5 col-xl-4 text-center text-md-start">
                            <h2 className="display-6 fw-bold mb-5" style={{ color: "#3c76ad" }}>
                                <span className="underline pb-1" id="headerText">
                                    <strong>Login</strong>
                                    <br />
                                </span>
                            </h2>
                            <form method="post" data-bs-theme="light">
                                <div className="mb-3">
                                    <input
                                        className="shadow form-control"
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        style={{ borderRadius: 13 }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        className="shadow form-control"
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        style={{ borderRadius: 13 }}
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                {error && <div className="text-danger mb-3">{error}</div>}
                                <div className="mb-5">
                                    <button
                                        className="btn btn-primary shadow"
                                        role="button"
                                        onMouseEnter={() => setButtonHovered(true)}
                                        onMouseLeave={() => setButtonHovered(false)}
                                        onClick={handleLogin}
                                        style={{
                                            background: buttonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                            color: buttonHovered ? "#ffffff" : "#a50bf6",
                                            boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                            borderRadius: 13,
                                            borderWidth: 3,
                                            borderColor: buttonHovered ? "var(--bs-navbar-active-color)" : "#a50bf6"
                                        }}
                                    >
                                        Log in
                                    </button>
                                </div>
                            </form>
                            <p className="text-muted">
                                <a href="ForgetPassword">Forgot your password?</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer></Footer>
        </>
    );
}

export default Login;