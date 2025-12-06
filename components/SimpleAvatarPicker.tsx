'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Lock } from 'lucide-react';
import { emojiCharacters, getCategoryInfo, CATEGORY_UNLOCKS, isCategoryUnlocked } from '@/data/emojiCharacters';
import { getCurrentLevelInfo } from '@/utils/gamification';

interface SimpleAvatarPickerProps {
  currentAvatar?: string;
  currentAvatarType?: 'emoji' | 'image';
  onSelect: (avatar: string, type: 'emoji' | 'image') => void;
}

export default function SimpleAvatarPicker({ currentAvatar, currentAvatarType, onSelect }: SimpleAvatarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'characters' | 'upload'>('characters');
  const [selectedCategory, setSelectedCategory] = useState<string>('vessels');
  const [hoveredCharacter, setHoveredCharacter] = useState<string>('');
  const [userLevel, setUserLevel] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = Object.keys(emojiCharacters);

  // Get user's current level
  useEffect(() => {
    const levelInfo = getCurrentLevelInfo();
    setUserLevel(levelInfo.level);

    // Listen for level updates
    const handleUpdate = () => {
      const newLevelInfo = getCurrentLevelInfo();
      setUserLevel(newLevelInfo.level);
    };

    window.addEventListener('gamification-update', handleUpdate);
    return () => window.removeEventListener('gamification-update', handleUpdate);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onSelect(base64String, 'image');
    };
    reader.readAsDataURL(file);
  };

  const isEmoji = currentAvatarType === 'emoji' || !currentAvatarType;

  // Get rarity color for category
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-amber-400 to-amber-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="w-full">
      {/* Current Avatar Display */}
      <div className="flex flex-col items-center gap-4">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden"
        >
          {isEmoji ? (
            <span className="text-5xl">{currentAvatar || '🏺'}</span>
          ) : (
            <img
              src={currentAvatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium"
        >
          {isOpen ? '✕ Close character picker' : '✨ Choose your Kintsugi avatar'}
        </button>
      </div>

      {/* Character Collections */}
      {isOpen && (
        <div className="mt-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800">
          <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-2 text-center">
            Choose Your Kintsugi Avatar
          </h3>
          <p className="text-xs text-amber-700 dark:text-amber-400 mb-4 text-center">
            Level {userLevel} - Unlock more avatars as you progress on your journey
          </p>

          {/* Mode Tabs */}
          <div className="flex gap-2 mb-4 justify-center">
            <button
              type="button"
              onClick={() => setSelectedTab('characters')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedTab === 'characters'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
              }`}
            >
              🏺 Avatars
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('upload')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedTab === 'upload'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
              }`}
            >
              📸 Upload Photo
            </button>
          </div>

          {selectedTab === 'characters' ? (
            <>
              {/* Category Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {categories.map((category) => {
                  const info = getCategoryInfo(category);
                  const unlock = CATEGORY_UNLOCKS[category];
                  const isUnlocked = isCategoryUnlocked(category, userLevel);

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => isUnlocked && setSelectedCategory(category)}
                      disabled={!isUnlocked}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                        !isUnlocked
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
                          : selectedCategory === category
                          ? `bg-gradient-to-r ${getRarityColor(unlock.rarity)} text-white shadow-lg scale-105`
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                      }`}
                    >
                      {!isUnlocked && (
                        <Lock className="w-3 h-3 absolute -top-1 -right-1 text-gray-500" />
                      )}
                      <span className="text-xl">{info.emoji}</span>
                      <span className="text-sm font-semibold">{info.name}</span>
                      {!isUnlocked && (
                        <span className="text-xs ml-1 opacity-75">Lv.{unlock.unlockLevel}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Category Description */}
              <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-700">
                <p className="text-sm text-amber-800 dark:text-amber-300 text-center font-medium">
                  {getCategoryInfo(selectedCategory).description}
                </p>
                {CATEGORY_UNLOCKS[selectedCategory] && (
                  <p className="text-xs text-center mt-1 text-amber-600 dark:text-amber-400">
                    {CATEGORY_UNLOCKS[selectedCategory].rarity.charAt(0).toUpperCase() + CATEGORY_UNLOCKS[selectedCategory].rarity.slice(1)} Collection
                    {' '} - Unlocked at Level {CATEGORY_UNLOCKS[selectedCategory].unlockLevel}
                  </p>
                )}
              </div>

              {/* Characters Grid */}
              <div className="grid grid-cols-5 gap-3 mb-4">
                {emojiCharacters[selectedCategory]?.map((character, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onSelect(character.emoji, 'emoji');
                    }}
                    onMouseEnter={() => setHoveredCharacter(character.name)}
                    onMouseLeave={() => setHoveredCharacter('')}
                    className="relative group p-4 bg-white dark:bg-gray-800 rounded-xl hover:bg-gradient-to-br hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 transition-all hover:scale-110 hover:shadow-lg border-2 border-transparent hover:border-amber-400 dark:hover:border-amber-600"
                    title={character.name}
                  >
                    <div className="text-4xl mb-2">{character.emoji}</div>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-amber-700 dark:group-hover:text-amber-300">
                      {character.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                      {character.personality}
                    </div>
                  </button>
                ))}
              </div>

              {/* Hovered Character Info */}
              {hoveredCharacter && (
                <div className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-lg border-2 border-amber-300 dark:border-amber-700">
                  <p className="text-sm text-amber-900 dark:text-amber-200 text-center font-medium">
                    ✨ {emojiCharacters[selectedCategory]?.find(c => c.name === hoveredCharacter)?.description}
                  </p>
                </div>
              )}

              {/* Locked Categories Preview */}
              {categories.some(cat => !isCategoryUnlocked(cat, userLevel)) && (
                <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-700">
                  <p className="text-xs text-amber-700 dark:text-amber-400 text-center mb-2">
                    🔒 Keep journaling to unlock more avatar collections:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {categories.filter(cat => !isCategoryUnlocked(cat, userLevel)).map(cat => {
                      const info = getCategoryInfo(cat);
                      const unlock = CATEGORY_UNLOCKS[cat];
                      return (
                        <span
                          key={cat}
                          className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getRarityColor(unlock.rarity)} text-white opacity-75`}
                        >
                          {info.emoji} {info.name} (Lv.{unlock.unlockLevel})
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom Emoji Input */}
              <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 text-center">
                  Or paste any emoji:
                </p>
                <input
                  type="text"
                  placeholder="Paste emoji here..."
                  maxLength={2}
                  onChange={(e) => {
                    if (e.target.value) {
                      onSelect(e.target.value, 'emoji');
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-4 py-2 text-center text-2xl rounded-lg border-2 border-amber-300 dark:border-amber-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-xl hover:border-amber-500 dark:hover:border-amber-500 transition-colors group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
                    <Upload className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      Click to upload your photo
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Your dog, cat, or any photo you love!
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      PNG, JPG, GIF up to 2MB
                    </p>
                  </div>
                </div>
              </button>

              {currentAvatarType === 'image' && currentAvatar && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                    Current photo:
                  </p>
                  <div className="flex justify-center">
                    <img
                      src={currentAvatar}
                      alt="Current profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
