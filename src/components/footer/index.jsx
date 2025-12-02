import React, { useEffect, useState } from 'react';


import './styles.scss'

import { Link } from 'react-router-dom';



function Footer(props) {

    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };
  
    useEffect(() => {
      const toggleVisibility = () => {
        if (window.pageYOffset > 500) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };
  
      window.addEventListener("scroll", toggleVisibility);
  
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);
    return (
        <footer id="footer">
        <div className="footer-main">
            <div className="container">
                <div className="row">
                    <div className="footer-logo">
                        <div className="logo_footer">
                            <img src={require ("../../assets/images/logo/logo_carnadzons_grand.png")} alt="" />
                        </div>
                        <p>Carnaval de Saint-Martin</p>
                    </div>
                    <div className="widget">
                        <h5 className="widget-title">
                            Contactez-nous
                        </h5>
                        <ul className="widget-link contact">
                            <li>
                                <p>Adresse</p>
                                <Link to="#">Rue de l'Evouette 5, 1969 Saint-Martin</Link>
                            </li>
                            <li>
                                <p>Phone</p>
                                <Link to="#">079 157 64 50</Link>
                            </li>
                            <li className="email">
                                <p>Email</p>
                                <Link to="#">contact@carnadzons.ch</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="widget">
                        <h5 className="widget-title">
                            Liens utiles
                        </h5>
                        <ul className="widget-link">
                            <li>
                                <Link to="/">Accueil</Link>
                            </li>
                            <li>
                                <Link to="/#feature">Thème</Link>
                            </li>
                            <li>
                                <Link to="/contact">Contact</Link>
                            </li>
                            <li>
                                <Link to="/team_details">Comité</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="widget">
                        <h5 className="widget-title">
                            Développer par :
                        </h5>
                        <ul className="widget-link contact">
                            <li>
                                <p>Web</p>
                                <Link to="https://antoinequarroz.ch">www.antoinequarroz.ch</Link>
                            </li>
                            <li>
                                <p>Téléphone</p>
                                <Link to="#">+0791576450</Link>
                            </li>
                            <li className="email">
                                <p>Email</p>
                                <Link to="#">info@antoinequarroz.ch</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <div className="container">
                <div className="wrap-fx">
                    <div className="Copyright">
                        Copyright © 2025. Designed by <Link to="https://themeforest.net/user/themesflat/portfolio">Themesflat</Link>
                    </div>
                    <ul className="social">
                        <li>
                            <Link to="https://www.instagram.com/carnadzons/?fbclid=IwAR0w0F5sesZrrkOiXOwrcQy3CYWesU-BOs9i44A3_qgXNw78NJ156B-miKk">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                                </svg>
                                    
                            </Link>
                        </li>
                        <li>
                            <Link to="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                                </svg>
                                    
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            
        </div>


    </footer>
    );
}

export default Footer;