import driver from "@/lib/neo4j";
import { NextResponse } from "next/server";

export async function GET() {
  const session = driver.session();

  try {
    const result = await session.run(
      'MATCH (d:Developer)-[r:WORKS_IN]->(c:Company) RETURN ID(d) as sourceId, ID(c) as targetId'
    );

    const relationships = result.records.map(record => ({
      source: record.get('sourceId').toNumber(),
      target: record.get('targetId').toNumber()
    }));

    return NextResponse.json({ 
      message: "Work relationships found successfully",
      data: relationships
    });
  } catch (error) {
    console.error('Error fetching work relationships:', error);
    return NextResponse.json(
      { error: 'Error fetching work relationships' },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}