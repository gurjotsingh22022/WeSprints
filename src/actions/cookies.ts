"use server"

import { setCookie, getCookie } from "cookies-next";
import { jwtVerify, SignJWT } from 'jose'


const SECRET_KEY = new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY);

/**
 * Sign and encode JSON data into a JWT.
 */
export const signJson = async (data: any): Promise<string> => {
  return new SignJWT({ data })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(SECRET_KEY);
};

/**
 * Verify and decode a JWT to retrieve the JSON data.
 */
export const verifyJson = async (token: string) => {
  const { payload } = await jwtVerify(token, SECRET_KEY);
  return payload.data;
};



// Function to set a JWT in a cookie
export async function setJwtCookie (data: any, options = {}){
    try
    {
        const encryptedData = await signJson(JSON.stringify(data));
        return encryptedData;
        // Initialize cookies
    
        }
    catch(error: any)
    {
        console.error('Error signing token:', error);
    }

    
};

export async function getJwtCookie (token: string) {

    if (!token) {
        return null;
    }

    try {
        return verifyJson(token);
    } catch (error) {
        return null;
    }
  };