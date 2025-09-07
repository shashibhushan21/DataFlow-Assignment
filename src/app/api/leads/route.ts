import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads, campaigns } from '@/lib/schema';
import { eq, ilike, or, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    
    const offset = (page - 1) * limit;

    let query = db
      .select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        company: leads.company,
        status: leads.status,
        source: leads.source,
        last_contacted: leads.last_contacted,
        created_at: leads.created_at,
        campaign: {
          id: campaigns.id,
          name: campaigns.name,
        },
      })
      .from(leads)
      .leftJoin(campaigns, eq(leads.campaign_id, campaigns.id))
      .orderBy(desc(leads.created_at))
      .limit(limit)
      .offset(offset);

    if (search) {
      query = query.where(
        or(
          ilike(leads.name, `%${search}%`),
          ilike(leads.email, `%${search}%`),
          ilike(leads.company, `%${search}%`)
        )
      );
    }

    if (status) {
      query = query.where(eq(leads.status, status));
    }

    const result = await query;

    return NextResponse.json({
      data: result,
      pagination: {
        page,
        limit,
        hasMore: result.length === limit,
      },
    });
  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}