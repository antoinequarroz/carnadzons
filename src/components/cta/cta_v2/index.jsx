import React from 'react';

import { Link } from 'react-router-dom';


function CTA(props) {
    return (
        <section className="tf-section tf_CTA">

                <div className="container relative">
                    <div className="overlay">
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="tf-title left mt66" data-aos="fade-up" data-aos-duration="800">
                                <h2 className="title">
                                    Les Modzons sur la Lune
                                </h2>

                            </div>
                        </div>
                        <div className="col-md-6">
                        <div className="image_cta" data-aos="fade-left" data-aos-duration="1200">
                            <img className="move4" src={require ("../../../assets/images/planet/blueAnneaux.png")} alt="" />
                        </div>
                        </div>
                    </div>
                </div>
            </section>
    );
}

export default CTA;