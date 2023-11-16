import React  from 'react';
import '../styles.scss'
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import Countdown from "../../countdown";

Banner.propTypes = {
    data : PropTypes.array,
};

function Banner (props) {
    const {data} = props;
    return (

        <div className="page-title">
            <div className="icon_bg">
                <img src={require ('../../../assets/images/backgroup/bg_inner_slider.png')} alt="Carna" />
            </div>

            <Swiper>
                        <SwiperSlide>
                            <div className="slider-st2">
                                <img className="icon icon_1" src={require ("../../../assets/images/common/icon_partner_2.png")} alt="" />
                                <img className="icon icon_2" src={require ("../../../assets/images/common/icon2_slider_2.png")} alt="" />
                                <img className="icon icon_3" src={require ("../../../assets/images/common/icon3_slider_2.png")} alt="" />
                                <img className="icon icon_4" src={require ("../../../assets/images/planet/cuteCow.png")} alt="" />
                                <div className="overlay">
                                    <img src={require ("../../../assets/images//backgroup/bg-slider2.png")} alt="" />
                                </div>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="box-slider">
                                                <div className="content-box">
                                                    <h1 className="title" >Le Carna'dzons</h1>
                                                    <h3 className="sub-title">Les Modzons sur la Lune</h3>
                                                    <section className="tf-section project">
                                                        <div className="container w_1280">
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <div className="tf-title" data-aos="fade-up" data-aos-duration="800">
                                                                        <h4 className="title mt-5">
                                                                            Décollage prévu le 03 : 02 : 2024
                                                                        </h4>
                                                                        <div className="featured-countdown style2">
                                                                            <span className="slogan"></span>
                                                                            <span className="js-countdown" data-timer="1865550">
                                                                                {<Countdown />}
                                                                            </span>
                                                                            <ul className="desc">
                                                                                <li>Jou</li>
                                                                                <li>Heu</li>
                                                                                <li>Min</li>
                                                                                <li>Sec</li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="wrap-btn">
                                                                    <Link to="/faqs" className="tf-button style2">
                                                                        Plus d'infos
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
            </Swiper>

        </div>

    );
}

export default Banner;