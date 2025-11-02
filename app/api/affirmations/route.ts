import { NextRequest, NextResponse } from 'next/server';
import { getPersonalizedAffirmations } from '@/data/affirmations';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gender = searchParams.get('gender') || undefined;
  const ethnicity = searchParams.get('ethnicity') || undefined;
  const count = parseInt(searchParams.get('count') || '5');

  const affirmations = getPersonalizedAffirmations(
    { gender, ethnicity },
    count
  );

  return NextResponse.json({ affirmations });
}
