import { NextResponse } from 'next/server';
import { getRandomBiasInsight } from '@/data/affirmations';

export async function GET() {
  const insight = getRandomBiasInsight();
  return NextResponse.json({ insight });
}
