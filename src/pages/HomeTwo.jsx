import React from 'react';

import Banner from '../components/banner/banner_v2';
import dataBanner from '../assets/fake-data/data-banner';
import Featured from '../components/featured';
import dataFeatured from '../assets/fake-data/data-feature';
import Project5 from '../components/project/project_v5';
import dataProject from '../assets/fake-data/data-project';
import Tier from '../components/tier';
import dataTier from '../assets/fake-data/data-tier';
import Technology from '../components/technology';
import dataPartner from '../assets/fake-data/data-partner';
import Roadmap from '../components/roadmap';
import dataRoadmap from '../assets/fake-data/data-roadmap';
import Project6 from '../components/project/project_v6';

import Partner2 from '../components/partner/index2';
import Faqs from '../components/faqs';
import dataFaq from '../assets/fake-data/data-faqs';
import Token2 from '../components/token/Token2';
import dataToken from '../assets/fake-data/data-token';
import Team from '../components/team';
import dataTeam from '../assets/fake-data/data-team';
import CTA2 from '../components/cta/CTA2';
import CTA from '../components/cta';
import Affiche from "../components/cta";



function HomeTwo(props) {
    return (
        <div className='header-fixed main home2 counter-scroll'>
       

           {<Banner data={dataBanner} />}

           
            {<Featured data={dataFeatured} />}

            {<Technology data={dataPartner} />}


            <div className="bg_body">
                <div className="bg_h2">
                    <img src={require ("../assets/images/backgroup/bg_home2.png")} alt="" />
                </div>

                {<Roadmap data={dataRoadmap} />}

                {<Team data={dataTeam} />}
            </div>

            {<Partner2 data={dataPartner} />}


            {<Faqs data={dataFaq} />}

        </div>
    );
}

export default HomeTwo;