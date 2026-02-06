import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const AboutContent: React.FC = () => (
    <>
        <p><b><i>heimeyra</i> loosely means "home of listening" in Old Norse.</b> According to legend, Heimdall could hear grass grow...but heimdall.app was taken. heimerya was built by audiobook narrator and voice actor <a href="https://magnuscarlssen.substack.com/" target="_blank" rel="noopener noreferrer">Magnus Carlssen</a>.</p>
        <p>I live near a small university flight school, and am frequently interrupted during recording sessions by trainers buzzing my studio. To avoid losing a perfect take, I use public aircraft tracking data to watch out for incoming aircraft.</p>
        <p>The <a href="https://github.com/mcarlssen/code/tree/main/plane-tracker" target="_blank" rel="noopener noreferrer">first generation of this app</a> in 2023 was a simple Powershell script. I rebuilt it as a webapp in the fall of 2024 to teach myself Typescript, React, and Cursor.</p>
        <p>If you find it useful, or want to commiserate about the joys of recording audiobooks near an airfield (looking at you, Duffy), join us in the <a href="https://dsc.gg/narrators" target="_blank" rel="noopener noreferrer">Audiobook Producers Discord</a>. We're a friendly, quiet bunch, and don't much like airplanes.</p>
        <p><a href="https://dsc.gg/narrators"><img src="/images/discord-invite.webp" alt="Discord invite" /></a></p>
        <p><a 
            href='https://ko-fi.com/U7U24513O' 
            target='_blank' 
            rel="noopener noreferrer"
            className="kofi-button"
            style={{ 
                backgroundColor: '#ebb400',
                color: '#fff',
                margin: '15px auto 0',
                padding: '10px 15px',
                borderRadius: '4px',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: 'bold'
            }}
        >
            ☕ Caffeinate the code hamster
        </a></p>
    </>
);

export const HelpContent: React.FC = () => (
    <>
        <div className="help-content">
            <p>
                <FontAwesomeIcon icon="globe" className="fa-xl fa-icon" /> 
                <b>Move the map around to select a location</b>.
            </p>
            <p>
                <FontAwesomeIcon icon={['far', 'circle-dot']} className="fa-xl fa-icon" />
                <b>set the 'Radius' slider to the <i>distance where you start to hear an aircraft.</i></b>
                <br /> 
                <span style={{ display: 'block', paddingLeft: '30px' }}>
                    Some trial and error may be needed to figure out the proper distance.
                </span>
            </p>
            <p>
                <FontAwesomeIcon icon="traffic-light" className="fa-xl fa-icon fa-rotate-90" />
                &nbsp;&nbsp;Mouse over the stoplight to see the current radius stages based on your settings.
            </p>
            <p>
                <FontAwesomeIcon icon="cloud-arrow-up" className="fa-xl fa-icon" />
                &nbsp;use the 'Max Altitude' slider to filter out high-flying aircraft that are inaudible anyway.
            </p>
            <p>
                <FontAwesomeIcon icon="hourglass-end" className="fa-xl fa-icon" />
                &nbsp;<b>refresh is fixed at 15 seconds</b> to reduce API errors.
                <br />
                <span style={{ display: 'block', paddingLeft: '30px' }}>
                    The upstream aircraft data provider now rate-limits free accounts to 500 requests per 24 hours, and polling too aggressively can cause periodic HTTP 500 errors.
                </span>
            </p>
            <p>
                <FontAwesomeIcon icon="skull-crossbones" className="fa-xl fa-icon" />
                &nbsp;<b>if it all goes sideways, or the list isn't updating, shift+reload the page.</b>
            </p>
            <p>
                <FontAwesomeIcon icon="bug" className="fa-xl fa-icon" />
                &nbsp;if unpausing does nothing, check the browser console for new data logs, and see above.
            </p>
            <p>
                <FontAwesomeIcon icon="bugs" className="fa-xl fa-icon" />
                &nbsp;<a href="https://github.com/mcarlssen/heimeyra/issues" target="_blank" rel="noopener noreferrer">report new bugs</a>, please and thank you!
            </p>
        </div>
    </>
); 