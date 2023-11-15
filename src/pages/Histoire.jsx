import React from 'react';

import PageTitle from '../components/pagetitle';
import CTA from '../components/cta/cta_v2';



function Histoire(props) {
    return (
        <div className='inner-page project-grid-5'>
            {<PageTitle title='Project Details' />}
            <section className="tf-section details">
        <div className="container">
            <div className="row col-12">
                <div className="sidebar" data-aos="fade-left" data-aos-duration="1200" data-aos-delay="200"> 
                    <div className="prodect-content">
                        <h4 className="heading mb10">Notre Histoire</h4>
                        <p>En 2013, après 42 ans d’existence, le Carnaval de Saint-Martin a décidé de faire peau neuve et de procéder à des changements en profondeur.</p>
                        <p>Ainsi est né le Carnaval nouvelle mouture sous l’appellation CARNA’DZONS. Depuis, ce nouveau concept a insufflé une belle énergie et a remporté un vif succès auprès de la population et des sociétés membres et invitées.</p>
                        <p>Grâce à un comité jeune et dynamique, les sociétés membres du Carna’dzons sont fières de vous convier au Carna’dzons 2024!</p>
                        <p>Nous nous réjouissons de vous accueillir à Saint-Martin et de vivre avec vous cette journée placée sous le signe de la convivialité et de la franche rigolade!</p>
                        <div className="col-6">
                            <h6 className="heading mb10">Les sociétés membres</h6>
                            <ul>
                                <li>La Jeunesse de Saint-Martin</li>
                                <li>Les fifres et tambours de la Maya</li>
                                <li>La fanfare la Perce-Neige</li>
                                <li>Les Chenegaudes</li>
                                <li>La gymnastique La Coccinelle</li>
                            </ul>
                        </div>
                        <div className="spacing"></div>
                        <div className="image mb30 text-center">
                            <img className="boder-20" src={require ("../assets/images/carna/histoire.jpg")} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

           
            {<CTA />}

            
        </div>
    );
}

export default Histoire;