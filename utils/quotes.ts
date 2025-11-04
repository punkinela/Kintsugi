// Quote of the Day System

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: 'motivation' | 'growth' | 'confidence' | 'resilience' | 'empowerment' | 'wisdom';
  tags: string[];
}

const QUOTES: Quote[] = [
  // Motivation
  { id: '1', text: 'Your potential is endless.', author: 'Unknown', category: 'motivation', tags: ['potential', 'growth'] },
  { id: '2', text: 'Every accomplishment starts with the decision to try.', author: 'John F. Kennedy', category: 'motivation', tags: ['action', 'courage'] },
  { id: '3', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'motivation', tags: ['passion', 'excellence'] },

  // Growth
  { id: '4', text: 'Growth is painful. Change is painful. But nothing is as painful as staying stuck somewhere you don\'t belong.', author: 'Mandy Hale', category: 'growth', tags: ['change', 'courage'] },
  { id: '5', text: 'Your life does not get better by chance, it gets better by change.', author: 'Jim Rohn', category: 'growth', tags: ['change', 'action'] },
  { id: '6', text: 'The only person you are destined to become is the person you decide to be.', author: 'Ralph Waldo Emerson', category: 'growth', tags: ['choice', 'identity'] },

  // Confidence
  { id: '7', text: 'You are enough just as you are.', author: 'Meghan Markle', category: 'confidence', tags: ['self-worth', 'acceptance'] },
  { id: '8', text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', category: 'confidence', tags: ['belief', 'mindset'] },
  { id: '9', text: 'You are braver than you believe, stronger than you seem, and smarter than you think.', author: 'A.A. Milne', category: 'confidence', tags: ['strength', 'courage'] },

  // Resilience
  { id: '10', text: 'Fall seven times, stand up eight.', author: 'Japanese Proverb', category: 'resilience', tags: ['perseverance', 'strength'] },
  { id: '11', text: 'It is not the strongest who survive, but those most adaptable to change.', author: 'Charles Darwin', category: 'resilience', tags: ['adaptability', 'survival'] },
  { id: '12', text: 'Rock bottom became the solid foundation on which I rebuilt my life.', author: 'J.K. Rowling', category: 'resilience', tags: ['recovery', 'foundation'] },

  // Empowerment
  { id: '13', text: 'No one can make you feel inferior without your consent.', author: 'Eleanor Roosevelt', category: 'empowerment', tags: ['self-worth', 'power'] },
  { id: '14', text: 'The most common way people give up their power is by thinking they don\'t have any.', author: 'Alice Walker', category: 'empowerment', tags: ['power', 'awareness'] },
  { id: '15', text: 'Your voice matters. Your story matters. Your contribution matters.', author: 'Unknown', category: 'empowerment', tags: ['voice', 'impact'] },

  // Wisdom
  { id: '16', text: 'The only true wisdom is in knowing you know nothing.', author: 'Socrates', category: 'wisdom', tags: ['humility', 'learning'] },
  { id: '17', text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein', category: 'wisdom', tags: ['opportunity', 'perspective'] },
  { id: '18', text: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde', category: 'wisdom', tags: ['authenticity', 'individuality'] },

  // Additional quotes
  { id: '19', text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', category: 'resilience', tags: ['courage', 'perseverance'] },
  { id: '20', text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt', category: 'motivation', tags: ['dreams', 'future'] },
  { id: '21', text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.', author: 'Ralph Waldo Emerson', category: 'empowerment', tags: ['inner-strength', 'perspective'] },
  { id: '22', text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson', category: 'motivation', tags: ['persistence', 'action'] },
  { id: '23', text: 'You must be the change you wish to see in the world.', author: 'Mahatma Gandhi', category: 'empowerment', tags: ['change', 'leadership'] },
  { id: '24', text: 'Life is 10% what happens to you and 90% how you react to it.', author: 'Charles R. Swindoll', category: 'wisdom', tags: ['mindset', 'choice'] },
];

// Get quote of the day (deterministic based on date)
export function getQuoteOfTheDay(): Quote {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % QUOTES.length;
  return QUOTES[index];
}

// Get random quote
export function getRandomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

// Get quotes by category
export function getQuotesByCategory(category: Quote['category']): Quote[] {
  return QUOTES.filter(q => q.category === category);
}

// Get all quotes
export function getAllQuotes(): Quote[] {
  return QUOTES;
}

// Search quotes
export function searchQuotes(query: string): Quote[] {
  const lowerQuery = query.toLowerCase();
  return QUOTES.filter(q =>
    q.text.toLowerCase().includes(lowerQuery) ||
    q.author.toLowerCase().includes(lowerQuery) ||
    q.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Save favorite quote
export function saveFavoriteQuote(quoteId: string): void {
  const favorites = getFavoriteQuotes();
  if (!favorites.includes(quoteId)) {
    favorites.push(quoteId);
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
  }
}

// Remove favorite quote
export function removeFavoriteQuote(quoteId: string): void {
  const favorites = getFavoriteQuotes();
  const filtered = favorites.filter(id => id !== quoteId);
  localStorage.setItem('favoriteQuotes', JSON.stringify(filtered));
}

// Get favorite quotes
export function getFavoriteQuotes(): string[] {
  const stored = localStorage.getItem('favoriteQuotes');
  return stored ? JSON.parse(stored) : [];
}

// Check if quote is favorite
export function isQuoteFavorite(quoteId: string): boolean {
  return getFavoriteQuotes().includes(quoteId);
}

// Get favorite quote objects
export function getFavoriteQuoteObjects(): Quote[] {
  const favoriteIds = getFavoriteQuotes();
  return QUOTES.filter(q => favoriteIds.includes(q.id));
}
