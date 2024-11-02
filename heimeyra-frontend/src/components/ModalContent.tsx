import React from 'react';

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
            <p><i className="fa-solid fa-globe fa-xl"></i> <b>Move the map around to select a location</b>.</p>
            <p>
            <i className="fa-regular fa-circle-dot fa-xl"></i> 
            <b>set the 'Radius' slider to the <i>distance where you start to hear an aircraft.</i></b>
            <br /> 
            <span style={{ display: 'block', paddingLeft: '30px' }}>
                Some trial and error may be needed to figure out the proper distance.
            </span>
            </p>
            <p>&nbsp;<i className="fa-solid fa-traffic-light fa-xl fa-rotate-90"></i>&nbsp;&nbsp;Mouse over the stoplight to see the current radius stages based on your settings.</p>
            <p><i className="fa-solid fa-cloud-arrow-up fa-xl"></i> use the 'Max Altitude' slider to filter out high-flying aircraft that are inaudible anyway.</p>
            <p><i className="fa-solid fa-hourglass-end fa-xl"></i> the default update frequency is 5 seconds. adjust to your needs.</p>
            <p><i className="fa-solid fa-skull-crossbones fa-xl"></i> <b>if it all goes sideways, or the list isn't updating, shift+reload the page.</b></p>
            <p><i className="fa-solid fa-bug fa-xl"></i> if unpausing does nothing, check the browser console for new data logs, and see above.</p>
            <p><i className="fa-solid fa-bugs fa-xl"></i> <a href="https://github.com/mcarlssen/heimeyra/issues" target="_blank" rel="noopener noreferrer">report new bugs</a>, please and thank you!</p>
        </div>
    </>
); 