import React from 'react';
import Banner from '../components/banner/banner_v2';
import dataBanner from '../assets/fake-data/data-banner';
import Featured from '../components/featured';
import dataFeatured from '../assets/fake-data/data-feature';
import Technology from '../components/technology';
import dataPartner from '../assets/fake-data/data-partner';
import Roadmap from '../components/roadmap';
import dataRoadmap from '../assets/fake-data/data-roadmap';
import Partner2 from '../components/partner/index2';
import Team from '../components/team';
import dataTeam from '../assets/fake-data/data-team';
import FAQs2 from "./FAQs2";


function HomePage(props) {

    const scrollToSection = (sectionId) => {
        const section = document.querySelector(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className='header-fixed main home2 counter-scroll'>
            <Banner data={dataBanner} />

            <div id="nous"> {/* Identifiant pour 'Qui sommes-nous' */}
                <Featured data={dataFeatured} />
            </div>

            <div id="theme"> {/* Identifiant pour 'Thème' */}
                <Technology data={dataPartner} />
            </div>

            <div className="bg_body">
                <div className="bg_h2">
                    <img src={require("../assets/images/backgroup/bg_home2.png")} alt="" />
                </div>

                <div id="char"> {/* Identifiant pour 'Char' */}
                    <Roadmap data={dataRoadmap} />
                </div>

                <div id="comite"> {/* Identifiant pour 'Comité' */}
                    <Team data={dataTeam} />
                </div>

                <div className="partner-container">
                    <Partner2 data={dataPartner} />
                </div>

                <div id="faq"> {/* Identifiant pour 'Histoire' */}
                    <FAQs2 />
                </div>

            </div>
        </div>
    );
}

export default HomePage;

