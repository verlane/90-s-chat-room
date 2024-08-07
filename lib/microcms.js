// lib/microcms.js
import axios from 'axios';

const API_KEY = process.env.MICROCMS_API_KEY;
const SERVICE_DOMAIN = 'bsb';

const client = axios.create({
    baseURL: `https://${SERVICE_DOMAIN}.microcms.io/api/v1`,
    headers: {
        'X-API-KEY': API_KEY,
    },
});

export const getMessages = async () => {
    try {
        const response = await client.get('/messages?limit=50&orders=-createdAt');
        return response.data.contents;
    } catch (error) {
        console.error('Failed to fetch messages from microCMS:', error);
        throw error;
    }
};

export const createMessage = async (message) => {
    try {
        const response = await client.post('/messages', { content: message });
        return response.data;
    } catch (error) {
        console.error('Failed to create message in microCMS:', error);
        throw error;
    }
};



