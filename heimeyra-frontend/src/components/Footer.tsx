import React, { useState } from 'react';

const Footer: React.FC = () => {
    const [showChangelog, setShowChangelog] = useState(false);

    const changelog = `
        v1.0.0 - Initial Release
        • Aircraft proximity monitoring
        • Customizable radius and altitude
        • Real-time map integration
        • Detachable warning indicators
    `;

    return (
        <div className="footer">
            <p>
                &copy; 2024 <a href="https://magnuscarlssen.substack.com" style={{ color: '#333', textDecoration: 'none' }}>Magnus Carlssen</a>
                &nbsp;|&nbsp;
                <span 
                    className="changelog-trigger"
                    onMouseEnter={() => setShowChangelog(true)}
                    onMouseLeave={() => setShowChangelog(false)}
                >
                    changelog
                </span>
                {showChangelog && (
                    <div className="warning-tooltip changelog">
                        {changelog.split('\n').map((line, i) => (
                            <div key={i}>{line.trim()}</div>
                        ))}
                    </div>
                )}
            </p>
        </div>
    );
};

export default Footer;
