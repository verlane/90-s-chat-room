import {NextRequest, NextResponse} from "next/server";
import {deleteMessage} from "../../../../../lib/microcms";

export async function DELETE(req: NextRequest, {params}: { params: { id: string } }) {
    try {
        const {id} = params;

        if (!id) {
            return NextResponse.json({error: 'Message ID is required'}, {status: 400});
        }

        console.log(id); // ID가 올바르게 추출되었는지 확인

        await deleteMessage(id);
        return NextResponse.json(true, {status: 202});
    } catch (error) {
        console.error('Failed to delete message:', error);
        return NextResponse.json({error: 'Failed to delete message'}, {status: 500});
    }
}
