import React from 'react';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { Link } from 'react-router-dom';
import Countdown from '../../countdown';

ProjectV7.propTypes = {
    data: PropTypes.array
};

function ProjectV7(props) {
    const {data} = props;
    return (
        <section className="tf-section project">
                <div className="container w_1280">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="tf-title" data-aos="fade-up" data-aos-duration="800">
                                <h2 className="title">
                                    Décollage prévu dans :
                                </h2>
                                <div className="featured-countdown style2">
                                    <span className="slogan"></span>
                                    <span className="js-countdown" data-timer="1865550">
                                        {<Countdown />}
                                    </span>
                                    <ul className="desc">
                                        <li>Days</li>
                                        <li>Hour</li>
                                        <li>Min</li>
                                        <li>Sec</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    );
}

export default ProjectV7;