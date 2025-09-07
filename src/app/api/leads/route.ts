import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for development
let leadsData = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Corp',
    status: 'qualified',
    source: 'website',
    value: 5000,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    company: 'Tech Solutions',
    status: 'new',
    source: 'referral',
    value: 3000,
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@startup.io',
    company: 'StartupXYZ',
    status: 'contacted',
    source: 'linkedin',
    value: 7500,
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@enterprise.com',
    company: 'Enterprise Inc',
    status: 'converted',
    source: 'webinar',
    value: 12000,
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@techcorp.com',
    company: 'TechCorp',
    status: 'qualified',
    source: 'social',
    value: 4500,
    createdAt: '2024-01-11',
  },
];

// GET - Fetch leads
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  
  let filteredLeads = leadsData;
  
  // Apply search filter
  if (search) {
    filteredLeads = filteredLeads.filter(lead => 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Apply status filter
  if (status) {
    filteredLeads = filteredLeads.filter(lead => lead.status === status);
  }
  
  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);
  
  return NextResponse.json({
    data: paginatedLeads,
    pagination: {
      page,
      limit,
      hasMore: endIndex < filteredLeads.length,
      total: filteredLeads.length
    }
  });
}

// POST - Create lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Enhanced validation
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!body.email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!body.company?.trim()) {
      return NextResponse.json({ error: 'Company is required' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check duplicate email
    if (leadsData.some(lead => lead.email === body.email)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const newLead = {
      id: Date.now().toString(),
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      company: body.company.trim(),
      status: body.status || 'new',
      source: body.source || 'manual',
      value: Number(body.value) || 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    leadsData.push(newLead);
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// PUT - Update lead
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const leadIndex = leadsData.findIndex(lead => lead.id === id);
    if (leadIndex === -1) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Validation for updates
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
      }
      // Check duplicate email (excluding current lead)
      if (leadsData.some(lead => lead.email === body.email && lead.id !== id)) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
    }

    leadsData[leadIndex] = { ...leadsData[leadIndex], ...body };
    return NextResponse.json(leadsData[leadIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE - Delete lead
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const leadIndex = leadsData.findIndex(lead => lead.id === id);
    if (leadIndex === -1) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    leadsData.splice(leadIndex, 1);
    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}