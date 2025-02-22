import driver from '@/lib/neo4j';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const session = driver.session();

  try {
    const { developerId, companyId } = await request.json()

    if (!developerId || !companyId) {
      return NextResponse.json(
        { error: 'Incomplete data. Developer ID and Company ID are required.' },
        { status: 400 }
      );
    }

    const result = await session.run( 
      'MATCH (d:Developer), (c:Company) WHERE ID(d) = $developerId AND ID(c) = $companyId RETURN d,c',
      { developerId: Number(developerId), companyId: Number(companyId) }
    );

    if (result.records.length === 0) {
      return NextResponse.json(
        { error: 'Developer or Company not found' },
        { status: 404 }
      );
    }

    const doesRelationAlreadyExists = await session.run(
      'MATCH (d:Developer)-[:WORKS_IN]->(c:Company) WHERE ID(d) = $developerId AND ID(c) = $companyId RETURN d,c',
      { developerId: Number(developerId), companyId: Number(companyId) }
    );

    if (doesRelationAlreadyExists.records.length > 0) {
      return NextResponse.json(
        { error: 'Relation already exists' },
        { status: 400 } 
      );
    }

    await session.run(
      'MATCH (d:Developer), (c:Company) WHERE ID(d) = $developerId AND ID(c) = $companyId CREATE (d)-[:WORKS_IN]->(c)',
      { developerId: Number(developerId), companyId: Number(companyId) }
    );

    return NextResponse.json({  
      message: `Relation Developer ${developerId} works in Company ${companyId} created successfully`
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating relation Developer works in company:', error);
    return NextResponse.json(
      { error: 'Error creating relation Developer works in company' }, 
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}
