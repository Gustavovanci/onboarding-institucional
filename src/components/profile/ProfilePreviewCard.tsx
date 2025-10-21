import React from 'react';
import { InstitutoConfig, INSTITUTOS_CONFIG } from '@/types';

// 🔒 Proteção de imagem
const cleanPhotoURL = (url: string | null | undefined): string | null => {
  if (!url) return null;
  return url.split('=')[0];
};

interface ProfilePreviewCardProps {
  user: {
    displayName: string;
    photoURL: string | null;
    instituto: string;
    bio: string;
    email: string;
    profession: string;
  };
}

const ProfilePreviewCard: React.FC<ProfilePreviewCardProps> = ({ user }) => {
  const institutoConfig: InstitutoConfig = INSTITUTOS_CONFIG[user.instituto as keyof typeof INSTITUTOS_CONFIG];
  const fallbackURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=random`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <img
          src={cleanPhotoURL(user.photoURL) || fallbackURL}
          alt={user.displayName}
          className="w-16 h-16 rounded-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => (e.currentTarget.src = fallbackURL)}
        />
        <div>
          <h3 className="text-xl font-bold text-gray-900">{user.displayName}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-600">{user.profession || 'Profissão não informada'}</p>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-lg font-semibold text-gray-900">Instituto</h4>
        <div className="flex items-center gap-2">
          <img src={institutoConfig.logo} alt={institutoConfig.name} className="w-8 h-8" />
          <span className="text-sm text-gray-600">{institutoConfig.fullName}</span>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-lg font-semibold text-gray-900">Bio</h4>
        <p className="text-sm text-gray-600">{user.bio || 'Bio não informada'}</p>
      </div>
    </div>
  );
};

export default ProfilePreviewCard;
