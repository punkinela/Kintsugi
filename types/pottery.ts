/**
 * Pottery Visual Feature Types
 *
 * Represents user's Kintsugi journey as interactive pottery
 * that shows cracks (challenges) being filled with gold (growth)
 */

export type PotteryStyle = 'bowl' | 'vase' | 'plate' | 'jar';

export type CrackTrigger = 'challenge' | 'setback' | 'difficult-mood' | 'manual';

export interface Crack {
  id: string;
  position: { x: number; y: number };
  path: string; // SVG path data
  createdAt: Date;
  trigger: CrackTrigger;
  isFilled: boolean;
  fillPercentage: number; // 0-100
  associatedEntryId?: string; // Journal entry that created this crack
  severity: 'minor' | 'moderate' | 'major'; // Affects crack width/length
}

export interface PotteryData {
  selectedStyle: PotteryStyle;
  cracks: Crack[];
  unlockedStyles: PotteryStyle[];
  createdAt: Date;
  lastUpdated: Date;
  totalGoldenSeams: number; // Cracks that are 100% filled
}

export interface PotteryStyleDefinition {
  id: PotteryStyle;
  name: string;
  description: string;
  unlockAt: number; // Number of entries required to unlock
  crackPattern: 'radial' | 'vertical' | 'horizontal' | 'spiderweb';
  viewBox: string; // SVG viewBox
  basePath: string; // SVG path for vessel shape
}

export const POTTERY_STYLES: Record<PotteryStyle, PotteryStyleDefinition> = {
  bowl: {
    id: 'bowl',
    name: 'Tea Bowl',
    description: 'Classic Japanese chawan - a vessel for daily practice',
    unlockAt: 0, // Default, always available
    crackPattern: 'radial',
    viewBox: '0 0 200 200',
    basePath: 'M50,80 Q50,50 100,50 Q150,50 150,80 L140,160 Q100,180 60,160 Z'
  },
  vase: {
    id: 'vase',
    name: 'Tall Vase',
    description: 'Elegant vertical vessel - reach for growth',
    unlockAt: 10,
    crackPattern: 'vertical',
    viewBox: '0 0 200 300',
    basePath: 'M80,50 Q100,30 120,50 L115,250 Q100,270 85,250 Z'
  },
  plate: {
    id: 'plate',
    name: 'Serving Plate',
    description: 'Wide surface to hold your story',
    unlockAt: 25,
    crackPattern: 'spiderweb',
    viewBox: '0 0 300 100',
    basePath: 'M50,50 Q150,30 250,50 L240,60 Q150,80 60,60 Z'
  },
  jar: {
    id: 'jar',
    name: 'Storage Jar',
    description: 'Round, grounded vessel - holds wisdom',
    unlockAt: 50,
    crackPattern: 'horizontal',
    viewBox: '0 0 200 250',
    basePath: 'M75,60 Q75,40 100,40 Q125,40 125,60 L125,200 Q100,220 75,200 Z'
  }
};

/**
 * Calculate gold fill percentage based on healing factors
 */
export function calculateGoldFill(crack: Crack, reflections: number, daysSince: number): number {
  let fill = crack.fillPercentage;

  // Time healing (1% per day up to 30%)
  fill += Math.min(daysSince, 30);

  // Reflection healing (10% per reflection up to 40%)
  fill += Math.min(reflections * 10, 40);

  // Cap at 100%
  return Math.min(fill, 100);
}

/**
 * Generate crack path based on pottery style
 */
export function generateCrackPath(
  style: PotteryStyle,
  startPoint: { x: number; y: number },
  severity: 'minor' | 'moderate' | 'major'
): string {
  const definition = POTTERY_STYLES[style];
  const length = severity === 'minor' ? 20 : severity === 'moderate' ? 40 : 60;

  switch (definition.crackPattern) {
    case 'radial':
      // Crack radiates from center outward
      const angle = Math.random() * Math.PI * 2;
      const endX = startPoint.x + Math.cos(angle) * length;
      const endY = startPoint.y + Math.sin(angle) * length;
      return `M${startPoint.x},${startPoint.y} L${endX},${endY}`;

    case 'vertical':
      // Vertical stress crack
      return `M${startPoint.x},${startPoint.y} Q${startPoint.x + 5},${startPoint.y + length/2} ${startPoint.x},${startPoint.y + length}`;

    case 'horizontal':
      // Horizontal band crack
      return `M${startPoint.x},${startPoint.y} Q${startPoint.x + length/2},${startPoint.y + 5} ${startPoint.x + length},${startPoint.y}`;

    case 'spiderweb':
      // Multi-branching crack
      const branches = 3;
      let path = `M${startPoint.x},${startPoint.y}`;
      for (let i = 0; i < branches; i++) {
        const branchAngle = (Math.PI * 2 / branches) * i;
        const branchEndX = startPoint.x + Math.cos(branchAngle) * length;
        const branchEndY = startPoint.y + Math.sin(branchAngle) * length;
        path += ` L${branchEndX},${branchEndY} M${startPoint.x},${startPoint.y}`;
      }
      return path;

    default:
      return `M${startPoint.x},${startPoint.y} L${startPoint.x + length},${startPoint.y + length}`;
  }
}
