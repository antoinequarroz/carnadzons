import React, { useState, useEffect } from 'react';

function Countdown(props) {
    const [countdownDate] = useState(new Date(2024, 1, 3, 14, 0, 0).getTime());
    const [state, setState] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => setNewTime(), 1000);

        return () => clearInterval(interval);
    }, [countdownDate]);

    const setNewTime = () => {
        if (countdownDate) {
            const currentTime = new Date().getTime();
            const distanceToDate = countdownDate - currentTime;

            let days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distanceToDate % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);

            const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];

            days = `${days}`;
            hours = numbersToAddZeroTo.includes(hours) ? `0${hours}` : `${hours}`;
            minutes = numbersToAddZeroTo.includes(minutes) ? `0${minutes}` : `${minutes}`;
            seconds = numbersToAddZeroTo.includes(seconds) ? `0${seconds}` : `${seconds}`;

            setState({ days: days, hours: hours, minutes: minutes, seconds: seconds });
        }
    };

    return (
        <div className="countdown__timer">
            <div className="countdown__item">
                {state.days || '00'}
            </div>
            <div className="countdown__item countdownhours">
                {state.hours || '00'}
            </div>
            <div className="countdown__item countdownminutes">
                {state.minutes || '00'}
            </div>
            <div className="countdown__item countdownseconds">
                {state.seconds || '00'}
            </div>
        </div>
    );
}

export default Countdown;
