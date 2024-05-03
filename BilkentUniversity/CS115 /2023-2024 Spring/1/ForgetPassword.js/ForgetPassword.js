import './assets/bootstrap/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import logo from "./assets/img/chatbot/logo.png";
import Footer from './Footer';
import {useNavigate} from "react-router-dom";

export const ForgetPassword = () => {
    const [buttonHovered, setButtonHovered] = useState(false);
    const [signupButtonHovered, setSignupButtonHovered] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        applyTextGradient('passwordText', ['#2B0AFF', '#C307F9', '#EA38C1', '#FF8CAF', '#FB8F8B']);
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const idResponse = await fetch(`http://ec2-34-227-46-113.compute-1.amazonaws.com:8001/getStudentId?email=${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (idResponse.ok) {
                const studentId = await idResponse.text();
                console.log('Retrieved Student ID:', studentId);

                const passwordResponse = await fetch('http://ec2-34-227-46-113.compute-1.amazonaws.com:8001/sendResetPasswordEmail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                     body: JSON.stringify({ student_id: studentId }),
                });

                if (passwordResponse.ok) {
                    console.log('Password reset email sent successfully');
                    navigate(`/ForgetPasswordAuth/email/${email}`)
                } else {
                    console.error('Failed to send password reset email');

                }
            } else {
                console.error('Failed to retrieve Student ID');

            }
        } catch (error) {
            console.error('Error in processing your request:', error);
        }
    };
    return (
        <>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
            />
            <title>Forgotten Password - Brand</title>
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
                                    className="nav-link"
                                    href="/"
                                    style={{ color: "#1d0042" }}
                                >
                                    Home
                                </a>
                            </li>
                            <li className="nav-item" />
                            <li className="nav-item">
                                <a
                                    className="nav-link active"
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
            <section className="py-4 py-md-5 mt-5" style={{ background: "#ffffff" }}>
                <div className="container py-md-5">
                    <div className="row d-flex align-items-center">
                        <div className="col-md-6 text-center">
                            <img
                                className="img-fluid w-100"
                                src="assets/img/illustrations/desk.svg"
                            />
                        </div>
                        <div className="col-md-5 col-xl-4 text-center text-md-start">
                            <h2 className="display-6 fw-bold mb-4" style={{color: "#3c76ad"}}>
                                Forgot your{" "}
                                <span id="passwordText" style={{color: "#3c76ad"}}>
                                    password?
                                </span>
                            </h2>
                            <p className="text-muted">
                                Enter the email address associated with your account, and we'll send you a one-time
                                verification code (OTP).
                            </p>
                            <form method="post" data-bs-theme="light">
                                <div className="mb-3">
                                    <input
                                        className="shadow form-control"
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        style={{borderRadius: 13}}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-5">
                                    <button
                                        className="btn btn-primary shadow"
                                        role="button"
                                        onMouseEnter={() => setButtonHovered(true)}
                                        onMouseLeave={() => setButtonHovered(false)}
                                        onClick={handleSubmit}
                                        style={{
                                            background: buttonHovered ? `linear-gradient(to right, #C307F9, #EA38C1,  #FB8F8B)` : "#ffffff",
                                            color: buttonHovered ? "#ffffff" : "#a50bf6",
                                            boxShadow: "0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px",
                                            borderRadius: 13,
                                            borderWidth: 3,
                                            borderColor: buttonHovered ? "var(--bs-navbar-active-color)" : "#a50bf6"
                                        }}
                                    >
                                        Send OTP Code
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </>

    );
}

export default ForgetPassword;