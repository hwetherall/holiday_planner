import React from 'react';

interface HolidayIconProps {
  type: string;
  className?: string;
}

export const HolidayIcon: React.FC<HolidayIconProps> = ({ type, className = "holiday-icon" }) => {
  const icons: { [key: string]: JSX.Element } = {
    // Climate icons
    warm: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
      </svg>
    ),
    mild: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
      </svg>
    ),
    cool: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
        <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
    ),
    snow: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
        <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        <path d="M12 12c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
      </svg>
    ),
    
    // Activity icons
    beach: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
      </svg>
    ),
    mountains: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
      </svg>
    ),
    city: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
        <path d="M12 6L6 12h2v6h2v-4h4v4h2v-6h2L12 6z"/>
      </svg>
    ),
    
    // Accommodation icons
    hotel: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
        <path d="M12 6L6 12h2v6h2v-4h4v4h2v-6h2L12 6z"/>
        <path d="M12 8L8 12h2v4h4v-4h2L12 8z"/>
      </svg>
    ),
    villa: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
        <path d="M12 6L6 12h2v6h2v-4h4v4h2v-6h2L12 6z"/>
        <path d="M12 8L8 12h2v4h4v-4h2L12 8z"/>
        <path d="M12 10L10 12h2v2h2L12 10z"/>
      </svg>
    ),
    
    // Food icons
    food: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
        <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
    ),
    
    // Default icon
    default: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
      </svg>
    )
  };

  return icons[type] || icons.default;
};

export const HolidayEmoji: React.FC<{ type: string; className?: string }> = ({ type, className = "text-2xl" }) => {
  const emojis: { [key: string]: string } = {
    // Climate
    warm: '☀️',
    mild: '🌤️',
    cool: '🌥️',
    snow: '❄️',
    
    // Activities
    beach: '🏖️',
    mountains: '🏔️',
    city: '🏙️',
    museum: '🏛️',
    food: '🍽️',
    adventure: '🏃‍♂️',
    shopping: '🛍️',
    wildlife: '🦁',
    water: '🏊‍♂️',
    hiking: '🥾',
    photography: '📸',
    cycling: '🚴‍♂️',
    sailing: '⛵',
    theme: '🎢',
    markets: '🛒',
    diving: '🤿',
    
    // Accommodation
    hotel: '🏨',
    villa: '🏡',
    resort: '🏖️',
    apartment: '🏢',
    cabin: '🏠',
    bnb: '🏡',
    hostel: '🏠',
    glamping: '⛺',
    farm: '🚜',
    
    // Food
    vegetarian: '🥬',
    vegan: '🌱',
    gluten: '🌾',
    dairy: '🥛',
    nuts: '🥜',
    halal: '🕌',
    kosher: '✡️',
    local: '🍜',
    fine: '🍷',
    street: '🌮',
    cooking: '👨‍🍳',
    
    // Kid needs
    cot: '🛏️',
    highchair: '🪑',
    stroller: '👶',
    childcare: '👨‍👩‍👧‍👦',
    kidsclub: '🎨',
    play: '🎮',
    changing: '🧷',
    dining: '🍽️',
    carseat: '🚗',
    
    // Accessibility
    wheelchair: '♿',
    elevator: '🛗',
    bathroom: '🚽',
    hearing: '👂',
    visual: '👁️',
    mobility: '🦽',
    quiet: '🤫',
    sensory: '🧠',
    transport: '🚌',
    
    // Occasions
    birthday: '🎂',
    anniversary: '💕',
    reunion: '👨‍👩‍👧‍👦',
    graduation: '🎓',
    retirement: '🏖️',
    honeymoon: '💑',
    babymoon: '🤱',
    photoshoot: '📸',
    business: '💼',
    celebration: '🎉',
    cultural: '🎭',
    sports: '⚽',
    festival: '🎪',
    
    // Vetoes
    flight: '✈️',
    heat: '🔥',
    cold: '🥶',
    altitude: '🏔️',
    crowds: '👥',
    language: '🗣️',
    expensive: '💰',
    remote: '🏜️',
    instability: '⚠️',
    infrastructure: '🏗️',
    hostels: '🏠',
    overnight: '🌙',
    drives: '🚗',
    stairs: '🪜',
    loud: '🔊',
    smoking: '🚬',
    pets: '🐕',
    
    // Default
    default: '🎯'
  };

  return <span className={className}>{emojis[type] || emojis.default}</span>;
};
