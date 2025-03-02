import driver from "@/lib/neo4j";
import { NextResponse } from "next/server";

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