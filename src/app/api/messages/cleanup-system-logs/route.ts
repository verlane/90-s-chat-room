import {NextResponse} from 'next/server';
import {deleteOldSystemLogs} from '../../../../../lib/microcms';

export async function DELETE() {
    try {
        const deletedCount = await deleteOldSystemLogs();
        return NextResponse.json({deletedCount});
    } catch (error) {
        console.error('Failed to delete old system logs:', error);
        return NextResponse.json(
            {error: 'Failed to delete old system logs'},
            {status: 500},
        );
    }
}
