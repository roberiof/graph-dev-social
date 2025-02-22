import driver from '@/lib/neo4j';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const session = driver.session();

  try {
    const result = await session.run(
      'MATCH (d:Developer) RETURN d, ID(d) as id'
    );

    const developers = result.records.map(record => ({
      id: record.get('d').identity.toNumber(),
      ...record.get('d').properties
    }));

    return NextResponse.json({ 
      message: "Developer(s) found successfully",
      data: developers
    });
  } catch (error) {
    console.error('Error fetching developer(s):', error);
    return NextResponse.json(
      { error: 'Error fetching developer(s)' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = driver.session();

  try {
    const { name, age, location } = await request.json();

    if (!name || !age || !location) {
      return NextResponse.json(
        { error: 'Incomplete data. Name, age and location are required.' },
        { status: 400 }
      );
    }

    const result = await session.run(
      'CREATE (d:Developer {name: $name, age: $age, location: $location}) RETURN d',
      { name, age, location }
    );

    const newDev = {
      id: result.records[0].get('d').identity.toNumber(),
      ...result.records[0].get('d').properties
    };

    return NextResponse.json({ 
      message: 'Developer created successfully',
      data: newDev 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating developer:', error);
    return NextResponse.json(
      { error: 'Error creating developer' }, 
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}