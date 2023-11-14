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
                                <Link to="#">+0791576450</Link>
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
                        Copyright © 2024. Designed by <Link to="https://themeforest.net/user/themesflat/portfolio">Themesflat</Link>
                    </div>
                    <ul className="social">
                        <li>
                            <Link to="#">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_157_2529)">
                                    <path d="M18 3.41887C17.3306 3.7125 16.6174 3.90712 15.8737 4.00162C16.6388 3.54487 17.2226 2.82712 17.4971 1.962C16.7839 2.38725 15.9964 2.68763 15.1571 2.85525C14.4799 2.13413 13.5146 1.6875 12.4616 1.6875C10.4186 1.6875 8.77387 3.34575 8.77387 5.37863C8.77387 5.67113 8.79862 5.95237 8.85938 6.22012C5.7915 6.0705 3.07687 4.60013 1.25325 2.36025C0.934875 2.91263 0.748125 3.54488 0.748125 4.2255C0.748125 5.5035 1.40625 6.63637 2.38725 7.29225C1.79437 7.281 1.21275 7.10888 0.72 6.83775C0.72 6.849 0.72 6.86363 0.72 6.87825C0.72 8.6715 1.99912 10.161 3.6765 10.5041C3.37612 10.5863 3.04875 10.6256 2.709 10.6256C2.47275 10.6256 2.23425 10.6121 2.01038 10.5626C2.4885 12.024 3.84525 13.0984 5.4585 13.1332C4.203 14.1154 2.60888 14.7071 0.883125 14.7071C0.5805 14.7071 0.29025 14.6936 0 14.6565C1.63462 15.7106 3.57188 16.3125 5.661 16.3125C12.4515 16.3125 16.164 10.6875 16.164 5.81175C16.164 5.64862 16.1584 5.49113 16.1505 5.33475C16.8829 4.815 17.4982 4.16587 18 3.41887Z" fill="#798DA3"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_157_2529">
                                    <rect width="18" height="18" fill="white"/>
                                    </clipPath>
                                    </defs>
                                    </svg>
                                    
                            </Link>
                        </li>
                        <li>
                            <Link to="#">
                                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.3836 5.00756C10.3836 3.73634 10.8716 3.0748 11.5606 3.0748C12.2169 3.0748 12.654 3.6686 12.654 4.87208C12.654 5.5569 12.472 6.30736 12.3376 6.75085C12.3386 6.75191 12.9917 7.90035 14.7784 7.54788C15.1573 6.69899 15.3637 5.59924 15.3637 4.63498C15.3637 2.04068 14.0512 0.531311 11.6464 0.531311C9.17275 0.531311 7.72689 2.44819 7.72689 4.97475C7.72689 7.47802 8.88803 9.62776 10.8017 10.6068C9.9973 12.2295 8.9727 13.6595 7.90471 14.737C5.96772 12.3745 4.21596 9.22449 3.4962 3.07586H0.63623C1.9572 13.3165 5.89363 16.5766 6.9341 17.2032C7.5226 17.5599 8.03067 17.543 8.56837 17.2371C9.41302 16.7523 11.9512 14.195 13.3569 11.1985C13.9464 11.1964 14.6556 11.1287 15.3627 10.9667V8.95034C14.9297 9.0509 14.5117 9.09535 14.1348 9.09535C12.0147 9.09535 10.3836 7.60292 10.3836 5.00756Z" fill="#798DA3"/>
                                    </svg>
                                    
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            
        </div>

        {
                isVisible && 
                <Link onClick={scrollToTop}  to='#' id="scroll-top"></Link>
            }
    </footer>
    );
}

export default Footer;