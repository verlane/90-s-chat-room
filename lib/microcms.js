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

export const getMessages = async (offset = 0, limit = 100, orders = "-createdAt") => {
    try {
        const response = await client.get(`/messages?offset=${offset}&limit=${limit}&orders=${orders}`);
        return response.data.contents;
    } catch (error) {
        console.error('Failed to fetch messages from microCMS:', error);
        throw error;
    }
};

export const createMessage = async (message) => {
    try {
        const response = await client.post('/messages', {content: message});
        return response.data;
    } catch (error) {
        console.error('Failed to create message in microCMS:', error);
        throw error;
    }
};

export const deleteMessage = async (messageId) => {
    try {
        const response = await client.delete(`/messages/${messageId}`)
        return response.data;
    } catch (error) {
        console.error('Failed to delete message in microCMS:', error);
        throw error;
    }
};
