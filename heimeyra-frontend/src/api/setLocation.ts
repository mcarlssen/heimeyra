import type { VercelRequest, VercelResponse } from '@vercel/node';

const convertMilesToNautical = (miles: number) => miles * 0.868976;

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { lat, lon, radius, altitude } = req.body;
    const nauticalRadius = convertMilesToNautical(radius);
    
    const cookieOptions = {
        maxAge: 604800000, // 7 days
        path: '/',
    };
    
    res.setHeader('Set-Cookie', [
        `userLocation=${JSON.stringify({ lat, lon })}; Path=/; Max-Age=604800`,
        `userRadius=${nauticalRadius}; Path=/; Max-Age=604800`,
        `userAltitude=${altitude}; Path=/; Max-Age=604800`
    ]);

    res.status(200).json({ message: 'Location and settings saved' });
}