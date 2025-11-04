// Custom Affirmations Management

export interface CustomAffirmation {
  id: string;
  text: string;
  category: 'accomplishment' | 'strength' | 'growth' | 'impact' | 'custom';
  tags: string[];
  createdAt: string;
  timesViewed: number;
  isFavorite: boolean;
}

const STORAGE_KEY = 'customAffirmations';

// Get all custom affirmations
export function getCustomAffirmations(): CustomAffirmation[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save custom affirmations
function saveCustomAffirmations(affirmations: CustomAffirmation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(affirmations));
}

// Create custom affirmation
export function createCustomAffirmation(
  text: string,
  category: CustomAffirmation['category'],
  tags: string[] = []
): CustomAffirmation {
  const affirmations = getCustomAffirmations();

  const newAffirmation: CustomAffirmation = {
    id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    text,
    category,
    tags,
    createdAt: new Date().toISOString(),
    timesViewed: 0,
    isFavorite: false
  };

  affirmations.push(newAffirmation);
  saveCustomAffirmations(affirmations);

  return newAffirmation;
}

// Update custom affirmation
export function updateCustomAffirmation(
  id: string,
  updates: Partial<Omit<CustomAffirmation, 'id' | 'createdAt'>>
): CustomAffirmation | null {
  const affirmations = getCustomAffirmations();
  const index = affirmations.findIndex(a => a.id === id);

  if (index === -1) return null;

  affirmations[index] = { ...affirmations[index], ...updates };
  saveCustomAffirmations(affirmations);

  return affirmations[index];
}

// Delete custom affirmation
export function deleteCustomAffirmation(id: string): boolean {
  const affirmations = getCustomAffirmations();
  const filtered = affirmations.filter(a => a.id !== id);

  if (filtered.length === affirmations.length) return false;

  saveCustomAffirmations(filtered);
  return true;
}

// Increment view count
export function incrementAffirmationViews(id: string): void {
  const affirmations = getCustomAffirmations();
  const affirmation = affirmations.find(a => a.id === id);

  if (affirmation) {
    affirmation.timesViewed++;
    saveCustomAffirmations(affirmations);
  }
}

// Toggle favorite
export function toggleAffirmationFavorite(id: string): boolean {
  const affirmations = getCustomAffirmations();
  const affirmation = affirmations.find(a => a.id === id);

  if (affirmation) {
    affirmation.isFavorite = !affirmation.isFavorite;
    saveCustomAffirmations(affirmations);
    return affirmation.isFavorite;
  }

  return false;
}

// Get affirmations by category
export function getCustomAffirmationsByCategory(category: CustomAffirmation['category']): CustomAffirmation[] {
  return getCustomAffirmations().filter(a => a.category === category);
}

// Get favorite affirmations
export function getFavoriteCustomAffirmations(): CustomAffirmation[] {
  return getCustomAffirmations().filter(a => a.isFavorite);
}

// Get most viewed affirmations
export function getMostViewedCustomAffirmations(limit: number = 5): CustomAffirmation[] {
  return getCustomAffirmations()
    .sort((a, b) => b.timesViewed - a.timesViewed)
    .slice(0, limit);
}

// Search custom affirmations
export function searchCustomAffirmations(query: string): CustomAffirmation[] {
  const lowerQuery = query.toLowerCase();
  return getCustomAffirmations().filter(a =>
    a.text.toLowerCase().includes(lowerQuery) ||
    a.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Get random custom affirmation
export function getRandomCustomAffirmation(): CustomAffirmation | null {
  const affirmations = getCustomAffirmations();

  if (affirmations.length === 0) return null;

  return affirmations[Math.floor(Math.random() * affirmations.length)];
}

// Get affirmation statistics
export function getCustomAffirmationStats() {
  const affirmations = getCustomAffirmations();

  return {
    total: affirmations.length,
    favorites: affirmations.filter(a => a.isFavorite).length,
    totalViews: affirmations.reduce((sum, a) => sum + a.timesViewed, 0),
    byCategory: {
      accomplishment: affirmations.filter(a => a.category === 'accomplishment').length,
      strength: affirmations.filter(a => a.category === 'strength').length,
      growth: affirmations.filter(a => a.category === 'growth').length,
      impact: affirmations.filter(a => a.category === 'impact').length,
      custom: affirmations.filter(a => a.category === 'custom').length,
    }
  };
}

// Import affirmations from text (one per line)
export function importAffirmationsFromText(text: string, category: CustomAffirmation['category'] = 'custom'): number {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  let imported = 0;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.length >= 10) { // Minimum length
      createCustomAffirmation(trimmed, category);
      imported++;
    }
  });

  return imported;
}

// Export affirmations as text
export function exportCustomAffirmationsAsText(): string {
  const affirmations = getCustomAffirmations();
  return affirmations.map(a => a.text).join('\n');
}

// Suggest tags based on affirmation text
export function suggestTagsForAffirmation(text: string): string[] {
  const lowerText = text.toLowerCase();
  const suggestions: string[] = [];

  const tagKeywords: Record<string, string[]> = {
    'confident': ['confident', 'confidence', 'self-assured'],
    'strong': ['strong', 'strength', 'powerful', 'resilient'],
    'capable': ['capable', 'able', 'skilled', 'competent'],
    'worthy': ['worthy', 'deserve', 'valuable', 'enough'],
    'successful': ['success', 'achieve', 'accomplish', 'win'],
    'creative': ['creative', 'innovative', 'imaginative'],
    'intelligent': ['smart', 'intelligent', 'wise', 'brilliant'],
    'loved': ['loved', 'appreciated', 'valued', 'cherished'],
    'brave': ['brave', 'courageous', 'fearless', 'bold'],
    'growing': ['grow', 'improve', 'progress', 'evolve'],
  };

  Object.entries(tagKeywords).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      suggestions.push(tag);
    }
  });

  return suggestions.slice(0, 5);
}
