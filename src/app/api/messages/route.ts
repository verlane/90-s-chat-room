import {NextResponse} from 'next/server';
import {createMessage, getMessages} from '../../../../lib/microcms';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const offset = url.searchParams.get('offset');
        const limit = url.searchParams.get('limit');
        const messages = await getMessages(Number(offset), Number(limit));
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        return NextResponse.json({error: 'Failed to fetch messages'}, {status: 500});
    }
}

export async function POST(req: Request) {
    try {
        const {content} = await req.json();
        const newMessage = await createMessage(content);
        return NextResponse.json(newMessage, {status: 201});
    } catch (error) {
        console.error('Failed to create message:', error);
        return NextResponse.json({error: 'Failed to create message'}, {status: 500});
    }
}
