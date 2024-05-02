import React from 'react';
import './footer.css';
import logo from "./assets/img/chatbot/logo.png"

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="custom-footer">
            <div className="container py-3 py-lg-4">
                <div className="row row-cols-1 row-cols-md-3 align-items-start">
                    <div className="col-md-8">
                        <div className="custom-footer__logo d-flex align-items-center mb-3">
                            <img src={logo} alt="CODED Logo" className="custom-footer__logo-image"/>
                            <span className="ms-2">CODED.</span>
                        </div>
                        <p className="custom-footer__description text-muted">
                            Your virtual lab tutor.
                        </p>
                    </div>

                    <div className="col-md-4">
                        <h5 className="custom-footer__heading">Quick Links</h5>
                        <ul className="custom-footer__links list-unstyled">
                            <li><a href="https://coded-inc.gitbook.io/documentation-students" target="_blank"
                                   rel="noopener noreferrer">Documentation</a></li>
                            <li><a href="https://coded-ai.github.io/coded.github.io/" target="_blank"
                                   rel="noopener noreferrer">About Us</a></li>
                            <li><a href="mailto:coded.info.international@gmail.com">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <hr className="mt-4"/>

                <div className="text-muted d-flex justify-content-between align-items-center pt-2">
                    <p className="mb-0">Copyright © {currentYear} CODED.</p>
                    <a href="#" className="custom-footer__tos">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
