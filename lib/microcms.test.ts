import {afterEach, describe, expect, it, vi} from 'vitest';

const client = vi.hoisted(() => ({
    delete: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
}));

vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => client),
    },
}));

import {deleteOldSystemLogs, getMessages} from './microcms';
import {ONE_DAY_MS} from '../src/app/message-utils';

const NOW = new Date('2026-07-27T12:00:00.000Z');

describe('deleteOldSystemLogs', () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('deletes only system logs returned before the 24-hour cutoff', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(NOW);
        client.get.mockResolvedValue({
            data: {
                contents: [
                    {
                        id: 'entry-log',
                        content: "< 'S.E.S.' 님이 대화실에 입장했습니다. >",
                    },
                    {
                        id: 'regular-chat',
                        content: '<3 사랑해>',
                    },
                    {
                        id: 'rename-log',
                        content: "< 'guest' 님이 대화명을 '핑.클' 로 변경했습니다. >",
                    },
                ],
            },
        });
        client.delete.mockResolvedValue({data: {}});

        const deletedCount = await deleteOldSystemLogs(50);

        const cutoff = new Date(NOW.getTime() - ONE_DAY_MS).toISOString();
        expect(client.get).toHaveBeenCalledWith('/messages', {
            params: {
                offset: 0,
                limit: 50,
                orders: 'createdAt',
                filters: `createdAt[less_than]${cutoff}`,
            },
        });
        expect(client.delete).toHaveBeenCalledTimes(2);
        expect(client.delete).toHaveBeenNthCalledWith(1, '/messages/entry-log');
        expect(client.delete).toHaveBeenNthCalledWith(2, '/messages/rename-log');
        expect(deletedCount).toBe(2);
    });
});

describe('getMessages', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('omits filters when no filter is provided', async () => {
        client.get.mockResolvedValue({data: {contents: []}});

        await getMessages();

        expect(client.get).toHaveBeenCalledWith('/messages', {
            params: {
                offset: 0,
                limit: 100,
                orders: '-createdAt',
            },
        });
    });
});
