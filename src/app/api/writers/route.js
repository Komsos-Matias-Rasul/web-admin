import { getDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDB();
    const result = await db.query(`
      SELECT id, writer_name 
      FROM writers 
      ORDER BY writer_name ASC
    `);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching writers:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch writers"
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { writer_name } = await request.json();
    
    if (!writer_name || typeof writer_name !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: "Writer name is required and must be a string"
        },
        { status: 400 }
      );
    }

    const trimmedName = writer_name.trim();
    if (trimmedName.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Writer name cannot be empty"
        },
        { status: 400 }
      );
    }

    if (trimmedName.length > 255) {
      return NextResponse.json(
        {
          success: false,
          error: "Writer name cannot exceed 255 characters"
        },
        { status: 400 }
      );
    }

    const db = await getDB();
    
    const existingWriter = await db.query(
      `SELECT id FROM writers WHERE LOWER(writer_name) = LOWER($1)`,
      [trimmedName]
    );

    if (existingWriter.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "A writer with this name already exists"
        },
        { status: 409 }
      );
    }

    const result = await db.query(
      `INSERT INTO writers (writer_name) 
       VALUES ($1) 
       RETURNING id, writer_name`,
      [trimmedName]
    );

    return NextResponse.json({
      success: true,
      message: "Writer added successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error creating writer:", error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        {
          success: false,
          error: "A writer with this name already exists"
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create writer"
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, writer_name } = await request.json();
    
    // Validation
    if (!id || !writer_name || typeof writer_name !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: "Writer ID and name are required"
        },
        { status: 400 }
      );
    }

    const trimmedName = writer_name.trim();
    if (trimmedName.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Writer name cannot be empty"
        },
        { status: 400 }
      );
    }

    if (trimmedName.length > 255) {
      return NextResponse.json(
        {
          success: false,
          error: "Writer name cannot exceed 255 characters"
        },
        { status: 400 }
      );
    }

    const db = await getDB();
    
    const existingWriter = await db.query(
      `SELECT id FROM writers WHERE LOWER(writer_name) = LOWER($1) AND id != $2`,
      [trimmedName, id]
    );

    if (existingWriter.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "A writer with this name already exists"
        },
        { status: 409 }
      );
    }

    const result = await db.query(
      `UPDATE writers 
       SET writer_name = $1 
       WHERE id = $2 
       RETURNING id, writer_name`,
      [trimmedName, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Writer not found"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Writer updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error updating writer:", error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        {
          success: false,
          error: "A writer with this name already exists"
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update writer"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Writer ID is required"
        },
        { status: 400 }
      );
    }

    const db = await getDB();
    
    // Check if writer is being used in articles (optional safety check)
    // Uncomment if you have an articles table with writer references
    /*
    const articlesUsingWriter = await db.query(
      `SELECT COUNT(*) as count FROM articles WHERE writer_id = $1`,
      [id]
    );

    if (parseInt(articlesUsingWriter.rows[0].count) > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete writer as they are assigned to existing articles"
        },
        { status: 409 }
      );
    }
    */

    const result = await db.query(
      `DELETE FROM writers WHERE id = $1 RETURNING id, writer_name`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Writer not found"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Writer deleted successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error deleting writer:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete writer"
      },
      { status: 500 }
    );
  }
}