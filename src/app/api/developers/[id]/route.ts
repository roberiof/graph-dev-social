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
      'MATCH (d:Developer) WHERE ID(d) = $id RETURN d',
      { id }  
    );

    if (result.records.length === 0) {
      return NextResponse.json(
        { error: 'Developer not found' },
        { status: 404 }
      );
    }

    await session.run(
      'MATCH (d:Developer) WHERE ID(d) = $id DETACH DELETE d',
      { id }
    );

    return NextResponse.json({ 
      message: 'Developer deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting developer:', error);
    return NextResponse.json(
      { error: 'Error deleting developer' }, 
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}
