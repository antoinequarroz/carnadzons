import React from 'react';
import { Link } from 'react-router-dom';


function CTA2(props) {
    return (
        <section className="tf-section partner_CTA">
                <div className="overlay">
                    <img src={require ("../../assets/images/backgroup/bg_features_h3.png")} alt="" />
         
                </div>
                <div className="container ">
                    <div className="row align-items-center">
                        <div className="col-lg-8 col-md-12">
                            <div className="tf-title mb0 left" data-aos="fade-up" data-aos-duration="800">
                                <h2 className="title mb8">
                                    404 - Page non trouvée
                                </h2>
                                <p className="sub">
                                    Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                            <div className="image">
                                <img className="img_main" src={require ("../../assets/images/slider/Furore.png")} alt="" />
                                <img className="icon icon_1" src={require ("../../assets/images/common/icon_partner_2.png")} alt="" />
                                <img className="icon icon_2" src={require ("../../assets/images/common/icon1_slider_2.png")} alt="" />
                                <img className="icon icon_3" src={require ("../../assets/images/common/icon3_slider_2.png")} alt="" />
                            </div>
                        </div> 
                    </div>
                </div>
            </section>
    );
}

export default CTA2;