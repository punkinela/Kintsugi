'use client';

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { emojiCharacters, getCategoryInfo } from '@/data/emojiCharacters';

interface SimpleAvatarPickerProps {
  currentAvatar?: string;
  currentAvatarType?: 'emoji' | 'image';
  onSelect: (avatar: string, type: 'emoji' | 'image') => void;
}

export default function SimpleAvatarPicker({ currentAvatar, currentAvatarType, onSelect }: SimpleAvatarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'characters' | 'upload'>('characters');
  const [selectedCategory, setSelectedCategory] = useState<string>('achievers');
  const [hoveredCharacter, setHoveredCharacter] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = Object.keys(emojiCharacters);
  
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

  return (
    <div className="w-full">
      {/* Current Avatar Display */}
      <div className="flex flex-col items-center gap-4">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden"
        >
          {isEmoji ? (
            <span className="text-5xl">{currentAvatar || '👤'}</span>
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
          className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
        >
          {isOpen ? '✕ Close character picker' : '✨ Choose your character'}
        </button>
      </div>

      {/* Character Collections */}
      {isOpen && (
        <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-bold text-purple-900 dark:text-purple-200 mb-4 text-center">
            Choose Your Avatar
          </h3>
          
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-4 justify-center">
            <button
              type="button"
              onClick={() => setSelectedTab('characters')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedTab === 'characters'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
              }`}
            >
              ✨ Characters
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('upload')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedTab === 'upload'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
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
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                  }`}
                >
                  <span className="text-xl">{info.emoji}</span>
                  <span className="text-sm font-semibold">{info.name}</span>
                </button>
              );
            })}
          </div>
          
          {/* Category Description */}
          <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
            <p className="text-sm text-purple-800 dark:text-purple-300 text-center font-medium">
              {getCategoryInfo(selectedCategory).description}
            </p>
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
                className="relative group p-4 bg-white dark:bg-gray-800 rounded-xl hover:bg-gradient-to-br hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 transition-all hover:scale-110 hover:shadow-lg border-2 border-transparent hover:border-purple-400 dark:hover:border-purple-600"
                title={character.name}
              >
                <div className="text-4xl mb-2">{character.emoji}</div>
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                  {character.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  {character.personality}
                </div>
              </button>
            ))}
          </div>
          
          {/* Hovered Character Info */}
          {hoveredCharacter && (
            <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-lg border-2 border-purple-300 dark:border-purple-700">
              <p className="text-sm text-purple-900 dark:text-purple-200 text-center font-medium">
                ✨ {emojiCharacters[selectedCategory]?.find(c => c.name === hoveredCharacter)?.description}
              </p>
            </div>
          )}
          
          {/* Custom Emoji Input */}
          <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
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
              className="w-full px-4 py-2 text-center text-2xl rounded-lg border-2 border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full p-8 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-colors group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                    <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
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
                      className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
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
