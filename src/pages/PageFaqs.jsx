import React from 'react';

import PageTitle from '../components/pagetitle';
import CTA from '../components/cta';
import { Link } from 'react-router-dom';
import Faq2 from '../components/faqs/Faq2';
import Faqs from '../components/faqs';
import dataFaq from '../assets/fake-data/data-faqs';



function PageFaqs(props) {
    return (
        <div className='inner-page'>
            {<PageTitle title='Faqs' />}


            <section className="tf-section tf-faq">
        <div className="container">
            <div className="row"> 
                <div className="col-md-12">
                    <div className="tf-title center mb40" data-aos="fade-up" data-aos-duration="800">
                        <h2 className="title mb-5">
                            Texte à trouver
                        </h2>
                        <h6>Plus d'information sur la fête</h6>
                    </div>
                </div>
            </div>
        </div>
    </section>

        {<Faqs data={dataFaq} />}


            {<CTA />}
            
        </div>
    );
}

export default PageFaqs;