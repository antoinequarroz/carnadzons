import React from 'react';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import img from '../../assets/images/common/icon_roadmap.svg'

Roadmap.propTypes = {
    data: PropTypes.array
};

function Roadmap(props) {
    const {data} = props;
    return (
        <section className="tf-section roadmap">
                    <div className="container w_1850">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="tf-title" data-aos="fade-up" data-aos-duration="800">
                                    <h2 className="title">
                                        Où retrouver notre char ?
                                    </h2>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="container_inner roadmap_boder">
                                    <div className="roadmap-wrapper" data-aos="fade-in" data-aos-duration="1000">
                                    <Swiper
                                            className='slider-7'
                                            modules={[Navigation]}
                                            spaceBetween={30}
                                            breakpoints={{
                                                0: {
                           
                                                    slidesPerView: 1,
                                                  },
                                                  600: {
                           
                                                    slidesPerView: 2,
                                                  },
                        
                        
                                                  991: {
                           
                                                    slidesPerView: 3,
                                                  },

                                                  1200: {
                           
                                                    slidesPerView: 4,
                                                  },
                                             
                                              }}
                                         
                                        >
                                        {
                                            data.map(item => (
                                                <SwiperSlide key={item.id}>
                                                    <div className={`roadmap-box ${item.status}`}>
                                                        <div className="icon">
                                                            <img src={img} alt="" />
                                         
                                                        </div>
                                                        <div className="content">
                                                            <h6 className="date">{item.time}</h6>
                                                            <ul>
                                                                <h6>{item.text1}</h6>
                                                                <p>{item.text2}</p>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            ))
                                        }
                                    </Swiper>
            
                                    
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
    );
}

export default Roadmap;