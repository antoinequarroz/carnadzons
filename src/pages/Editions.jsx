import React from 'react';

import PageTitle from '../components/pagetitle';
import CTA from '../components/cta/cta_v2';



function Edition(props) {
    return (
        <div className='inner-page project-grid-5'>
            {<PageTitle title='Project Details' />}
            <section className="tf-section details">
                <div className="container">
                    <div className="row col-12">
                        <div className="sidebar" data-aos="fade-left" data-aos-duration="1200" data-aos-delay="200">
                            <div className="prodect-content">
                                <h4 className="heading mb10">Édition 2023</h4>
                                <h6>À l’abor’dzons</h6>
                                <p>Amis pirates bienvenue ! L’espace d’un jour nous vous invitons à vous transformer en pirate ! Les pirates ont longtemps fasciné l’imagination populaire avec leurs aventures audacieuses et leur goût pour la liberté. Ces aventuriers des mers étaient connus pour leur vie dissolue et leur soif de trésors, et leur légende a inspiré de nombreux films, livres et jeux vidéo.</p>
                                <p> Un pirate typique était un marin expérimenté qui avait abandonné les navires de commerce pour devenir un corsaire indépendant, attaquant et pillant les navires ennemis pour leur butin. Ils étaient souvent associés à des bannières noires et à des crânes et des tibias croisés, et leurs navires étaient ornés de drapeaux de pirate et de têtes de mort.</p>
                                <p>Bien que la vie de pirate soit souvent considérée comme dangereuse et impitoyable, elle était aussi pleine de liberté et d’aventure. Les pirates étaient leurs propres patrons et ne répondaient qu’à leur code d’honneur personnel. Ils étaient aussi connus pour leur sens de l’amitié et de la loyauté, se battant souvent côte à côte avec leurs compagnons de bord.</p>
                                <p>En fin de compte, les pirates restent une figure emblématique de l’histoire maritime et continuent de captiver l’imagination populaire avec leur esprit indomptable et leur soif de liberté.</p>
                                <p>Être ensemble, écouter de la bonne musique, venez nous rejoindre moussaillons à Saint-Martin le 11 février !</p>
                                <div className="image mb30 text-center">
                                    <img className="boder-20" src={require ("../assets/images/carna/afficheFinal2023.png")} alt="" />
                                </div>
                                <div className="spacing"></div>
                                <h4 className="heading mb10">Édition 2020</h4>
                                <p>En 2013, après 42 ans d’existence, le Carnaval de Saint-Martin a décidé de faire peau neuve et de procéder à des changements en profondeur.</p>
                                <p>Ainsi est né le Carnaval nouvelle mouture sous l’appellation CARNA’DZONS. Depuis, ce nouveau concept a insufflé une belle énergie et a remporté un vif succès auprès de la population et des sociétés membres et invitées.</p>
                                <p>Grâce à un comité jeune et dynamique, les sociétés membres du Carna’dzons sont fières de vous convier au Carna’dzons 2024!</p>
                                <p>Nous nous réjouissons de vous accueillir à Saint-Martin et de vivre avec vous cette journée placée sous le signe de la convivialité et de la franche rigolade!</p>

                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {<CTA />}


        </div>
    );
}

export default Edition;