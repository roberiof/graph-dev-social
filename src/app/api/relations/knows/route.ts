import driver from "@/lib/neo4j";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = driver.session();

  try {
    const result = await session.run(
      'MATCH (d1:Developer)-[r:KNOWS]->(d2:Developer) RETURN ID(d1) as sourceId, ID(d2) as targetId'
    );

    const relationships = result.records.map(record => ({
      source: record.get('sourceId').toNumber(),
      target: record.get('targetId').toNumber()
    }));

    return NextResponse.json({ 
      message: "Knowledge relationships found successfully",
      data: relationships
    });
  } catch (error) {
    console.error('Error fetching knowledge relationships:', error);
    return NextResponse.json(
      { error: 'Error fetching knowledge relationships' },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}

export async function DELETE(request: NextRequest) {
  const session = driver.session();

  try {
    const { sourceId, targetId } = await request.json();

    if (!sourceId && sourceId !== 0 || !targetId && targetId !== 0) {
      return NextResponse.json(
        { error: 'Incomplete data. Source and target IDs are required.' },
        { status: 400 }
      );
    }

    const result = await session.run(
      'MATCH (d1:Developer)-[r:KNOWS]->(d2:Developer) WHERE ID(d1) = $sourceId AND ID(d2) = $targetId DELETE r',
      { sourceId: Number(sourceId), targetId: Number(targetId) }
    );
    
    if (result.summary.counters.updates().relationshipsDeleted === 0) {
      return NextResponse.json(
        { error: 'Relationship not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Knowledge relationship between Developer ${sourceId} and Developer ${targetId} removed successfully`
    });

  } catch (error) {
    console.error('Error removing knowledge relationship:', error);
    return NextResponse.json(
      { error: 'Error removing knowledge relationship' },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}