// lib/microcms.js
import axios from 'axios';
import {isRenameLog, isSystemLog, ONE_DAY_MS} from '../src/app/message-utils';

const API_KEY = process.env.MICROCMS_API_KEY;
const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;

const client = axios.create({
    baseURL: `https://${SERVICE_DOMAIN}.microcms.io/api/v1`,
    headers: {
        'X-API-KEY': API_KEY,
    },
});

export const getMessages = async (offset = 0, limit = 100, orders = "-createdAt", filters) => {
    try {
        const params = {offset, limit, orders};
        if (filters) {
            params.filters = filters;
        }

        const response = await client.get('/messages', {params});
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

export const deleteOldSystemLogs = async (limit = 100) => {
    const cutoff = new Date(Date.now() - ONE_DAY_MS).toISOString();
    const messages = await getMessages(
        0,
        limit,
        'createdAt',
        `createdAt[less_than]${cutoff}`,
    );
    const systemLogs = messages.filter(
        message => isSystemLog(message.content) && !isRenameLog(message.content),
    );

    await Promise.all(systemLogs.map(message => deleteMessage(message.id)));

    return systemLogs.length;
};
