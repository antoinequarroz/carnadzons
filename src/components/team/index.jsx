import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import './team-simple.scss';

Team.propTypes = {
    data : PropTypes.array,
};

function Team(props) {
    const {data} = props;

    const [dataTitle] = useState(
        {
            title: 'Le comité',
        }
    )
    return (
        <section className="tf-section team-simple">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="tf-title mb40" data-aos="fade-up" data-aos-duration="800">
                            <h2 className="title">
                                {dataTitle.title}
                            </h2>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="team-grid">
                            {
                                data.map((item, index) => (
                                    <div key={index} className="team-card" data-aos="fade-up" data-aos-delay={100 + (index * 50)} data-aos-duration="800">
                                        <div className="card-border"></div>
                                        <div className="card-content">
                                            <h4 className="member-name">{item.name}</h4>
                                            <p className="member-role">{item.unit}</p>
                                            <p className="member-society">{item.societe}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Team;
