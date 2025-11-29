/**
 * Smart Sentiment Analysis API
 * POST /api/smart/analyze-sentiment
 *
 * Hybrid approach: Local NLP first, LLM for deep analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  analyzeLocalSentiment,
  analyzeWithCulturalContext,
  SmartSentimentResult,
  CulturalContext,
} from '@/utils/smartSentiment';
import {
  complete,
  anonymizeText,
  isSmartEnabled,
  KINTSUGI_PROMPTS,
} from '@/utils/llmClient';

export interface SentimentRequest {
  text: string;
  culturalContext?: CulturalContext;
  useDeepAnalysis?: boolean;
}

export interface SentimentResponse {
  success: boolean;
  result?: SmartSentimentResult;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SentimentResponse>> {
  try {
    const body: SentimentRequest = await request.json();
    const { text, culturalContext, useDeepAnalysis } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Text is required',
      }, { status: 400 });
    }

    // Step 1: Local analysis (always runs - fast and free)
    let result: SmartSentimentResult;

    if (culturalContext) {
      result = analyzeWithCulturalContext(text, culturalContext);
    } else {
      result = analyzeLocalSentiment(text);
    }

    // Step 2: Deep analysis with LLM (optional, requires API key)
    if (useDeepAnalysis && isSmartEnabled()) {
      try {
        const anonymizedText = anonymizeText(text);

        const contextInfo = culturalContext
          ? `\nUser context: ${JSON.stringify(culturalContext)}`
          : '';

        const llmResponse = await complete([
          { role: 'system', content: KINTSUGI_PROMPTS.sentimentAnalysis },
          { role: 'user', content: `Analyze this reflection:${contextInfo}\n\n"${anonymizedText}"` },
        ]);

        // Parse LLM response and enhance local result
        try {
          const llmResult = JSON.parse(llmResponse.content);

          // Merge LLM insights with local analysis
          if (llmResult.insight) {
            result.culturalNotes = result.culturalNotes
              ? `${result.culturalNotes}\n\n${llmResult.insight}`
              : llmResult.insight;
          }

          // Update analysis method
          result.analysisMethod = 'hybrid';

          // Update confidence based on LLM analysis
          if (llmResult.confidence) {
            result.confidence = (result.confidence + llmResult.confidence) / 2;
          }
        } catch {
          // If LLM response isn't valid JSON, add as cultural note
          result.culturalNotes = result.culturalNotes
            ? `${result.culturalNotes}\n\n${llmResponse.content}`
            : llmResponse.content;
          result.analysisMethod = 'hybrid';
        }
      } catch (llmError) {
        // LLM failed, but we still have local analysis
        console.error('LLM analysis failed:', llmError);
        // Continue with local-only result
      }
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
