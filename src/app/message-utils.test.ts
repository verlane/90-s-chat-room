import {describe, expect, it} from 'vitest';

import {
    formatMessageTimestamp,
    isSystemLog,
    ONE_DAY_MS,
    shouldDisplayMessage,
} from './message-utils';

const NOW = new Date('2026-07-27T12:00:00.000Z');
const SYSTEM_LOG = "< 'guest' 님이 대화실에 입장했습니다. >";
const RENAME_LOG = "< 'guest' 님이 대화명을 '새이름' 로 변경했습니다. >";

describe('isSystemLog', () => {
    it.each([SYSTEM_LOG, RENAME_LOG])(
        'recognizes system-log content wrapped in angle brackets: %s',
        content => {
            expect(isSystemLog(`  ${content}  `)).toBe(true);
        },
    );

    it('does not recognize content with only one angle bracket', () => {
        expect(isSystemLog("< 'guest' 님이 대화실에 입장했습니다.")).toBe(false);
    });

    it('does not recognize a regular chat message', () => {
        expect(isSystemLog('guest : 안녕하세요')).toBe(false);
    });

    it.each([
        '<3 사랑해>',
        '<html>test</html>',
        '< 그냥 꺾쇠로 감싼 문장 >',
    ])('does not mistake angle-bracketed chat for a system log: %s', content => {
        expect(isSystemLog(content)).toBe(false);
    });

    it.each([
        "< 'S.E.S.' 님이 대화실에 입장했습니다. >",
        "< 'S.E.S.' 님이 대화명을 '핑.클' 로 변경했습니다. >",
        "< 'O'Brien' 님이 대화명을 'D'Angelo' 로 변경했습니다. >",
    ])('recognizes special characters in nicknames: %s', content => {
        expect(isSystemLog(content)).toBe(true);
    });
});

describe('shouldDisplayMessage', () => {
    it('shows a system log created within the last 24 hours', () => {
        const message = {
            content: SYSTEM_LOG,
            createdAt: new Date(NOW.getTime() - ONE_DAY_MS + 1).toISOString(),
        };

        expect(shouldDisplayMessage(message, NOW)).toBe(true);
    });

    it('shows a system log created exactly 24 hours ago', () => {
        const message = {
            content: SYSTEM_LOG,
            createdAt: new Date(NOW.getTime() - ONE_DAY_MS).toISOString(),
        };

        expect(shouldDisplayMessage(message, NOW)).toBe(true);
    });

    it('hides a system log older than 24 hours', () => {
        const message = {
            content: SYSTEM_LOG,
            createdAt: new Date(NOW.getTime() - ONE_DAY_MS - 1).toISOString(),
        };

        expect(shouldDisplayMessage(message, NOW)).toBe(false);
    });

    it('always shows a regular chat message regardless of age', () => {
        const message = {
            content: 'guest : 오래된 대화입니다',
            createdAt: new Date(NOW.getTime() - ONE_DAY_MS * 365).toISOString(),
        };

        expect(shouldDisplayMessage(message, NOW)).toBe(true);
    });
});

describe('formatMessageTimestamp', () => {
    it('formats createdAt as local month/day and 24-hour time', () => {
        const localDate = new Date(2026, 6, 27, 9, 15);

        expect(formatMessageTimestamp(localDate.toISOString())).toBe('07/27 09:15');
    });
});
