import React from 'react';
import img from '../../assets/images/common/AfficheCarna2024.png'
import { useState } from 'react';



function Affiche (props) {

    const [dataTitle] = useState(
        {
            title: 'Thème du Carnaval 2024',
            subtitle: 'Les modzons sur la lune'
        }
    )
    return (
        <section className="tf-section tf_CTA">

                <div className="container relative">
                    <div className="overlay">
                    </div>
                    <div className="row">
                        <div className="col-md-7">
                            <div className="tf-title left mt58" data-aos="fade-up" data-aos-duration="800">
                                <h2 className="title">
                                    {dataTitle.title}
                                </h2>
                                <h4 className="sub">{dataTitle.subtitle}</h4>
                            </div>
                        </div>
                        <div className="col-md-5">
                        <div className="image_cta" data-aos="fade-left" data-aos-duration="1200">
                            <img className="move4 afficheImg" src={img} alt="" />
                        </div>
                        </div>
                    </div>
                </div>
            </section>
    );
}

export default Affiche;