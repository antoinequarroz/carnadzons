import React, { useState } from 'react';
import PropTypes from 'prop-types';

Technology.propTypes = {
    data: PropTypes.array
};

function Technology(props) {
    const { data } = props;

    const [dataTitle] = useState({
        title: 'Thème du carnaval 2025',
        text: ' Retour au Moyen-Âge'
    });


    return (
        <section className="tf-section technology">
            <div className="container w_1490">
                <div className="row">
                    <div className="col-lg-6 col-md-12">
                        <div className="tf-title" data-aos="fade-right" data-aos-duration="800">
                            <div className="img_technology afficheImg">
                                <img src={require("../../assets/images/common/carnadzons2025Affiche.png")} alt="" />
                                <img className="coin coin_1" src={require("../../assets/images/planet/Potion.png")} alt="" />
                                <img className="coin coin_2" src={require("../../assets/images/planet/Scroll.png")} alt="" />
                                <img className="coin coin_6" src={require("../../assets/images/planet/Magic Book.png")} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="content_technology" data-aos="fade-up" data-aos-duration="800">
                            <div className="tf-title left">
                                <h2 className="title mb20">{dataTitle.title}</h2>
                            </div>
                            <h4 className="sub_technology">{dataTitle.text}</h4>
                            <p>Amis chevaliers et dames de Saint-Martin, bienvenue au Carna'dzons de Saint-Martin, sous le thème 'Les Royaumes Médiévaux' ! Rejoignez-nous pour une journée où nous plongeons au cœur des époques chevaleresques. Le Moyen Âge, un temps de bravoure et de légendes, inspire nos costumes majestueux de chevaliers, de princesses et de créatures mythiques, évoquant les nobles et les artisans des anciens royaumes. Les rues se transforment en châteaux enchantés et en marchés médiévaux, avec des chars décorés comme des catapultes et des tournois. La musique, un mélange de mélodies traditionnelles et de chants épiques, invite à des danses folkloriques et à des festins dignes des grandes cours. Cette aventure médiévale symbolise notre désir de courage, de camaraderie et de célébration des traditions. Vivez cette expérience unique le 22 février 2025 à Saint-Martin, où le carnaval devient une épopée médiévale, unissant la communauté dans un voyage au cœur des légendes et des histoires d'antan.</p>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}

export default Technology;
