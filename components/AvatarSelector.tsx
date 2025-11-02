'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Smile, Upload, X, Sparkles } from 'lucide-react';
import { emojiCharacters, getCategoryInfo, type EmojiCharacter } from '@/data/emojiCharacters';

interface AvatarSelectorProps {
  currentAvatar?: string;
  currentAvatarType?: 'emoji' | 'image';
  onAvatarChange: (avatar: string, type: 'emoji' | 'image') => void;
}

const popularEmojis = [
  '😊', '😎', '🤗', '😇', '🥳', '🤩', '😍', '🥰', '😌', '✨',
  '🌟', '⭐', '💫', '🌈', '🦄', '🦋', '🌸', '🌺', '🌻', '🌼',
  '💪', '🔥', '⚡', '💎', '👑', '🏆', '🎯', '🚀', '💡', '🎨',
  '🎭', '🎪', '🎬', '🎮', '🎲', '🎸', '🎹', '🎤', '🎧', '📚',
  '💼', '💻', '📱', '⌚', '🔬', '🔭', '🎓', '🏅', '🥇', '🌍'
];

export default function AvatarSelector({ currentAvatar, currentAvatarType, onAvatarChange }: AvatarSelectorProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'characters' | 'emoji' | 'upload'>('characters');
  const [selectedCategory, setSelectedCategory] = useState<string>('achievers');
  const [hoveredCharacter, setHoveredCharacter] = useState<EmojiCharacter | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEmojiSelect = (emoji: string) => {
    console.log('Avatar selected:', emoji);
    onAvatarChange(emoji, 'emoji');
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onAvatarChange(base64String, 'image');
      setShowEmojiPicker(false);
    };
    reader.readAsDataURL(file);
  };

  const displayAvatar = currentAvatar || '👤';
  const isEmoji = currentAvatarType === 'emoji' || !currentAvatarType;

  return (
    <div className="relative">
      {/* Avatar Display */}
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="relative group"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg hover:shadow-xl transition-all">
          {isEmoji ? (
            <span className="text-4xl">{displayAvatar}</span>
          ) : (
            <img 
              src={displayAvatar} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Edit Overlay */}
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </button>

      {/* Emoji/Image Picker Modal */}
      <AnimatePresence>
        {showEmojiPicker && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmojiPicker(false)}
              className="fixed inset-0 bg-black/20 z-40"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
            {/* Header with Tabs */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedTab('characters')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    selectedTab === 'characters'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Characters
                </button>
                <button
                  onClick={() => setSelectedTab('emoji')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    selectedTab === 'emoji'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Smile className="w-4 h-4" />
                  All Emojis
                </button>
                <button
                  onClick={() => setSelectedTab('upload')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    selectedTab === 'upload'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {selectedTab === 'characters' ? (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Choose your character
                  </h4>
                  
                  {/* Category Selector */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {Object.keys(emojiCharacters).map((category) => {
                      const info = getCategoryInfo(category);
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                            selectedCategory === category
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <span className="text-lg">{info.emoji}</span>
                          <span className="text-xs">{info.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Category Description */}
                  <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-purple-800 dark:text-purple-300">
                      {getCategoryInfo(selectedCategory).description}
                    </p>
                  </div>
                  
                  {/* Characters Grid */}
                  <div className="grid grid-cols-5 gap-2">
                    {emojiCharacters[selectedCategory]?.map((character, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiSelect(character.emoji)}
                        onMouseEnter={() => setHoveredCharacter(character)}
                        onMouseLeave={() => setHoveredCharacter(null)}
                        className="relative w-full aspect-square flex items-center justify-center text-3xl hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-all hover:scale-110"
                        title={character.name}
                      >
                        {character.emoji}
                      </button>
                    ))}
                  </div>
                  
                  {/* Character Info on Hover */}
                  {hoveredCharacter && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{hoveredCharacter.emoji}</span>
                        <div className="flex-1">
                          <h5 className="font-bold text-purple-900 dark:text-purple-200">
                            {hoveredCharacter.name}
                          </h5>
                          <p className="text-xs text-purple-700 dark:text-purple-300 mb-1">
                            {hoveredCharacter.personality}
                          </p>
                          <p className="text-xs text-purple-600 dark:text-purple-400">
                            {hoveredCharacter.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : selectedTab === 'emoji' ? (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Choose an emoji
                  </h4>
                  <div className="grid grid-cols-8 gap-2">
                    {popularEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Emoji Input */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Or paste any emoji:
                    </label>
                    <input
                      type="text"
                      placeholder="Paste emoji here..."
                      maxLength={2}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          handleEmojiSelect(value);
                        }
                      }}
                      className="w-full px-4 py-2 text-center text-2xl rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Upload a profile picture
                  </h4>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-colors group"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                        <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          Click to upload
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          PNG, JPG, GIF up to 2MB
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  {/* Preview */}
                  {currentAvatarType === 'image' && currentAvatar && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current image:
                      </p>
                      <div className="flex justify-center">
                        <img 
                          src={currentAvatar} 
                          alt="Current profile" 
                          className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
