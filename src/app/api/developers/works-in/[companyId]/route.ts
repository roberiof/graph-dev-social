import driver from '@/lib/neo4j';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { companyId: string } }) {
  const session = driver.session();

  try {
    const companyId = parseInt((await params).companyId); 

    const result = await session.run(
      'MATCH (d:Developer)-[:WORKS_IN]->(c:Company) WHERE ID(c) = $companyId RETURN d, ID(d) as id, c, ID(c) as cid',
      { companyId:  companyId}
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
