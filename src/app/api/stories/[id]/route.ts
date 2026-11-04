import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const docSnap = await adminDb.collection('stories').doc(id).get();
    if (!docSnap.exists) {
      return NextResponse.json({ error: 'História não encontrada' }, { status: 404 });
    }

    const data = docSnap.data();
    return NextResponse.json({
      story: {
        id: docSnap.id,
        ...data
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error: any) {
    console.error('Error fetching story by ID via adminDb:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
