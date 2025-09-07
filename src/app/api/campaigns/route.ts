import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campaigns, leads } from '@/lib/schema';
import { eq, count, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db
      .select({
        id: campaigns.id,
        name: campaigns.name,
        status: campaigns.status,
        total_leads: campaigns.total_leads,
        successful_leads: campaigns.successful_leads,
        response_rate: campaigns.response_rate,
        created_at: campaigns.created_at,
      })
      .from(campaigns)
      .orderBy(desc(campaigns.created_at));

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Campaigns API error:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, status = 'draft' } = body;

    if (!name) {
      return NextResponse.json({ error: 'Campaign name is required' }, { status: 400 });
    }

    const result = await db
      .insert(campaigns)
      .values({ name, status })
      .returning();

    return NextResponse.json({ data: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Create campaign error:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, status } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
    }

    const result = await db
      .update(campaigns)
      .set({ name, status, updated_at: new Date() })
      .where(eq(campaigns.id, id))
      .returning();

    return NextResponse.json({ data: result[0] });
  } catch (error) {
    console.error('Update campaign error:', error);
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    await db.delete(campaigns).where(eq(campaigns.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete campaign error:', error);
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}