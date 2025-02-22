import driver from '@/lib/neo4j';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const session = driver.session();

  try {
    const result = await session.run(
      'MATCH (c:Company) RETURN c, ID(c) as id'
    );

    const companies = result.records.map(record => ({
      id: record.get('c').identity.toNumber(),
      ...record.get('c').properties
    }));

    return NextResponse.json({ 
      message: "Companies found successfully",
      data: companies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Error fetching companies' },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
} 

export async function POST(request: NextRequest) {
  const session = driver.session();

  try {
    const { name, industry, revenue, location } = await request.json();

    if (!name || !industry || !revenue || !location) {
      return NextResponse.json(
        { error: 'Incomplete data. Name, industry, revenue and location are required.' },
        { status: 400 }
      );
    }

    const result = await session.run(
      'CREATE (c:Company {name: $name, industry: $industry, revenue: $revenue, location: $location}) RETURN c',
      { name, industry, revenue, location }
    );

    const newCompany = {
      id: result.records[0].get('c').identity.toNumber(),
      ...result.records[0].get('c').properties
    };

    return NextResponse.json({ 
      message: 'Company created successfully',
      data: newCompany 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Error creating company' }, 
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}