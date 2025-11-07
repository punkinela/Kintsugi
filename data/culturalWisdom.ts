/**
 * Culturally-Aligned Wisdom Quotes
 * Personalized based on user demographics (ethnicity, gender, profession)
 * Aligns with Kintsugi philosophy of transforming challenges into strength
 */

export interface CulturalQuote {
  id: string;
  text: string;
  author: string;
  origin: string; // Cultural origin
  translation?: string; // Original language if applicable
  relevantFor: {
    ethnicities?: string[]; // Match user ethnicity
    genders?: string[]; // Match user gender
    professions?: string[]; // Match user profession
    universal?: boolean; // Show to everyone
  };
  theme: 'resilience' | 'strength' | 'wisdom' | 'transformation' | 'advocacy' | 'community';
  kintsugiConnection: string; // How it relates to Kintsugi philosophy
}

export const CULTURAL_WISDOM: CulturalQuote[] = [
  // African Wisdom
  {
    id: 'african-1',
    text: 'If you want to go fast, go alone. If you want to go far, go together.',
    author: 'African Proverb',
    origin: 'African',
    relevantFor: {
      ethnicities: ['African', 'Black or African American', 'Caribbean'],
      universal: true
    },
    theme: 'community',
    kintsugiConnection: 'Just as broken pottery is made whole through golden repair, our collective strength comes from supporting each other through challenges.'
  },
  {
    id: 'african-2',
    text: 'Smooth seas do not make skillful sailors.',
    author: 'African Proverb',
    origin: 'African',
    relevantFor: {
      ethnicities: ['African', 'Black or African American'],
      universal: true
    },
    theme: 'resilience',
    kintsugiConnection: 'The cracks in pottery—like challenges in life—create the opportunity for golden transformation.'
  },
  {
    id: 'african-3',
    text: 'I am because we are.',
    author: 'Ubuntu Philosophy',
    origin: 'Southern African',
    translation: 'Ubuntu',
    relevantFor: {
      ethnicities: ['African', 'Black or African American'],
      universal: true
    },
    theme: 'community',
    kintsugiConnection: 'Our individual repairs are strengthened by the golden threads of community support.'
  },

  // Asian Wisdom
  {
    id: 'asian-1',
    text: 'Fall down seven times, stand up eight.',
    author: 'Japanese Proverb',
    origin: 'Japanese',
    translation: '七転び八起き (Nana korobi ya oki)',
    relevantFor: {
      ethnicities: ['Asian', 'Japanese', 'East Asian'],
      universal: true
    },
    theme: 'resilience',
    kintsugiConnection: 'The essence of Kintsugi—each fall is an opportunity to rise stronger, with golden seams of wisdom.'
  },
  {
    id: 'asian-2',
    text: 'A gem cannot be polished without friction, nor a person perfected without trials.',
    author: 'Chinese Proverb',
    origin: 'Chinese',
    relevantFor: {
      ethnicities: ['Asian', 'Chinese', 'East Asian'],
      universal: true
    },
    theme: 'transformation',
    kintsugiConnection: 'Friction creates the cracks; gold fills them to create something more valuable.'
  },
  {
    id: 'asian-3',
    text: 'The bamboo that bends is stronger than the oak that resists.',
    author: 'Japanese Proverb',
    origin: 'Japanese',
    relevantFor: {
      ethnicities: ['Asian', 'Japanese', 'East Asian'],
      universal: true
    },
    theme: 'resilience',
    kintsugiConnection: 'Flexibility in adversity, like gold flowing into cracks, creates lasting strength.'
  },
  {
    id: 'asian-4',
    text: 'When the flower blooms, the bees come uninvited.',
    author: 'Korean Proverb',
    origin: 'Korean',
    relevantFor: {
      ethnicities: ['Asian', 'Korean', 'East Asian'],
      universal: true
    },
    theme: 'advocacy',
    kintsugiConnection: 'When you repair yourself with gold and let your light shine, opportunities find you.'
  },

  // Indigenous/Native American Wisdom
  {
    id: 'indigenous-1',
    text: 'We do not inherit the earth from our ancestors, we borrow it from our children.',
    author: 'Native American Proverb',
    origin: 'Native American',
    relevantFor: {
      ethnicities: ['Native American or Alaska Native', 'Indigenous'],
      universal: true
    },
    theme: 'wisdom',
    kintsugiConnection: 'Each generation repairs the cracks left by the last, passing forward a legacy of golden strength.'
  },
  {
    id: 'indigenous-2',
    text: 'Listen to the wind, it talks. Listen to the silence, it speaks. Listen to your heart, it knows.',
    author: 'Native American Proverb',
    origin: 'Native American',
    relevantFor: {
      ethnicities: ['Native American or Alaska Native', 'Indigenous'],
      universal: true
    },
    theme: 'wisdom',
    kintsugiConnection: 'Inner wisdom knows where the cracks are—and where the gold belongs.'
  },

  // Latinx/Hispanic Wisdom
  {
    id: 'latinx-1',
    text: 'They tried to bury us. They didn\'t know we were seeds.',
    author: 'Mexican Proverb',
    origin: 'Mexican',
    translation: 'Quisieron enterrarnos, no sabían que éramos semillas',
    relevantFor: {
      ethnicities: ['Hispanic or Latino', 'Mexican', 'Central American', 'South American'],
      universal: true
    },
    theme: 'resilience',
    kintsugiConnection: 'What seems like destruction is actually the beginning of golden transformation.'
  },
  {
    id: 'latinx-2',
    text: 'El que no arriesga, no gana.',
    author: 'Spanish Proverb',
    origin: 'Spanish/Latin American',
    translation: 'Nothing ventured, nothing gained',
    relevantFor: {
      ethnicities: ['Hispanic or Latino', 'Spanish'],
      universal: true
    },
    theme: 'advocacy',
    kintsugiConnection: 'Taking risks may create cracks, but they become the channels for golden opportunities.'
  },
  {
    id: 'latinx-3',
    text: 'In a world where you can be anything, be kind.',
    author: 'Latin American Wisdom',
    origin: 'Latin American',
    relevantFor: {
      ethnicities: ['Hispanic or Latino'],
      universal: true
    },
    theme: 'community',
    kintsugiConnection: 'Kindness is the gold that repairs not just ourselves, but our communities.'
  },

  // Middle Eastern Wisdom
  {
    id: 'middle-eastern-1',
    text: 'The wound is the place where the light enters you.',
    author: 'Rumi',
    origin: 'Persian/Sufi',
    relevantFor: {
      ethnicities: ['Middle Eastern', 'Persian', 'Arab'],
      universal: true
    },
    theme: 'transformation',
    kintsugiConnection: 'The perfect expression of Kintsugi—cracks are where transformation begins.'
  },
  {
    id: 'middle-eastern-2',
    text: 'Patience is the key to relief.',
    author: 'Arabic Proverb',
    origin: 'Arabic',
    translation: 'الصبر مفتاح الفرج (As-sabr miftah al-faraj)',
    relevantFor: {
      ethnicities: ['Middle Eastern', 'Arab', 'North African'],
      universal: true
    },
    theme: 'resilience',
    kintsugiConnection: 'Gold takes time to settle into cracks—patience in healing creates lasting strength.'
  },

  // South Asian Wisdom
  {
    id: 'south-asian-1',
    text: 'The lotus flower blooms most beautifully from the deepest and thickest mud.',
    author: 'Buddhist Wisdom',
    origin: 'South Asian/Buddhist',
    relevantFor: {
      ethnicities: ['Asian', 'South Asian', 'Indian', 'Buddhist'],
      universal: true
    },
    theme: 'transformation',
    kintsugiConnection: 'Like the lotus, Kintsugi teaches that beauty emerges from difficulty.'
  },
  {
    id: 'south-asian-2',
    text: 'When you change the way you look at things, the things you look at change.',
    author: 'Ancient Vedic Wisdom',
    origin: 'Indian/Hindu',
    relevantFor: {
      ethnicities: ['South Asian', 'Indian', 'Hindu'],
      universal: true
    },
    theme: 'wisdom',
    kintsugiConnection: 'Seeing cracks as opportunities for gold changes everything.'
  },

  // Pacific Islander Wisdom
  {
    id: 'pacific-1',
    text: 'The ocean connects us all.',
    author: 'Pacific Islander Proverb',
    origin: 'Pacific Islander',
    relevantFor: {
      ethnicities: ['Native Hawaiian or Pacific Islander', 'Pacific Islander'],
      universal: true
    },
    theme: 'community',
    kintsugiConnection: 'Like golden seams connecting pottery pieces, we are all connected in our healing.'
  },

  // Gender-Specific Wisdom
  {
    id: 'women-1',
    text: 'Well-behaved women seldom make history.',
    author: 'Laurel Thatcher Ulrich',
    origin: 'American',
    relevantFor: {
      genders: ['Female', 'Woman', 'Non-binary'],
      universal: false
    },
    theme: 'advocacy',
    kintsugiConnection: 'Breaking rules may create cracks, but those cracks become channels for changing the world.'
  },
  {
    id: 'women-2',
    text: 'I am not free while any woman is unfree, even when her shackles are very different from my own.',
    author: 'Audre Lorde',
    origin: 'American/Feminist',
    relevantFor: {
      genders: ['Female', 'Woman', 'Non-binary'],
      ethnicities: ['Black or African American'],
      universal: false
    },
    theme: 'community',
    kintsugiConnection: 'We repair each other with golden threads of solidarity and mutual support.'
  },
  {
    id: 'women-3',
    text: 'You may not control all the events that happen to you, but you can decide not to be reduced by them.',
    author: 'Maya Angelou',
    origin: 'American',
    relevantFor: {
      genders: ['Female', 'Woman', 'Non-binary'],
      ethnicities: ['Black or African American'],
      universal: true
    },
    theme: 'resilience',
    kintsugiConnection: 'Challenges don\'t diminish us—they create space for golden growth.'
  },

  // Professional Wisdom
  {
    id: 'tech-1',
    text: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay',
    origin: 'American/Tech',
    relevantFor: {
      professions: ['Software Engineer', 'Developer', 'Tech', 'Engineer'],
      universal: true
    },
    theme: 'advocacy',
    kintsugiConnection: 'Build your future by filling your career cracks with golden achievements.'
  },
  {
    id: 'leadership-1',
    text: 'Leadership is not about being in charge. It is about taking care of those in your charge.',
    author: 'Simon Sinek',
    origin: 'American/Leadership',
    relevantFor: {
      professions: ['Manager', 'Director', 'Executive', 'Leader', 'CEO'],
      universal: true
    },
    theme: 'community',
    kintsugiConnection: 'Great leaders use gold to repair not just themselves, but their entire teams.'
  },
  {
    id: 'creative-1',
    text: 'Creativity is intelligence having fun.',
    author: 'Albert Einstein',
    origin: 'German/Science',
    relevantFor: {
      professions: ['Designer', 'Artist', 'Creative', 'Writer'],
      universal: true
    },
    theme: 'transformation',
    kintsugiConnection: 'Creativity transforms broken pieces into golden masterpieces.'
  },

  // Universal Wisdom
  {
    id: 'universal-1',
    text: 'What doesn\'t kill you makes you stronger.',
    author: 'Friedrich Nietzsche',
    origin: 'German/Philosophy',
    relevantFor: {
      universal: true
    },
    theme: 'resilience',
    kintsugiConnection: 'Survival creates cracks; wisdom fills them with gold.'
  },
  {
    id: 'universal-2',
    text: 'Be yourself; everyone else is already taken.',
    author: 'Oscar Wilde',
    origin: 'Irish',
    relevantFor: {
      universal: true
    },
    theme: 'advocacy',
    kintsugiConnection: 'Your unique cracks and golden repairs make you irreplaceable.'
  },
  {
    id: 'universal-3',
    text: 'The only way out is through.',
    author: 'Robert Frost',
    origin: 'American',
    relevantFor: {
      universal: true
    },
    theme: 'resilience',
    kintsugiConnection: 'You must go through the breaking to get to the golden repair.'
  }
];

/**
 * Get personalized wisdom based on user demographics
 */
export function getPersonalizedWisdom(userProfile: {
  ethnicity?: string;
  gender?: string;
  profession?: string;
}): CulturalQuote[] {
  return CULTURAL_WISDOM.filter(quote => {
    // Universal quotes always match
    if (quote.relevantFor.universal) return true;

    // Check ethnicity match
    if (userProfile.ethnicity && quote.relevantFor.ethnicities) {
      if (quote.relevantFor.ethnicities.includes(userProfile.ethnicity)) {
        return true;
      }
    }

    // Check gender match
    if (userProfile.gender && quote.relevantFor.genders) {
      if (quote.relevantFor.genders.includes(userProfile.gender)) {
        return true;
      }
    }

    // Check profession match
    if (userProfile.profession && quote.relevantFor.professions) {
      const professionMatch = quote.relevantFor.professions.some(prof =>
        userProfile.profession?.toLowerCase().includes(prof.toLowerCase())
      );
      if (professionMatch) return true;
    }

    return false;
  });
}

/**
 * Get wisdom of the day (personalized)
 */
export function getWisdomOfTheDay(userProfile: {
  ethnicity?: string;
  gender?: string;
  profession?: string;
}): CulturalQuote {
  const personalizedQuotes = getPersonalizedWisdom(userProfile);
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % personalizedQuotes.length;
  return personalizedQuotes[index];
}

/**
 * Get wisdom by theme
 */
export function getWisdomByTheme(theme: CulturalQuote['theme']): CulturalQuote[] {
  return CULTURAL_WISDOM.filter(q => q.theme === theme);
}
