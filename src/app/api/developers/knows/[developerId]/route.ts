import driver from '@/lib/neo4j';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { developerId: string } }) {
  const session = driver.session();

  try {
    const developerId = parseInt((await params).developerId);

    const result = await session.run(
      'MATCH (d1:Developer)-[:KNOWS]->(d2:Developer) WHERE ID(d2) = $developerId RETURN d1, ID(d1) as id',
      { developerId: developerId }
    );

    const knownDevelopers = result.records.map(record => ({
      id: record.get('id').toNumber(),
      ...record.get('d1').properties
    }));

    return NextResponse.json({ 
      message: "Developer(s) who know the developer with id " + developerId + " found successfully",
      data: knownDevelopers
    });
  } catch (error) {
    console.error('Error fetching developer(s) who know the developer:', error);
    return NextResponse.json(
      { error: 'Error fetching developer(s) who know the developer:' },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}