import jwt from "jsonwebtoken";

export const generateToken = (userId , res)=>{

    const token = jwt.sign({userId} , process.env.JWT_SECRET , {
        expiresIn:"7d"
    })

    // Cookie configuration for cross-origin requests
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: isProduction, // Only send over HTTPS in production
        sameSite: isProduction ? 'none' : 'lax', // Required for cross-origin cookies in production
        domain: isProduction ? undefined : undefined, // Let browser handle domain
        path: '/' // Available for all paths
    });
    return token;
}

