/**
 * Smart Bias Detection API
 * POST /api/smart/detect-bias
 *
 * Detects cognitive biases with cultural awareness and provides gentle reframes
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  complete,
  anonymizeText,
  isSmartEnabled,
  KINTSUGI_PROMPTS,
} from '@/utils/llmClient';
import { CulturalContext } from '@/utils/smartSentiment';

// Common bias patterns for local detection
const BIAS_PATTERNS = {
  imposterSyndrome: {
    patterns: [
      /\bjust\s+(got\s+)?luck/i,
      /\bdon'?t\s+deserve/i,
      /\banyone\s+(could|would)/i,
      /\bfake\s+it/i,
      /\bnot\s+(qualified|smart|good)\s+enough/i,
      /\bwill\s+find\s+out/i,
    ],
    name: 'Imposter Syndrome',
    reframe: "Your success isn't luck - it's the result of your skills, effort, and preparation. What specific actions did you take that contributed?",
  },
  discountingPositives: {
    patterns: [
      /\bit'?s?\s+(not\s+)?(a\s+)?big\s+deal/i,
      /\banyone\s+could\s+have/i,
      /\bit\s+was\s+nothing/i,
      /\bjust\s+(doing|did)\s+my\s+job/i,
      /\bno\s+big\s+deal/i,
    ],
    name: 'Discounting Positives',
    reframe: "What feels routine to you might be remarkable to others. Consider: if a colleague accomplished this, would you dismiss it?",
  },
  catastrophizing: {
    patterns: [
      /\bruined?\s+everything/i,
      /\bnever\s+(recover|bounce\s+back)/i,
      /\bworst\s+thing/i,
      /\bdisaster/i,
      /\bcareer\s+(is\s+)?over/i,
      /\bno\s+way\s+(out|forward)/i,
    ],
    name: 'Catastrophizing',
    reframe: "Let's zoom out: What's the most realistic outcome? Often our fears paint a picture darker than reality. What evidence supports a better outcome?",
  },
  allOrNothing: {
    patterns: [
      /\bcomplete(ly)?\s+fail/i,
      /\btotal\s+(disaster|failure)/i,
      /\balways\s+(mess|screw)/i,
      /\bnever\s+(get\s+it\s+right|succeed)/i,
      /\b(perfect|nothing)/i,
    ],
    name: 'All-or-Nothing Thinking',
    reframe: "Success and failure exist on a spectrum. What parts went well, even if the whole wasn't perfect? Growth lives in the gray areas.",
  },
  mindReading: {
    patterns: [
      /\bthey\s+(probably\s+)?(think|thought)/i,
      /\beveryone\s+(thinks|knows)/i,
      /\bpeople\s+(must|probably)\s+think/i,
      /\bI\s+know\s+(they|she|he)\s+thinks/i,
    ],
    name: 'Mind Reading',
    reframe: "We often assume we know what others think, but we can't actually read minds. What evidence do you have? Have you asked directly?",
  },
  shouldStatements: {
    patterns: [
      /\bshould\s+have/i,
      /\bmust\s+be\s+(better|perfect|more)/i,
      /\bought\s+to/i,
      /\bhave\s+to\s+be\s+perfect/i,
    ],
    name: 'Should Statements',
    reframe: "Replace 'should' with 'could' or 'want to.' This shifts from self-criticism to self-compassion and opens up possibilities.",
  },
};

export interface BiasDetectionRequest {
  text: string;
  culturalContext?: CulturalContext;
}

export interface DetectedBias {
  biasType: string;
  originalThought: string;
  reframe: string;
  kintsugiConnection: string;
  confidence: number;
}

export interface BiasDetectionResponse {
  success: boolean;
  biasDetected: boolean;
  biases?: DetectedBias[];
  error?: string;
  source: 'local' | 'smart';
}

export async function POST(request: NextRequest): Promise<NextResponse<BiasDetectionResponse>> {
  try {
    const body: BiasDetectionRequest = await request.json();
    const { text, culturalContext } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({
        success: false,
        biasDetected: false,
        error: 'Text is required',
        source: 'local',
      }, { status: 400 });
    }

    // First, try local detection
    const localBiases = detectLocalBiases(text, culturalContext);

    // If Smart features are enabled, enhance with LLM
    if (isSmartEnabled() && localBiases.length > 0) {
      try {
        const anonymizedText = anonymizeText(text);

        const contextInfo = culturalContext
          ? `\nCultural context: ${JSON.stringify(culturalContext)}`
          : '';

        const prompt = `Analyze this reflection for cognitive biases:${contextInfo}

"${anonymizedText}"

Local analysis detected: ${localBiases.map(b => b.biasType).join(', ')}

For each bias detected, provide a gentle, supportive reframe that:
1. Validates the feeling
2. Offers a new perspective
3. Connects to Kintsugi philosophy (cracks becoming gold)

${culturalContext?.collectivistOrientation ?
  "Note: User has collectivist orientation - 'we' language is a strength, not deflection." : ''}

${culturalContext?.isFirstGen ?
  "Note: User is first-generation professional - acknowledge the extra significance of their achievements." : ''}`;

        const llmResponse = await complete([
          { role: 'system', content: KINTSUGI_PROMPTS.biasDetection },
          { role: 'user', content: prompt },
        ]);

        // Try to parse LLM response and enhance local biases
        const enhancedBiases = enhanceBiasesWithLLM(localBiases, llmResponse.content);

        return NextResponse.json({
          success: true,
          biasDetected: true,
          biases: enhancedBiases,
          source: 'smart',
        });
      } catch (llmError) {
        console.error('LLM bias detection failed:', llmError);
        // Fall back to local biases
      }
    }

    // Return local-only results
    if (localBiases.length > 0) {
      return NextResponse.json({
        success: true,
        biasDetected: true,
        biases: localBiases,
        source: 'local',
      });
    }

    // No biases detected
    return NextResponse.json({
      success: true,
      biasDetected: false,
      source: 'local',
    });
  } catch (error) {
    console.error('Bias detection error:', error);
    return NextResponse.json({
      success: false,
      biasDetected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'local',
    }, { status: 500 });
  }
}

/**
 * Detect biases using local pattern matching
 */
function detectLocalBiases(text: string, culturalContext?: CulturalContext): DetectedBias[] {
  const detectedBiases: DetectedBias[] = [];

  for (const [key, bias] of Object.entries(BIAS_PATTERNS)) {
    for (const pattern of bias.patterns) {
      const match = text.match(pattern);
      if (match) {
        // Skip "just got lucky" for first-gen professionals - needs more context
        if (key === 'imposterSyndrome' && culturalContext?.isFirstGen) {
          // Still detect but adjust the reframe
          detectedBiases.push({
            biasType: bias.name,
            originalThought: match[0],
            reframe: "As a first-generation professional, your achievements are even more remarkable. 'Luck' is often how we minimize the real effort and courage it took to get here.",
            kintsugiConnection: "In Kintsugi, every crack tells a story of survival. Your journey - including the obstacles you've overcome - makes your success more valuable, not less.",
            confidence: 0.7,
          });
        } else {
          detectedBiases.push({
            biasType: bias.name,
            originalThought: match[0],
            reframe: bias.reframe,
            kintsugiConnection: getKintsugiConnectionForBias(key),
            confidence: 0.8,
          });
        }
        break; // Only one match per bias type
      }
    }
  }

  return detectedBiases;
}

/**
 * Get Kintsugi-themed connection for each bias type
 */
function getKintsugiConnectionForBias(biasKey: string): string {
  const connections: Record<string, string> = {
    imposterSyndrome: "The Kintsugi master doesn't hide their experience - they celebrate it with gold. Your journey, including doubts, is part of your valuable story.",
    discountingPositives: "In Kintsugi, no repair is 'just' anything - each golden seam is celebrated. Your wins deserve the same recognition.",
    catastrophizing: "A cracked vessel isn't ruined - it's an opportunity for beautiful repair. This challenge is where your gold will go.",
    allOrNothing: "Kintsugi teaches us that beauty exists in imperfection. A vessel with one crack can still be stunning.",
    mindReading: "The Kintsugi philosophy focuses on your own journey, not what others might think of your cracks.",
    shouldStatements: "There's no 'should' in Kintsugi - only what is, and how we transform it with gold.",
  };

  return connections[biasKey] || "Every challenge is an opportunity for golden repair.";
}

/**
 * Enhance local bias detection with LLM insights
 */
function enhanceBiasesWithLLM(localBiases: DetectedBias[], llmContent: string): DetectedBias[] {
  // Try to extract reframes from LLM response
  const lines = llmContent.split('\n');

  return localBiases.map(bias => {
    // Look for a line mentioning this bias type
    const relevantLine = lines.find(line =>
      line.toLowerCase().includes(bias.biasType.toLowerCase())
    );

    if (relevantLine) {
      // Find the reframe that follows
      const lineIndex = lines.indexOf(relevantLine);
      const reframeLine = lines.slice(lineIndex + 1, lineIndex + 4).join(' ');

      if (reframeLine && reframeLine.length > 20) {
        return {
          ...bias,
          reframe: reframeLine.trim(),
          confidence: 0.9,
        };
      }
    }

    return bias;
  });
}
