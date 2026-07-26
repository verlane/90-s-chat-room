export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const SYSTEM_LOG_PATTERN =
    /^< '[\s\S]+' 님이 (?:대화실에 입장했습니다\.|대화명을 '[\s\S]+' 로 변경했습니다\.) >$/;

export interface Message {
    content: string;
    createdAt: string;
    id?: string;
}

export function mergeIncomingMessages(current: Message[], incoming: Message[]): Message[] {
    if (incoming.length === 0) {
        return current;
    }

    const currentIds = new Set(
        current.flatMap(message => message.id ? [message.id] : []),
    );
    const newMessages = incoming
        .filter(message => !message.id || !currentIds.has(message.id))
        .reverse();

    return [...newMessages, ...current];
}

export function isSystemLog(content: string): boolean {
    return SYSTEM_LOG_PATTERN.test(content.trim());
}

export function shouldDisplayMessage(message: Message, now: Date): boolean {
    if (!isSystemLog(message.content)) {
        return true;
    }

    return now.getTime() - new Date(message.createdAt).getTime() <= ONE_DAY_MS;
}

export function formatMessageTimestamp(createdAt: string): string {
    const date = new Date(createdAt);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${month}/${day} ${hours}:${minutes}`;
}
