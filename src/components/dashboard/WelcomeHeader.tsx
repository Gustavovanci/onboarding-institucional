// src/components/dashboard/WelcomeHeader.tsx
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { STATUS_EMOJIS } from '../../config/personalization';

export const WelcomeHeader = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!user) return null;

  const currentEmoji = STATUS_EMOJIS.find(e => e.id === user.personalizations?.statusEmoji) || STATUS_EMOJIS[0];

  const handleEmojiSelect = (emojiId: string) => {
    if (user.personalizations?.statusEmoji === emojiId) {
      setShowEmojiPicker(false);
      return;
    }
    updateUserProfile({
      personalizations: {
        ...user.personalizations,
        statusEmoji: emojiId,
      },
    });
    setShowEmojiPicker(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
            className="text-4xl hover:scale-110 transition-transform cursor-pointer"
            title="Como você se sente hoje?"
          >
            {currentEmoji.emoji}
          </button>
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-2 bg-white p-2 rounded-2xl shadow-lg border grid grid-cols-4 gap-2 z-20 w-48"
              >
                {STATUS_EMOJIS.map(emoji => (
                  <button 
                    key={emoji.id} 
                    onClick={() => handleEmojiSelect(emoji.id)}
                    className="text-2xl p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    title={emoji.name}
                  >
                    {emoji.emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Olá, <span className="text-brand-azure">{user.displayName.split(' ')[0]}</span>!
          </h1>
          <p className="mt-1 text-lg text-gray-500">
            Como você se sente hoje?
          </p>
        </div>
      </div>
    </motion.div>
  );
};