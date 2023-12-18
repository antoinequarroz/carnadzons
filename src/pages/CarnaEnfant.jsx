import React from 'react';

import PageTitle from '../components/pagetitle';
import CTA from '../components/cta/cta_v2';
import CTA2 from "../components/cta/CTA2";
import Cta_v2 from "../components/cta/cta_v2";
import CTA3 from "../components/cta/CTA3";



function CarnaEnfant(props) {
    return (
        <div className='inner-page project-grid-5'>
            {<PageTitle title='Project Details' />}
            <section className="tf-section details">
                <div className="container">
                    <div className="row col-12">
                        <div className="sidebar" data-aos="fade-left" data-aos-duration="1200" data-aos-delay="200">
                            <div className="prodect-content">
                                <h4 className="heading mb10">Carnaval des enfants</h4>
                                <h6>Mardi gras</h6>
                                <p>Amis pirates bienvenue ! L’espace d’un jour nous vous invitons à vous transformer en pirate ! Les pirates ont longtemps fasciné l’imagination populaire avec leurs aventures audacieuses et leur goût pour la liberté. Ces aventuriers des mers étaient connus pour leur vie dissolue et leur soif de trésors, et leur légende a inspiré de nombreux films, livres et jeux vidéo.</p>
                                <div className="image mb30 text-center">
                                    <img className="boder-20 afficheImg" src={require ("../assets/images/carna/CarnaEnfant2024.png")} alt="" />
                                </div>
                                <div className="spacing"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {<CTA/>}


        </div>
    );
}

export default CarnaEnfant;