import driver from '@/lib/neo4j';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const session = driver.session();

  try {
    const { developerId, knownDeveloperId } = await request.json()

    if (!developerId && developerId !== 0 || !knownDeveloperId && knownDeveloperId !== 0) {
      return NextResponse.json(
        { error: 'Incomplete data. Both Developer IDs are required.' },
        { status: 400 }
      );
    }

    const result = await session.run( 
      'MATCH (d1:Developer), (d2:Developer) WHERE ID(d1) = $developerId AND ID(d2) = $knownDeveloperId RETURN d1,d2',
      { developerId: Number(developerId), knownDeveloperId: Number(knownDeveloperId) }
    );

    if (result.records.length === 0) {
      return NextResponse.json(
        { error: 'One or both developers not found' },
        { status: 404 }
      );
    }

    const doesRelationAlreadyExists = await session.run(
      'MATCH (d1:Developer)-[:KNOWS]->(d2:Developer) WHERE ID(d1) = $developerId AND ID(d2) = $knownDeveloperId RETURN d1,d2',
      { developerId: Number(developerId), knownDeveloperId: Number(knownDeveloperId) }
    );

    if (doesRelationAlreadyExists.records.length > 0) {
      return NextResponse.json(
        { error: 'Relation already exists' },
        { status: 400 } 
      );
    }

    await session.run(
      'MATCH (d1:Developer), (d2:Developer) WHERE ID(d1) = $developerId AND ID(d2) = $knownDeveloperId CREATE (d1)-[:KNOWS]->(d2)',
      { developerId: Number(developerId), knownDeveloperId: Number(knownDeveloperId) }
    );

    return NextResponse.json({  
      message: `Relation Developer ${developerId} knows Developer ${knownDeveloperId} created successfully`
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating KNOWS relation between developers:', error);
    return NextResponse.json(
      { error: 'Error creating KNOWS relation between developers' }, 
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}