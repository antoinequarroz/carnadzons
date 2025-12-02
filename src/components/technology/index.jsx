import React, { useState } from 'react';
import PropTypes from 'prop-types';

Technology.propTypes = {
    data: PropTypes.array
};

function Technology(props) {
    const { data } = props;

    const [dataTitle] = useState({
        title: 'Thème du carnaval 2026',
        text: 'Destination Far West'
    });


    return (
        <section className="tf-section technology">
            <div className="container w_1490">
                <div className="row">
                    <div className="col-lg-6 col-md-12">
                        <div className="tf-title" data-aos="fade-right" data-aos-duration="800">
                            <div className="img_technology afficheImg">
                                <img src={require("../../assets/images/common/AfficheCarna2026.png")} alt="" />
                                <img className="coin coin_1" src={require("../../assets/images/planet/041-totem.png")} alt="" />
                                <img className="coin coin_2" src={require("../../assets/images/planet/044-scarf.png")} alt="" />
                                <img className="coin coin_6" src={require("../../assets/images/planet/049-barrel.png")} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="content_technology" data-aos="fade-up" data-aos-duration="800">
                            <div className="tf-title left">
                                <h2 className="title mb20">{dataTitle.title}</h2>
                            </div>
                            <h4 className="sub_technology">{dataTitle.text}</h4>
                            <p>Chers cowboys et cowgirls de Saint-Martin, bienvenue au Carna'dzons de Saint-Martin, sous le thème 'Far West' ! Rejoignez-nous pour une journée où nous plongeons au cœur de l'Ouest Américain sauvage. Le Far West, une époque de pionniers et d'aventuriers, inspire nos costumes légendaires de cowboys, d'Indiens, de shérifs et de hors-la-loi, évoquant les saloons et les ranchs des grandes plaines. Les rues se transforment en villes minières, avec des chars décorés comme des diligences et des trains du Wild West. La musique country et les danses en ligne animeront nos rues, rappelant l'ambiance des rodéos et des soirées autour du feu de camp. Cette aventure western symbolise notre esprit de liberté, d'audace et de camaraderie. Vivez cette expérience unique le 22 février 2025 à Saint-Martin, où le carnaval devient une épopée du Far West, unissant la communauté dans un voyage au cœur des légendes de l'Ouest sauvage.</p>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}

export default Technology;
