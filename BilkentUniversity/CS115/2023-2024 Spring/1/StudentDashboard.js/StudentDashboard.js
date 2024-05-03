import './assets/bootstrap/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import NavBar from './NavBar';
import axios from 'axios';


export const StudentDashboard = () => {
    const [enrollButtonHovered, setEnrollButtonHovered] = useState(false);
    const [initialBorderStyle, setInitialBorderStyle] = useState('1px solid rgba(0, 0, 0, 0.125)');
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    const handleCourseClick = (courseId, courseCode) => {
        const trimmedCourseCode = courseCode.trim();

        localStorage.setItem("courseCode", trimmedCourseCode);
        console.log("Course code: ",trimmedCourseCode);
        navigate(`/course/${courseId}/labs`);
      };

    useEffect(() => {
        const fetchCourses = async () => {
            const userId = localStorage.getItem('userId'); 
            const jwtToken = localStorage.getItem('jwtToken'); // Retrieve the stored JWT token
    
            if (!userId) {
                console.error('Student ID is not available.');
                return;
            }
        
            try {
                const response = await axios.get(`http://localhost:8080/course/student/${userId}/courses`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });
                console.log("Fetched Courses for Student:", response.data);
                setCourses(response.data);
               
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            }
        };
        
        fetchCourses();
    }, []);

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

    return (
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

            <NavBar  activeSection='dashboard' />

            <section className="py-4 py-md-5 my-5">
                <div className="container py-md-3">
                    <div className="all-courses-header">
                        <h2 className="display-6 fw-bold mb-3" style={{ color: "#3c76ad", textAlign: "left" }}>
                            <span id="headerText">
                                <strong>Courses</strong>
                            </span>                       
                        </h2>
                    </div>

                    <div className="container py-md-3">
                    <div  className="row justify-content-center align-items-center">
                        {courses.map((course) => (
                            <div className="col-md-4" key={course.id}>
                                <div
                                onClick={() => handleCourseClick(course.id, course.courseCode)}
                                className="card shadow-sm"
                                style={{
                                    borderRadius: '13px',
                                    marginBottom: '1rem',
                                    width: '100%',
                                    height: '10rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'border 0.3s ease',
                                    border: initialBorderStyle,
                                    boxShadow: '0px 0px 8px 7px var(--bs-navbar-active-color), 0px 0px'
                                }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = '#c307f9';
                                        e.currentTarget.style.borderRadius = '13px';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.border = initialBorderStyle;
                                    }}
                                    >
                                    <div className="card-body text-center">
                                        <h4 className='card-code'>
                                        <strong>{course.code}</strong>
                                        </h4>
                                        <h5 className="card-title"> {course.courseCode} </h5>
                                        <h5 className="card-title"> {course.courseName}</h5>
                                        {/* <h6 className="text-muted card-subtitle mb-2">Section: {course.section}</h6> */}
                                        {course.instructors?.map(instructor => instructor.name).join(', ')}

                                        <p className="card-text">{course.instructors}</p>
                                    </div>
                                    </div>
                            </div>
                        ))}
                    </div>
                    </div>
                </div>
            </section>
        <Footer />
        </>
    )
}