import driver from '@/lib/neo4j';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = driver.session();

  try {
    const id = parseInt((await params).id);

    const result = await session.run(
      'MATCH (c:Company) WHERE ID(c) = $id RETURN c',
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    await session.run(
      'MATCH (c:Company) WHERE ID(c) = $id DETACH DELETE c',
      { id }
    );

    return NextResponse.json({ 
      message: 'Company deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Error deleting company' }, 
      { status: 500 }
    );
  } finally {
    await session.close();
  }
} 