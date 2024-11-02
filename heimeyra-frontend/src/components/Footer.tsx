import React, { useState } from 'react';
import Modal from './Modal';

const Footer: React.FC = () => {
    const [showChangelog, setShowChangelog] = useState(false);

    const changelog = `
        v1.0.0 - Alpha Release - Nov 2, 2024
        • Interactive map to choose location
        • Customizable radius, altitude, and update frequency filters
        • Stepped warning levels 
        • Detachable warning indicator

        # known issues
        • sometimes unpausing does nothing. refresh page to reset.
    `;

    return (
        <div className="footer">
            <div className="footer-content">
                &copy; 2024 <a href="https://magnuscarlssen.substack.com" style={{ color: '#333', textDecoration: 'none' }}>Magnus Carlssen</a>
                &nbsp;|&nbsp;
                <button 
                    className="changelog-trigger"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowChangelog(true);
                    }}
                    style={{ 
                        background: 'none',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        padding: 0,
                        font: 'inherit'
                    }}
                >
                    changelog
                </button>
            </div>

            <Modal 
                isOpen={showChangelog}
                onClose={() => setShowChangelog(false)}
                title="Changelog"
            >
                <div className="changelog-content">
                    {changelog.split('\n').map((line, i) => (
                        <div key={i}>{line.trim()}</div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default Footer;
