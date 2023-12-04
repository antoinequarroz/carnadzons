import React from 'react';
import '../scss/component/_section.scss'; 
import '../scss/component/_box.scss'; 
import '../scss/component/_tf-section.scss'; 
import '../scss/component/_reponsive.scss'; 
import Banner from '../components/banner/banner_v1'; 
import dataBanner from '../assets/fake-data/data-banner';
import Project from '../components/project/project_v1';  
import Project2 from '../components/project/project_v2';  
import dataProject from '../assets/fake-data/data-project';
import Project3 from '../components/project/project_v3';  
import Project4 from '../components/project/project_v4';  
import Token from '../components/token';

import Team from '../components/team';
import Partner from '../components/partner';
import dataPartner from '../assets/fake-data/data-partner';
import CTA from '../components/cta';
import dataTeam from '../assets/fake-data/data-team';
function HomeOne(props) {
 
    return (
        <div className='header-fixed main home1 counter-scroll'>

           {<Banner data={dataBanner} />}
           {<Project data={dataProject}/>}
           {<Project2 data={dataProject}/>}
           {<Project3 data={dataProject}/>}

            {<Token />}

            <Project4 data={dataProject} />

            <Team data={dataTeam} />

            <Partner data={dataPartner} />

            <CTA />


        </div>
    );
}

export default HomeOne;