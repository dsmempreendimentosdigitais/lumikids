import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const storiesRef = adminDb.collection('stories');
    
    // Tenta buscar as histórias ordenadas por createdAt ou direto
    let snapshot;
    try {
      snapshot = await storiesRef.orderBy('createdAt', 'desc').limit(100).get();
      if (snapshot.empty) {
        snapshot = await storiesRef.limit(100).get();
      }
    } catch {
      snapshot = await storiesRef.limit(100).get();
    }

    const stories = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        category: data.category || '',
        ageGroups: data.ageGroups || ['5-7'],
        coverEmoji: data.coverEmoji || '📖',
        coverColor: data.coverColor || '#D97706',
        coverImageUrl: data.coverImageUrl || `/stories/${doc.id}/cover.jpg`,
        durationMinutes: data.durationMinutes || 5,
        value: data.value || '',
        description: data.mission?.description || data.description || '',
        isPlaceholder: data.isPlaceholder || false,
        stars: 0,
        isCompleted: false
      };
    });

    return NextResponse.json({ stories }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error: any) {
    console.error('Error fetching stories via adminDb API:', error);
    return NextResponse.json({ error: error.message, stories: [] }, { status: 500 });
  }
}
