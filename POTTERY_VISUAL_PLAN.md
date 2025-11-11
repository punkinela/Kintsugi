# Pottery Visual Feature - Progressive Kintsugi Journey

## 🏺 Concept Overview

**User picks their pottery vessel** → As they make progress, **cracks appear and get filled with gold** → Visual representation of their Kintsugi transformation journey.

---

## Design Vision

### Initial State (Newcomer)
```
┌─────────────────────────────────┐
│                                 │
│        [Pottery Image]          │
│     Perfect, unbroken vessel    │
│                                 │
│   "Welcome to your journey"     │
│   "Every crack will become      │
│   a golden seam"                │
│                                 │
└─────────────────────────────────┘
```

### Mid-Journey (Active User)
```
┌─────────────────────────────────┐
│                                 │
│     [Pottery with cracks]       │
│   Some cracks filled with gold  │
│   Some still being repaired     │
│                                 │
│   "5 cracks filled with gold"   │
│   "Your transformation is       │
│   taking shape"                 │
│                                 │
└─────────────────────────────────┘
```

### Mature State (Veteran User)
```
┌─────────────────────────────────┐
│                                 │
│  [Fully golden-veined pottery]  │
│   Beautiful Kintsugi masterpiece│
│                                 │
│   "24 golden seams"             │
│   "Your breaks made you         │
│   irreplaceable"                │
│                                 │
└─────────────────────────────────┘
```

---

## Implementation Approach

### Option 1: SVG-Based (Recommended)
**Pros**:
- Full control over animation
- Can dynamically add/remove cracks
- Lightweight and scalable
- Easy to style golden seams

**Cons**:
- Requires creating SVG vessel templates

**Technical**:
```tsx
<svg viewBox="0 0 200 300" className="pottery-vessel">
  {/* Base vessel shape */}
  <path d="M50,50 Q100,20 150,50 L140,250 Q100,280 60,250 Z"
        fill="#8B7355" stroke="#5D4E37" />

  {/* Cracks (appear based on challenges) */}
  {cracks.map((crack, i) => (
    <path
      key={i}
      d={crack.path}
      stroke={crack.isFilled ? "#D4AF37" : "#333"}
      strokeWidth={crack.isFilled ? "3" : "1"}
      className="crack-line"
    />
  ))}

  {/* Gold fill animation */}
  {cracks.filter(c => c.isFilled).map((crack, i) => (
    <path
      key={`gold-${i}`}
      d={crack.path}
      stroke="#D4AF37"
      strokeWidth="4"
      className="animate-gold-flow"
    />
  ))}
</svg>
```

### Option 2: Canvas-Based
**Pros**:
- More complex animations possible
- Particle effects for gold dust

**Cons**:
- Heavier performance-wise
- Less accessible

### Option 3: Pre-Rendered Images + Overlay
**Pros**:
- Beautiful, artistic pottery images
- Easier to implement initially

**Cons**:
- Limited customization
- Larger file sizes

---

## Pottery Selection Feature

### Gallery of Pottery Styles

```tsx
const POTTERY_STYLES = [
  {
    id: 'bowl',
    name: 'Tea Bowl',
    description: 'Classic Japanese chawan',
    image: '/pottery/bowl.svg',
    crackPattern: 'radial' // Cracks radiate from center
  },
  {
    id: 'vase',
    name: 'Tall Vase',
    description: 'Elegant vertical vessel',
    image: '/pottery/vase.svg',
    crackPattern: 'vertical' // Vertical stress cracks
  },
  {
    id: 'plate',
    name: 'Serving Plate',
    description: 'Wide, flat surface',
    image: '/pottery/plate.svg',
    crackPattern: 'spiderweb' // Web-like cracks
  },
  {
    id: 'jar',
    name: 'Storage Jar',
    description: 'Round, grounded form',
    image: '/pottery/jar.svg',
    crackPattern: 'horizontal' // Horizontal bands
  }
];
```

### Selection UI
```tsx
<div className="pottery-selection">
  <h3>Choose Your Vessel</h3>
  <p>Select the pottery that resonates with your journey</p>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {POTTERY_STYLES.map(style => (
      <button
        key={style.id}
        onClick={() => setSelectedPottery(style.id)}
        className={`pottery-option ${
          selectedPottery === style.id ? 'selected' : ''
        }`}
      >
        <img src={style.image} alt={style.name} />
        <h4>{style.name}</h4>
        <p>{style.description}</p>
      </button>
    ))}
  </div>
</div>
```

---

## Crack & Gold Logic

### When Do Cracks Appear?

```typescript
interface Crack {
  id: string;
  position: { x: number; y: number };
  path: string; // SVG path
  createdAt: Date;
  trigger: 'challenge' | 'setback' | 'difficult-mood';
  isFilled: boolean;
  fillPercentage: number; // 0-100
  associatedEntry?: string; // Journal entry ID
}

// Triggers for new cracks:
- User logs entry with mood: 'challenging' or 'difficult'
- User marks accomplishment as overcoming a setback
- User completes "challenge" type entry
- Manual: User can add a crack for past struggles

// Example:
function addCrack(entry: JournalEntry): Crack {
  return {
    id: generateId(),
    position: getNextCrackPosition(potteryStyle, existingCracks),
    path: generateCrackPath(potteryStyle, position),
    createdAt: new Date(),
    trigger: 'challenge',
    isFilled: false,
    fillPercentage: 0,
    associatedEntry: entry.id
  };
}
```

### When Do Cracks Get Filled with Gold?

```typescript
// Gold fills based on:
1. Time passed since crack appeared (healing over time)
2. Reflections added about that challenge
3. Skills gained from that experience
4. Accomplishments achieved after the setback

// Progressive filling:
function updateCrackGoldFill(crack: Crack, entry: JournalEntry): number {
  let fillPercentage = crack.fillPercentage;

  // Time healing (1% per day up to 30%)
  const daysSince = daysSinceDate(crack.createdAt);
  fillPercentage += Math.min(daysSince, 30);

  // Reflection (+20%)
  if (entry.reflection && entry.reflection.length > 100) {
    fillPercentage += 20;
  }

  // Growth visible (+30%)
  if (entry.skillsGained || entry.lessonsLearned) {
    fillPercentage += 30;
  }

  // Accomplishment after setback (+20%)
  if (entry.category === 'win' && isAfterCrack(entry.date, crack.createdAt)) {
    fillPercentage += 20;
  }

  return Math.min(fillPercentage, 100); // Cap at 100%
}
```

---

## Visual States & Animations

### Crack Appearance Animation
```css
@keyframes crack-appear {
  0% {
    stroke-dasharray: 0, 1000;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    stroke-dasharray: 1000, 0;
    opacity: 1;
  }
}

.crack-line {
  animation: crack-appear 1s ease-out;
}
```

### Gold Filling Animation
```css
@keyframes gold-flow {
  0% {
    stroke-dasharray: 0, 1000;
    stroke: #D4AF37;
    filter: drop-shadow(0 0 0px #D4AF37);
  }
  50% {
    filter: drop-shadow(0 0 10px #D4AF37);
  }
  100% {
    stroke-dasharray: 1000, 0;
    stroke: #D4AF37;
    filter: drop-shadow(0 0 5px #D4AF37);
  }
}

.gold-fill {
  animation: gold-flow 2s ease-in-out forwards;
}
```

### Glow Effect on Completed Seams
```css
.completed-seam {
  stroke: #D4AF37;
  stroke-width: 4;
  filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.6));
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.8));
  }
}
```

---

## Integration Points

### 1. Welcome Banner
Replace static "newcomer" badge with pottery selection:
```tsx
{!user.selectedPottery && (
  <PotterySelectionModal onSelect={handlePotterySelection} />
)}

{user.selectedPottery && (
  <PotteryVisual
    style={user.selectedPottery}
    cracks={userCracks}
    size="medium"
  />
)}
```

### 2. Dashboard Widget
Show pottery on Home tab:
```tsx
<div className="pottery-widget">
  <h3>Your Kintsugi Journey</h3>
  <PotteryVisual
    style={user.selectedPottery}
    cracks={userCracks}
    interactive={true}
    size="large"
  />
  <div className="stats">
    <span>{totalCracks} cracks</span>
    <span>{filledCracks} golden seams</span>
    <span>{Math.round(averageFill)}% healed</span>
  </div>
</div>
```

### 3. Achievements / Milestones
```tsx
// Unlock new pottery styles as milestones
const POTTERY_UNLOCKS = [
  { id: 'bowl', unlockAt: 0 }, // Default
  { id: 'vase', unlockAt: 10 }, // 10 entries
  { id: 'plate', unlockAt: 25 }, // 25 entries
  { id: 'jar', unlockAt: 50 }, // 50 entries
  { id: 'teapot', unlockAt: 100 }, // 100 entries - special!
];
```

### 4. Share Feature
```tsx
<button onClick={sharePottery}>
  <Share className="h-4 w-4" />
  Share Your Kintsugi
</button>

// Generates beautiful image:
// "My journey: 12 cracks, 8 golden seams. Every break made me stronger."
// [Pottery image with golden veins]
// - [User Name] on Kintsugi
```

---

## Data Structure

### User Pottery Data
```typescript
interface UserPotteryData {
  selectedStyle: string; // 'bowl', 'vase', etc.
  cracks: Crack[];
  unlockedStyles: string[];
  createdAt: Date;
  lastUpdated: Date;
}

// Stored in localStorage:
localStorage.setItem('kintsugi_pottery', JSON.stringify(potteryData));
```

---

## Phase 1 MVP (Quick Win)

### Week 1: Basic Implementation
1. Create 3-4 simple SVG pottery shapes
2. Simple crack/gold overlay system
3. Selection screen on first visit
4. Integration with welcome banner

### Week 2: Progress Logic
1. Auto-create cracks on challenging entries
2. Progressive gold filling based on time + reflections
3. Stats display (X cracks, Y golden seams)

### Week 3: Polish
1. Smooth animations
2. Glow effects on gold
3. Click cracks to see associated entry
4. Share feature

---

## Future Enhancements

### Advanced Features
- **3D pottery rotation** (Three.js)
- **Sound effects** (soft ceramic clink when crack appears, gentle chime when gold fills)
- **Seasonal pottery** (cherry blossoms in spring, autumn leaves)
- **Collaborative vessels** (team Kintsugi for groups)
- **AR view** (see your pottery in real world via phone camera)
- **Physical export** (partner with pottery artists to create real Kintsugi pieces)

---

## Emotional Impact

**Before**: Static text "You're a newcomer"
**After**: "Choose your vessel. As you grow, watch your cracks become gold."

**Result**: Users see their journey visualized, making progress tangible and beautiful. Every setback becomes a visible part of their unique masterpiece. 🏺✨
