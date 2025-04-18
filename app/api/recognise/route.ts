// app/api/recognise/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { analyseImageWith } from '../../../lib/ollama';

export async function POST(req: NextRequest) {
  try {
    const { image } = (await req.json()) as { image: string };
    const { ingredients, recipes } = await analyseImageWith(image);

    return NextResponse.json({ ingredients, recipes });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
