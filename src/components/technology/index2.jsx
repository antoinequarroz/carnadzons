import React, { useState } from 'react';
import PropTypes from 'prop-types';

Planning.propTypes = {
    data: PropTypes.array
};

function Planning(props) {
    const { data } = props;

    const [dataTitle] = useState({
        title: 'Thème du carnaval 2024',
        text: ' Les Modzons sur la Lune'
    });


    return (
        <section className="tf-section technology">
            <div className="container w_1490">
                <div className="row">
                    <div className="col-lg-6 col-md-12">
                        <div className="content_technology2" data-aos="fade-up" data-aos-duration="800">
                            <div className=" ">
                                <h2 className="title title mb20 ">Horaires</h2>
                            </div>
                            <h4 className="sub_technology">{dataTitle.text}</h4>
                            <p>Amis aventuriers de l'espace, bienvenue au Carna'dzons de Saint-Martin, sous le thème 'Les Modzons sur la Lune' ! Rejoignez-nous pour une journée où nous explorons les confins de l'univers. L'espace, un domaine d'audace et de mystère, inspire nos costumes scintillants de symboles lunaires et stellaires, évoquant des astronautes et des voyageurs interstellaires. Les rues se transforment en galaxies lointaines, avec des chars décorés comme des vaisseaux spatiaux. La musique, un mélange de rythmes terrestres et de sons cosmiques, invite à une danse interstellaire. Cette aventure spatiale symbolise notre désir de liberté, de découverte et d'unité. Vivez cette expérience unique le 4 février 2024 à Saint-Martin, où le carnaval devient une odyssée spatiale, unissant la communauté dans un voyage à travers les étoiles.</p>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="tf-title" data-aos="fade-left" data-aos-duration="800">
                            <div className="img_technology afficheImg2">
                                <img src={require("../../assets/images/common/AfficheCarna2024.png")} alt="" />
                                <img className="coin coin_1" src={require("../../assets/images/planet/bleu.png")} alt="" />
                                <img className="coin coin_6" src={require("../../assets/images/planet/bruneAnneaux.png")} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}

export default Planning;
