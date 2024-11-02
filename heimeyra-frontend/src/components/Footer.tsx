import React, { useState } from 'react';
import Modal from './Modal';

const Footer: React.FC = () => {
    const [showChangelog, setShowChangelog] = useState(false);

    const changelog = `
        v1.0.0 - Alpha Release
        • Aircraft proximity monitoring
        • Customizable radius and altitude
        • Real-time map integration
        • Detachable warning indicators
    `;

    return (
        <div className="footer">
            <div className="footer-content">
                &copy; 2024 <a href="https://magnuscarlssen.substack.com" style={{ color: '#333', textDecoration: 'none' }}>Magnus Carlssen</a>
                &nbsp;|&nbsp;
                <a 
                    href="#"
                    className="changelog-trigger"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowChangelog(true);
                    }}
                >
                    changelog
                </a>
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
