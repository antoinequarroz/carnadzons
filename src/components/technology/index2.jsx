import React, { useState } from 'react';
import PropTypes from 'prop-types';

Planning.propTypes = {
    data: PropTypes.array
};

function Planning(props) {
    const { data } = props;

    const [dataTitle] = useState({
        title: 'Thème du carnaval 2024',
        text: 'Les Modzons sur la Lune'
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
                            <ul>
                                <li>
                                    <h6>Dès 14h00 :</h6>
                                    <ul>
                                        <li> Défilé des guggens jusqu'à la place de l'église</li>
                                    </ul>
                                </li>
                                <li>
                                    <h6>Dès 14h30 :</h6>
                                    <ul>
                                        <li> Apéro sur la place de l'église</li>
                                    </ul>
                                </li>

                                <li>
                                    <h6>16h00 :</h6>
                                    <ul>
                                        <li> Grand cortège et carousel des guggens</li>
                                    </ul>
                                </li>

                                <li>
                                    <h6>18h00 :</h6>
                                    <ul>
                                        <li> Production des sociétés</li>
                                        <ul>
                                            <li> La Perce-Neige</li>
                                            <li> Les Fifres et Tambours La Maya</li>
                                            <li> La Coccinelle</li>
                                            <li> Les K'sôs</li>
                                            <li> Les Peinsaclicks</li>
                                            <li> La Glouglouggen</li>
                                            <li> Les Chenegaudes</li>
                                        </ul>
                                    </ul>
                                </li>
                                <li>
                                    <h6>Dès 23h00 :</h6>
                                    <ul>
                                        <li>Animation avec DJ Lucian</li>
                                    </ul>
                                </li>
                            </ul>
                            {/* Le reste de votre texte descriptif ici */}
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <div className="tf-title" data-aos="fade-left" data-aos-duration="800">
                            <div className="img_technology afficheImg2 pt-5">
                                <img src={require("../../assets/images/backgroup/FlyerVerso300.png")} alt=""/>
                                <img className="coin coin_1" src={require("../../assets/images/planet/bleu.png")}
                                     alt=""/>
                                <img className="coin coin_6"
                                     src={require("../../assets/images/planet/bruneAnneaux.png")} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}

export default Planning;
