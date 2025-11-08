'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, CheckSquare, Briefcase, Award } from 'lucide-react';
import type { JournalEntry } from '@/types/engagement';

interface PortfolioSection {
  id: string;
  title: string;
  included: boolean;
  entries: JournalEntry[];
}

interface KintsugiPortfolioGeneratorProps {
  entries: JournalEntry[];
  userName?: string;
  userProfession?: string;
}

export default function KintsugiPortfolioGenerator({
  entries,
  userName = 'Professional',
  userProfession = 'Your Role'
}: KintsugiPortfolioGeneratorProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'markdown' | 'html'>('pdf');
  const [selectedTemplate, setSelectedTemplate] = useState<'kintsugi-year' | 'resilience-resume' | 'growth-gallery'>('kintsugi-year');
  const [sections, setSections] = useState<PortfolioSection[]>([
    { id: 'accomplishments', title: 'Key Accomplishments', included: true, entries: [] },
    { id: 'challenges', title: 'Challenges Overcome', included: true, entries: [] },
    { id: 'skills', title: 'Skills Developed Through Adversity', included: true, entries: [] },
    { id: 'growth', title: 'Professional Growth Journey', included: true, entries: [] },
  ]);

  const toggleSection = (id: string) => {
    setSections(sections.map(s =>
      s.id === id ? { ...s, included: !s.included } : s
    ));
  };

  const generatePortfolio = () => {
    const includedSections = sections.filter(s => s.included);

    // Build portfolio content
    let content = `# ${selectedTemplate === 'kintsugi-year' ? 'My Kintsugi Year' : selectedTemplate === 'resilience-resume' ? 'Resilience Resume' : 'Growth Gallery'}\n\n`;
    content += `**${userName}** | ${userProfession}\n\n`;
    content += `*"Like the Japanese art of Kintsugi, where broken pottery is repaired with gold, my professional journey is enriched by the challenges I've faced and overcome."*\n\n`;
    content += `---\n\n`;

    includedSections.forEach(section => {
      content += `## ${section.title}\n\n`;

      if (section.id === 'accomplishments') {
        const wins = entries.filter(e => !isChallenge(e)).slice(0, 10);
        wins.forEach((entry, i) => {
          content += `${i + 1}. **${entry.accomplishment}**\n`;
          if (entry.reflection) {
            content += `   *${entry.reflection}*\n`;
          }
          content += `   *${new Date(entry.date).toLocaleDateString()}*\n\n`;
        });
      }

      if (section.id === 'challenges') {
        const challenges = entries.filter(e => isChallenge(e)).slice(0, 10);
        challenges.forEach((entry, i) => {
          content += `${i + 1}. **Challenge:** ${entry.accomplishment}\n`;
          if (entry.reflection) {
            content += `   **How I Grew:** ${entry.reflection}\n`;
          }
          content += `   *${new Date(entry.date).toLocaleDateString()}*\n\n`;
        });
      }

      if (section.id === 'skills') {
        content += `Through my challenges, I developed:\n\n`;
        content += `- **Resilience**: Recovered from setbacks and adapted to changing circumstances\n`;
        content += `- **Problem-Solving**: Found creative solutions under pressure\n`;
        content += `- **Emotional Intelligence**: Managed stress and maintained professionalism\n`;
        content += `- **Growth Mindset**: Learned from failures and continuously improved\n\n`;
      }

      if (section.id === 'growth') {
        content += `My journey demonstrates continuous growth:\n\n`;
        content += `- **Total Impact Entries**: ${entries.length}\n`;
        content += `- **Challenges Faced & Overcome**: ${entries.filter(e => isChallenge(e)).length}\n`;
        content += `- **Documented Growth Moments**: ${entries.filter(e => e.reflection).length}\n`;
        content += `- **Timeline**: ${new Date(entries[entries.length - 1]?.date || new Date()).toLocaleDateString()} - ${new Date().toLocaleDateString()}\n\n`;
      }

      content += `---\n\n`;
    });

    content += `## The Kintsugi Philosophy\n\n`;
    content += `This portfolio embraces the Japanese art of Kintsugi (金継ぎ), where broken pottery is repaired with gold lacquer, making it more beautiful and valuable than before. Similarly, the challenges I've faced have become integral parts of my professional story, adding depth, resilience, and unique strengths to my capabilities.\n\n`;
    content += `The cracks in my journey—represented by the challenges documented here—have been filled with the gold of learning, growth, and hard-won wisdom. I'm not the same professional I was when I started; I'm stronger, more adaptable, and more valuable because of—not in spite of—my struggles.\n`;

    // Download based on format
    downloadContent(content, selectedFormat);
  };

  const downloadContent = (content: string, format: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kintsugi-portfolio-${selectedTemplate}.${format === 'pdf' ? 'md' : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isChallenge = (entry: JournalEntry) => {
    const text = `${entry.accomplishment} ${entry.reflection || ''}`.toLowerCase();
    return ['difficult', 'struggle', 'challenge', 'hard', 'failed', 'problem'].some(word => text.includes(word));
  };

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-kintsugi-dark-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Kintsugi Portfolio Generator
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Professional portfolio from your journey
              </p>
            </div>
          </div>

          <button
            onClick={generatePortfolio}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Generate & Download
          </button>
        </div>
      </div>

      {/* Template Selection */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Choose Template:
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'kintsugi-year',
              title: 'My Kintsugi Year',
              description: 'Chronicle your annual journey',
              icon: Award
            },
            {
              id: 'resilience-resume',
              title: 'Resilience Resume',
              description: 'Emphasize growth through adversity',
              icon: Briefcase
            },
            {
              id: 'growth-gallery',
              title: 'Growth Gallery',
              description: 'Visual story of transformation',
              icon: FileText
            }
          ].map(template => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id as any)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedTemplate === template.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 flex-shrink-0 ${
                    selectedTemplate === template.id
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-500'
                  }`} />
                  <div>
                    <div className={`text-sm font-semibold ${
                      selectedTemplate === template.id
                        ? 'text-purple-900 dark:text-purple-200'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {template.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {template.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Format Selection */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Export Format:
        </label>

        <div className="flex gap-3">
          {(['pdf', 'markdown', 'html'] as const).map(format => (
            <button
              key={format}
              onClick={() => setSelectedFormat(format)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedFormat === format
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Section Toggles */}
      <div className="px-6 py-4">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Include Sections:
        </label>

        <div className="space-y-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {section.title}
              </span>

              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                section.included
                  ? 'bg-purple-600 border-purple-600'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {section.included && <CheckSquare className="h-3 w-3 text-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Stats */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{entries.length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Entries</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {sections.filter(s => s.included).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Sections Included</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {selectedFormat.toUpperCase()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Export Format</div>
          </div>
        </div>
      </div>

      {/* Philosophy Note */}
      <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-700 dark:text-gray-300">
          <span className="font-semibold">金継ぎ Kintsukuroi:</span> Export your complete story—
          wins AND growth from challenges—as a professional portfolio suitable for performance
          reviews, LinkedIn, or promotion discussions. Make vulnerability portfolio-worthy.
        </p>
      </div>
    </div>
  );
}
