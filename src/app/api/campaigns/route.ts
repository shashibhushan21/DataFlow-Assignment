import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for development
let campaignsData = [
  {
    id: '1',
    name: 'Q1 Email Campaign',
    status: 'active',
    totalLeads: 150,
    successfulLeads: 45,
    responseRate: 30,
    budget: 5000,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Social Media Outreach',
    status: 'paused',
    totalLeads: 89,
    successfulLeads: 23,
    responseRate: 26,
    budget: 3000,
    createdAt: '2024-01-08',
  },
  {
    id: '3',
    name: 'LinkedIn Prospecting',
    status: 'active',
    totalLeads: 234,
    successfulLeads: 67,
    responseRate: 29,
    budget: 7500,
    createdAt: '2024-01-15',
  },
  {
    id: '4',
    name: 'Content Marketing Drive',
    status: 'completed',
    totalLeads: 312,
    successfulLeads: 98,
    responseRate: 31,
    budget: 4200,
    createdAt: '2024-01-05',
  },
  {
    id: '5',
    name: 'Webinar Series',
    status: 'active',
    totalLeads: 178,
    successfulLeads: 52,
    responseRate: 29,
    budget: 6800,
    createdAt: '2024-01-12',
  },
];

// GET - Fetch campaigns
export async function GET() {
  return NextResponse.json({ data: campaignsData });
}

// POST - Create campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Enhanced validation
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Campaign name is required' }, { status: 400 });
    }
    if (body.name.trim().length < 3) {
      return NextResponse.json({ error: 'Campaign name must be at least 3 characters' }, { status: 400 });
    }
    if (body.budget && (isNaN(body.budget) || body.budget < 0)) {
      return NextResponse.json({ error: 'Budget must be a positive number' }, { status: 400 });
    }

    // Check duplicate name
    if (campaignsData.some(campaign => campaign.name.toLowerCase() === body.name.trim().toLowerCase())) {
      return NextResponse.json({ error: 'Campaign name already exists' }, { status: 400 });
    }

    const newCampaign = {
      id: Date.now().toString(),
      name: body.name.trim(),
      status: body.status || 'draft',
      totalLeads: 0,
      successfulLeads: 0,
      responseRate: 0,
      budget: Number(body.budget) || 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    campaignsData.push(newCampaign);
    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// PUT - Update campaign
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const campaignIndex = campaignsData.findIndex(campaign => campaign.id === id);
    if (campaignIndex === -1) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Validation for updates
    if (body.name && body.name.trim().length < 3) {
      return NextResponse.json({ error: 'Campaign name must be at least 3 characters' }, { status: 400 });
    }
    if (body.budget && (isNaN(body.budget) || body.budget < 0)) {
      return NextResponse.json({ error: 'Budget must be a positive number' }, { status: 400 });
    }

    campaignsData[campaignIndex] = { ...campaignsData[campaignIndex], ...body };
    return NextResponse.json(campaignsData[campaignIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE - Delete campaign
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const campaignIndex = campaignsData.findIndex(campaign => campaign.id === id);
    if (campaignIndex === -1) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    campaignsData.splice(campaignIndex, 1);
    return NextResponse.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}