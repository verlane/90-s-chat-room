// src/app/api/messages/route.ts
import { NextResponse } from 'next/server';
import { getMessages, createMessage } from '../../../../lib/microcms';

export async function GET() {
    try {
        const messages = await getMessages();
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { content } = await req.json();
        const newMessage = await createMessage(content);
        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        console.error('Failed to create message:', error);
        return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
    }
}
