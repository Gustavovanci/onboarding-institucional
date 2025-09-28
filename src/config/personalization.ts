// src/config/personalization.ts

// Paletas de cores personalizadas
export const COLOR_THEMES = [
  { name: 'Azul Clássico', primary: 'from-blue-500 to-teal-500', bg: 'from-blue-50 to-teal-50', id: 'classic' },
  { name: 'Rosa Suave', primary: 'from-pink-500 to-rose-500', bg: 'from-pink-50 to-rose-50', id: 'pink' },
  { name: 'Verde Natureza', primary: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50', id: 'green' },
  { name: 'Roxo Criativo', primary: 'from-purple-500 to-violet-500', bg: 'from-purple-50 to-violet-50', id: 'purple' },
  { name: 'Laranja Energia', primary: 'from-orange-500 to-amber-500', bg: 'from-orange-50 to-amber-50', id: 'orange' },
  { name: 'Vermelho Paixão', primary: 'from-red-500 to-pink-500', bg: 'from-red-50 to-pink-50', id: 'red' }
];

// Emojis de status/humor
export const STATUS_EMOJIS = [
  { emoji: '😊', name: 'Feliz', id: 'happy' },
  { emoji: '🚀', name: 'Motivado', id: 'motivated' },
  { emoji: '📚', name: 'Estudando', id: 'studying' },
  { emoji: '☕', name: 'Energizado', id: 'coffee' },
  { emoji: '🎯', name: 'Focado', id: 'focused' },
  { emoji: '🌟', name: 'Inspirado', id: 'inspired' },
  { emoji: '💡', name: 'Criativo', id: 'creative' },
  { emoji: '🎉', name: 'Celebrando', id: 'celebrating' }
];

// Títulos/badges personalizados
export const CUSTOM_TITLES = [
  { title: 'Explorador do Conhecimento', icon: '🧭', id: 'explorer' },
  { title: 'Campeão da Aprendizagem', icon: '🏆', id: 'champion' },
  { title: 'Especialista em Crescimento', icon: '🌱', id: 'growth' },
  { title: 'Mentor em Formação', icon: '👥', id: 'mentor' },
  { title: 'Inovador Digital', icon: '💻', id: 'digital' },
  { title: 'Guardião do Conhecimento', icon: '🛡️', id: 'guardian' }
];