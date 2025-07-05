'use client';
 
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import {
  FaChevronLeft, FaChevronRight, FaCircleQuestion,
  FaUser, FaGear, FaRightFromBracket, FaMoon, FaSun,
  FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaEnvelope, FaGlobe, FaXmark
} from 'react-icons/fa6';
 
// --- TYPESCRIPT INTERFACES ---
interface Flashcard {
  id: string;
  word: string;
  translation: string;
  image: string;
  category: string;
}
 
interface Sentence {
  id: string;
  template: string[];
  correctOrder: string[];
  translation: string;
  wordBank: string[];
  grammarTipId?: string;
}
 
interface GrammarNote {
    id: string;
    language: Language;
    rule: string;
    example: string;
}

interface Theme {
  colors: {
    background: string;
    panel: string;
    border: string;
    text: string;
    textLight: string;
    accent: string;
    accentLight: string;
    secondary: string;
    success: string;
    error: string;
    warning?: string;
    gradientStart: string;
    gradientEnd: string;
  };
  shadows: {
    soft: string;
    medium: string;
    hard: string;
  };
  borderRadius: string;
  fontFamily: string;
}

type Styles = Record<string, CSSProperties> & {
  theme: Theme;
};



interface TutorialRefs {
  [key: number]: React.RefObject<HTMLElement | null>;
}

interface CollapsedSections {
  flashcards: boolean;
  sentences: boolean;
  progress: boolean;
  grammar: boolean;
}

interface Feedback {
  type: 'success' | 'error' | null;
  message: string;
}

interface DraggedItem {
  word: string;
  fromIndex: number | null;
}

type Language = 'spanish' | 'french' | 'italian' | 'portuguese';

// Profile Dropdown Component
const ProfileDropdown = ({ isOpen, onClose, styles }: { isOpen: boolean; onClose: () => void; styles: Styles }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
 
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
 
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
 
  if (!isOpen) return null;
 
  return (
    <div ref={dropdownRef} style={styles.profileDropdown}>
      <div style={styles.profileDropdownHeader}>
        <div style={styles.profileHeaderInfo}>
          <div style={styles.profileName}>Alex Johnson</div>
          <div style={styles.profileEmail}>alex.johnson@example.com</div>
        </div>
      </div>
 
      <div style={styles.profileDropdownDivider}></div>
 
      <div style={styles.profileDropdownMenu}>
        <button style={styles.profileMenuItem} onClick={() => console.log('My Profile')}>
          <FaUser size={16} />
          <span>My Profile</span>
        </button>
 
        <button style={styles.profileMenuItem} onClick={() => console.log('Settings')}>
          <FaGear size={16} />
          <span>Settings</span>
        </button>
 
        <div style={styles.profileDropdownDivider}></div>
 
        <button style={{...styles.profileMenuItem, ...styles.profileMenuItemDanger}} onClick={() => console.log('Sign Out')}>
          <FaRightFromBracket size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
 
// SVG Image Components for Vocabulary Cards
const VocabularySVG = ({ type, size = 80, isDarkMode = false }: { type: string; size?: number; isDarkMode?: boolean }) => {
  // External SVGs (CAT, DOG) need inversion in dark mode, but inline SVGs (WATER, etc.) should keep their colors
  const isExternalSVG = ['CAT', 'DOG'].includes(type);
 
  const svgStyle = {
    width: size,
    height: size,
    display: 'block',
    filter: (isDarkMode && isExternalSVG) ? 'invert(1) brightness(0.9)' : 'none',
    backgroundColor: (isDarkMode && isExternalSVG) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    borderRadius: '8px',
    padding: (isDarkMode && isExternalSVG) ? '4px' : '0'
  };
 
  switch (type) {
    case 'CAT':
      return (
        <Image
          src="https://www.svgrepo.com/show/481271/cat-4.svg"
          alt="Cat"
          width={size}
          height={size}
          style={{...svgStyle, objectFit: 'contain'}}
        />
      );
 
    case 'DOG':
      return (
        <Image
          src="https://www.svgrepo.com/show/147415/dog.svg"
          alt="Dog"
          width={size}
          height={size}
          style={{...svgStyle, objectFit: 'contain'}}
        />
      );
 
    case 'HOUSE':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <polygon points="50,15 20,45 80,45" fill="#DC143C" stroke="#333" strokeWidth="2"/>
          <rect x="25" y="45" width="50" height="40" fill="#F4A460" stroke="#333" strokeWidth="2"/>
          <rect x="40" y="60" width="12" height="25" fill="#8B4513" stroke="#333" strokeWidth="2"/>
          <rect x="30" y="52" width="10" height="10" fill="#87CEEB" stroke="#333" strokeWidth="2"/>
          <rect x="60" y="52" width="10" height="10" fill="#87CEEB" stroke="#333" strokeWidth="2"/>
          <circle cx="46" cy="72" r="1.5" fill="#333"/>
        </svg>
      );
 
    case 'EAT':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="40" r="25" fill="#FFE4B5" stroke="#333" strokeWidth="2"/>
          <rect x="15" y="25" width="3" height="30" fill="#C0C0C0" stroke="#333" strokeWidth="1"/>
          <rect x="12" y="25" width="9" height="3" fill="#C0C0C0" stroke="#333" strokeWidth="1"/>
          <path d="M75 20 L85 30 L80 35 L70 25 Z" fill="#C0C0C0" stroke="#333" strokeWidth="1"/>
          <path d="M75 20 L85 15 L90 20 L80 25 Z" fill="#C0C0C0" stroke="#333" strokeWidth="1"/>
          <ellipse cx="50" cy="40" rx="15" ry="8" fill="#FF6347"/>
          <rect x="25" y="70" width="50" height="8" rx="4" fill="#8B4513" stroke="#333" strokeWidth="2"/>
        </svg>
      );
 
    case 'DRINK':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="35" y="30" width="30" height="45" rx="5" fill="#87CEEB" stroke="#333" strokeWidth="2"/>
          <rect x="37" y="32" width="26" height="25" fill="#4169E1" opacity="0.7"/>
          <rect x="30" y="25" width="40" height="8" rx="4" fill="#F5F5DC" stroke="#333" strokeWidth="2"/>
          <path d="M65 35 Q75 40 70 50" stroke="#333" strokeWidth="2" fill="none"/>
          <ellipse cx="50" cy="20" rx="8" ry="3" fill="#F5F5DC" stroke="#333" strokeWidth="1"/>
          <path d="M45 15 Q50 10 55 15" stroke="#333" strokeWidth="2" fill="none"/>
        </svg>
      );
 
    case 'SUN':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="20" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
          <g stroke="#FFA500" strokeWidth="3" strokeLinecap="round">
            <line x1="50" y1="10" x2="50" y2="20"/>
            <line x1="50" y1="80" x2="50" y2="90"/>
            <line x1="10" y1="50" x2="20" y2="50"/>
            <line x1="80" y1="50" x2="90" y2="50"/>
            <line x1="21.7" y1="21.7" x2="28.3" y2="28.3"/>
            <line x1="71.7" y1="71.7" x2="78.3" y2="78.3"/>
            <line x1="21.7" y1="78.3" x2="28.3" y2="71.7"/>
            <line x1="71.7" y1="28.3" x2="78.3" y2="21.7"/>
          </g>
          <circle cx="45" cy="45" r="2" fill="#FFA500"/>
          <circle cx="55" cy="45" r="2" fill="#FFA500"/>
          <path d="M45 55 Q50 60 55 55" stroke="#FFA500" strokeWidth="2" fill="none"/>
        </svg>
      );
 
    case 'WATER':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <path d="M50 20 Q35 35 35 55 Q35 75 50 75 Q65 75 65 55 Q65 35 50 20 Z"
                fill="#4169E1" stroke="#1E90FF" strokeWidth="2"/>
          <ellipse cx="45" cy="45" rx="3" ry="6" fill="#87CEEB" opacity="0.7"/>
          <ellipse cx="55" cy="55" rx="2" ry="4" fill="#87CEEB" opacity="0.7"/>
          <circle cx="50" cy="35" r="1.5" fill="#E0F6FF"/>
        </svg>
      );
 
    case 'ARTICLE_M':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="20" y="20" width="60" height="60" rx="5" fill="#E6F3FF" stroke="#4169E1" strokeWidth="2"/>
          <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#4169E1">M</text>
          <rect x="25" y="25" width="50" height="3" fill="#4169E1"/>
          <rect x="25" y="35" width="35" height="2" fill="#87CEEB"/>
          <rect x="25" y="65" width="40" height="2" fill="#87CEEB"/>
        </svg>
      );
 
    case 'ARTICLE_F':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="20" y="20" width="60" height="60" rx="5" fill="#FFE6F3" stroke="#DC143C" strokeWidth="2"/>
          <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#DC143C">F</text>
          <rect x="25" y="25" width="50" height="3" fill="#DC143C"/>
          <rect x="25" y="35" width="35" height="2" fill="#FFB6C1"/>
          <rect x="25" y="65" width="40" height="2" fill="#FFB6C1"/>
        </svg>
      );
 
    case 'ARTICLE':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="20" y="20" width="60" height="60" rx="5" fill="#F0F8FF" stroke="#333" strokeWidth="2"/>
          <rect x="25" y="25" width="50" height="3" fill="#333"/>
          <rect x="25" y="35" width="45" height="2" fill="#666"/>
          <rect x="25" y="42" width="40" height="2" fill="#666"/>
          <rect x="25" y="49" width="48" height="2" fill="#666"/>
          <rect x="25" y="56" width="35" height="2" fill="#666"/>
          <rect x="25" y="63" width="42" height="2" fill="#666"/>
          <rect x="25" y="70" width="30" height="2" fill="#666"/>
        </svg>
      );
 
    case 'IN':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="30" fill="none" stroke="#333" strokeWidth="3"/>
          <circle cx="50" cy="50" r="8" fill="#FF6347"/>
          <path d="M30 30 L50 50" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
            </marker>
          </defs>
        </svg>
      );
 
    case 'FROM':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <circle cx="25" cy="50" r="8" fill="#32CD32"/>
          <circle cx="75" cy="50" r="8" fill="#FF6347"/>
          <path d="M33 50 L67 50" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead2)"/>
          <defs>
            <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
            </marker>
          </defs>
          <text x="50" y="35" textAnchor="middle" fontSize="12" fill="#333">FROM</text>
        </svg>
      );
 
    case 'IS':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="25" fill="#98FB98" stroke="#32CD32" strokeWidth="3"/>
          <circle cx="50" cy="50" r="5" fill="#32CD32"/>
          <path d="M50 25 L50 35" stroke="#32CD32" strokeWidth="2"/>
          <path d="M50 65 L50 75" stroke="#32CD32" strokeWidth="2"/>
          <path d="M25 50 L35 50" stroke="#32CD32" strokeWidth="2"/>
          <path d="M65 50 L75 50" stroke="#32CD32" strokeWidth="2"/>
        </svg>
      );
 
    case 'BOOK':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="25" y="20" width="50" height="60" rx="3" fill="#8B4513" stroke="#333" strokeWidth="2"/>
          <rect x="27" y="22" width="46" height="56" rx="2" fill="#F4A460"/>
          <rect x="30" y="25" width="40" height="2" fill="#8B4513"/>
          <rect x="30" y="30" width="35" height="1.5" fill="#666"/>
          <rect x="30" y="35" width="38" height="1.5" fill="#666"/>
          <rect x="30" y="40" width="32" height="1.5" fill="#666"/>
          <rect x="30" y="45" width="36" height="1.5" fill="#666"/>
          <rect x="30" y="50" width="30" height="1.5" fill="#666"/>
          <rect x="30" y="55" width="34" height="1.5" fill="#666"/>
          <rect x="30" y="60" width="28" height="1.5" fill="#666"/>
          <rect x="30" y="65" width="32" height="1.5" fill="#666"/>
          <rect x="30" y="70" width="25" height="1.5" fill="#666"/>
        </svg>
      );
 
    case 'TREE':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="45" y="60" width="10" height="25" fill="#8B4513" stroke="#333" strokeWidth="2"/>
          <circle cx="50" cy="45" r="20" fill="#228B22" stroke="#006400" strokeWidth="2"/>
          <circle cx="40" cy="35" r="12" fill="#32CD32" stroke="#006400" strokeWidth="1"/>
          <circle cx="60" cy="35" r="12" fill="#32CD32" stroke="#006400" strokeWidth="1"/>
          <circle cx="50" cy="25" r="10" fill="#90EE90" stroke="#006400" strokeWidth="1"/>
          <ellipse cx="35" cy="80" rx="8" ry="3" fill="#8B4513" opacity="0.5"/>
          <ellipse cx="65" cy="82" rx="6" ry="2" fill="#8B4513" opacity="0.5"/>
          <path d="M42 70 Q38 75 35 80" stroke="#8B4513" strokeWidth="2" fill="none"/>
          <path d="M58 70 Q62 75 65 80" stroke="#8B4513" strokeWidth="2" fill="none"/>
        </svg>
      );
 
    case 'FLOWER':
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="48" y="50" width="4" height="35" fill="#228B22" stroke="#006400" strokeWidth="1"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="1" transform="rotate(0 50 35)"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="1" transform="rotate(45 50 35)"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="1" transform="rotate(90 50 35)"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="1" transform="rotate(135 50 35)"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FFB6C1" stroke="#FF1493" strokeWidth="1" transform="rotate(22.5 50 35)"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FFB6C1" stroke="#FF1493" strokeWidth="1" transform="rotate(67.5 50 35)"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FFB6C1" stroke="#FF1493" strokeWidth="1" transform="rotate(112.5 50 35)"/>
          <ellipse cx="50" cy="35" rx="8" ry="12" fill="#FFB6C1" stroke="#FF1493" strokeWidth="1" transform="rotate(157.5 50 35)"/>
          <circle cx="50" cy="35" r="4" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
          <ellipse cx="45" cy="60" rx="3" ry="8" fill="#228B22" stroke="#006400" strokeWidth="1"/>
          <ellipse cx="55" cy="65" rx="2" ry="6" fill="#228B22" stroke="#006400" strokeWidth="1"/>
        </svg>
      );
 
    default:
      return (
        <svg style={svgStyle} viewBox="0 0 100 100" fill="none">
          <rect x="20" y="20" width="60" height="60" rx="5" fill="#F5F5F5" stroke="#333" strokeWidth="2"/>
          <text x="50" y="55" textAnchor="middle" fontSize="16" fill="#333">?</text>
        </svg>
      );
  }
};
 
// --- MOCK DATABASE & ASSETS ---
const vocabularyData: Record<Language, Flashcard[]> = {
  spanish: [
    { id: 'es1', word: 'gato', translation: 'cat', image: 'CAT', category: 'animals' },
    { id: 'es2', word: 'perro', translation: 'dog', image: 'DOG', category: 'animals' },
    { id: 'es3', word: 'casa', translation: 'house', image: 'HOUSE', category: 'objects' },
    { id: 'es4', word: 'comer', translation: 'to eat', image: 'EAT', category: 'verbs' },
    { id: 'es5', word: 'el', translation: 'the (m)', image: 'ARTICLE_M', category: 'articles' },
    { id: 'es6', word: 'la', translation: 'the (f)', image: 'ARTICLE_F', category: 'articles' },
    { id: 'es7', word: 'sol', translation: 'sun', image: 'SUN', category: 'nature' },
    { id: 'es8', word: 'agua', translation: 'water', image: 'WATER', category: 'nature' },
    { id: 'es9', word: 'bebe', translation: 'drinks', image: 'DRINK', category: 'verbs' },
    { id: 'es10', word: 'está', translation: 'is', image: 'IS', category: 'verbs' },
    { id: 'es11', word: 'en', translation: 'in/at', image: 'IN', category: 'prepositions' },
    { id: 'es12', word: 'un', translation: 'a/an (m)', image: 'ARTICLE', category: 'articles' },
    { id: 'es13', word: 'libro', translation: 'book', image: 'BOOK', category: 'objects' },
    { id: 'es14', word: 'árbol', translation: 'tree', image: 'TREE', category: 'nature' },
    { id: 'es15', word: 'flor', translation: 'flower', image: 'FLOWER', category: 'nature' },
  ],
  french: [
    { id: 'fr1', word: 'chat', translation: 'cat', image: 'CAT', category: 'animals' },
    { id: 'fr2', word: 'chien', translation: 'dog', image: 'DOG', category: 'animals' },
    { id: 'fr3', word: 'maison', translation: 'house', image: 'HOUSE', category: 'objects' },
    { id: 'fr4', word: 'manger', translation: 'to eat', image: 'EAT', category: 'verbs' },
    { id: 'fr5', word: 'le', translation: 'the (m)', image: 'ARTICLE_M', category: 'articles' },
    { id: 'fr6', word: 'la', translation: 'the (f)', image: 'ARTICLE_F', category: 'articles' },
    { id: 'fr7', word: 'soleil', translation: 'sun', image: 'SUN', category: 'nature' },
    { id: 'fr8', word: 'eau', translation: 'water', image: 'WATER', category: 'nature' },
    { id: 'fr9', word: 'boit', translation: 'drinks', image: 'DRINK', category: 'verbs' },
    { id: 'fr10', word: 'est', translation: 'is', image: 'IS', category: 'verbs' },
    { id: 'fr11', word: 'dans', translation: 'in', image: 'IN', category: 'prepositions' },
    { id: 'fr12', word: 'un', translation: 'a/an', image: 'ARTICLE', category: 'articles' },
    { id: 'fr13', word: 'de', translation: 'of/from', image: 'FROM', category: 'prepositions' },
  ],
  italian: [
    { id: 'it1', word: 'gatto', translation: 'cat', image: 'CAT', category: 'animals' },
    { id: 'it2', word: 'cane', translation: 'dog', image: 'DOG', category: 'animals' },
    { id: 'it3', word: 'casa', translation: 'house', image: 'HOUSE', category: 'objects' },
    { id: 'it4', word: 'mangiare', translation: 'to eat', image: 'EAT', category: 'verbs' },
    { id: 'it5', word: 'il', translation: 'the (m)', image: 'ARTICLE_M', category: 'articles' },
    { id: 'it6', word: 'la', translation: 'the (f)', image: 'ARTICLE_F', category: 'articles' },
    { id: 'it7', word: 'sole', translation: 'sun', image: 'SUN', category: 'nature' },
    { id: 'it8', word: 'acqua', translation: 'water', image: 'WATER', category: 'nature' },
    { id: 'it9', word: 'beve', translation: 'drinks', image: 'DRINK', category: 'verbs' },
    { id: 'it10', word: 'è', translation: 'is', image: 'IS', category: 'verbs' },
    { id: 'it11', word: 'nella', translation: 'in the', image: 'IN', category: 'prepositions' },
    { id: 'it12', word: 'un', translation: 'a/an', image: 'ARTICLE', category: 'articles' },
  ],
  portuguese: [
    { id: 'pt1', word: 'gato', translation: 'cat', image: 'CAT', category: 'animals' },
    { id: 'pt2', word: 'cão', translation: 'dog', image: 'DOG', category: 'animals' },
    { id: 'pt3', word: 'casa', translation: 'house', image: 'HOUSE', category: 'objects' },
    { id: 'pt4', word: 'comer', translation: 'to eat', image: 'EAT', category: 'verbs' },
    { id: 'pt5', word: 'o', translation: 'the (m)', image: 'ARTICLE_M', category: 'articles' },
    { id: 'pt6', word: 'a', translation: 'the (f)', image: 'ARTICLE_F', category: 'articles' },
    { id: 'pt7', word: 'sol', translation: 'sun', image: 'SUN', category: 'nature' },
    { id: 'pt8', word: 'água', translation: 'water', image: 'WATER', category: 'nature' },
    { id: 'pt9', word: 'bebe', translation: 'drinks', image: 'DRINK', category: 'verbs' },
    { id: 'pt10', word: 'está', translation: 'is', image: 'IS', category: 'verbs' },
    { id: 'pt11', word: 'na', translation: 'in the', image: 'IN', category: 'prepositions' },
    { id: 'pt12', word: 'um', translation: 'a/an', image: 'ARTICLE', category: 'articles' },
  ]
};
 
const sentenceData: Record<Language, Sentence[]> = {
  spanish: [
    { id: 'es_s1', template: ['___', '___', 'bebe', '___'], correctOrder: ['el', 'gato', 'bebe', 'agua'], translation: 'The cat drinks water', wordBank: ['el', 'la', 'gato', 'bebe', 'agua', 'sol'].sort(() => Math.random() - 0.5), grammarTipId: 'es_gender' },
    { id: 'es_s2', template: ['___', '___', 'está', 'en', 'la', '___'], correctOrder: ['el', 'perro', 'está', 'en', 'la', 'casa'], translation: 'The dog is in the house', wordBank: ['perro', 'en', 'la', 'casa', 'el', 'un', 'está'].sort(() => Math.random() - 0.5), grammarTipId: 'es_gender' },
  ],
  french: [
    { id: 'fr_s1', template: ['___', '___', 'boit', 'de', "l'eau"], correctOrder: ['le', 'chat', 'boit', 'de', "l'eau"], translation: 'The cat drinks water', wordBank: ['le', 'la', 'chat', 'boit', 'de', "l'eau", 'mange'].sort(() => Math.random() - 0.5), grammarTipId: 'fr_articles' },
    { id: 'fr_s2', template: ['___', '___', 'est', 'dans', 'la', 'maison'], correctOrder: ['le', 'chien', 'est', 'dans', 'la', 'maison'], translation: 'The dog is in the house', wordBank: ['chien', 'est', 'dans', 'la', 'maison', 'le', 'un'].sort(() => Math.random() - 0.5), grammarTipId: 'fr_articles' },
  ],
  italian: [
    { id: 'it_s1', template: ['___', '___', 'beve', "l'acqua"], correctOrder: ['il', 'gatto', 'beve', "l'acqua"], translation: 'The cat drinks water', wordBank: ['il', 'la', 'gatto', 'beve', "l'acqua", 'sole'].sort(() => Math.random() - 0.5), grammarTipId: 'it_articles' },
    { id: 'it_s2', template: ['___', '___', 'è', 'nella', 'casa'], correctOrder: ['il', 'cane', 'è', 'nella', 'casa'], translation: 'The dog is in the house', wordBank: ['cane', 'è', 'nella', 'casa', 'il', 'un'].sort(() => Math.random() - 0.5), grammarTipId: 'it_articles' },
  ],
  portuguese: [
      { id: 'pt_s1', template: ['___', '___', 'bebe', '___'], correctOrder: ['o', 'gato', 'bebe', 'água'], translation: 'The cat drinks water', wordBank: ['o', 'a', 'gato', 'bebe', 'água', 'sol'].sort(() => Math.random() - 0.5), grammarTipId: 'pt_gender' },
      { id: 'pt_s2', template: ['___', '___', 'está', 'na', '___'], correctOrder: ['o', 'cão', 'está', 'na', 'casa'], translation: 'The dog is in the house', wordBank: ['cão', 'está', 'na', 'casa', 'o', 'um'].sort(() => Math.random() - 0.5), grammarTipId: 'pt_gender' },
  ]
};
 
const grammarTips: Record<string, Omit<GrammarNote, 'language'>> = {
    'es_gender': { id: 'es_gender', rule: "Gendered Articles", example: "Nouns in Spanish are masculine or feminine. Use 'el' for masculine (el gato) and 'la' for feminine (la casa)." },
    'fr_articles': { id: 'fr_articles', rule: "Definite Articles", example: "Use 'le' for masculine nouns (le chat) and 'la' for feminine nouns (la maison)." },
    'it_articles': { id: 'it_articles', rule: "Definite Articles", example: "Use 'il' for most masculine nouns (il gatto) and 'la' for feminine nouns (la casa)." },
    'pt_gender': { id: 'pt_gender', rule: "Gendered Articles", example: "Nouns in Portuguese have a gender. Use 'o' for masculine (o gato) and 'a' for feminine (a casa)." },
}
 
// SVG Flag Components
const FlagSVG = ({ country, size = 24 }: { country: string; size?: number }) => {
  const flagStyle = { width: size, height: size * 0.75, display: 'inline-block', borderRadius: '2px', border: '1px solid #ccc' };
 
  switch (country) {
    case 'ES': // Spain
      return (
        <svg style={flagStyle} viewBox="0 0 24 18" fill="none">
          <rect width="24" height="18" fill="#AA151B"/>
          <rect y="4.5" width="24" height="9" fill="#F1BF00"/>
          <g transform="translate(7, 9)">
            <circle cx="0" cy="0" r="2.5" fill="#AA151B" stroke="#000" strokeWidth="0.1"/>
            <rect x="-1.5" y="-1" width="3" height="2" fill="#F1BF00"/>
            <rect x="-0.5" y="-0.5" width="1" height="1" fill="#AA151B"/>
          </g>
        </svg>
      );
 
    case 'FR': // France
      return (
        <svg style={flagStyle} viewBox="0 0 24 18" fill="none">
          <rect width="8" height="18" fill="#002654"/>
          <rect x="8" width="8" height="18" fill="#FFFFFF"/>
          <rect x="16" width="8" height="18" fill="#CE1126"/>
        </svg>
      );
 
    case 'IT': // Italy
      return (
        <svg style={flagStyle} viewBox="0 0 24 18" fill="none">
          <rect width="8" height="18" fill="#009246"/>
          <rect x="8" width="8" height="18" fill="#FFFFFF"/>
          <rect x="16" width="8" height="18" fill="#CE2B37"/>
        </svg>
      );
 
    case 'PT': // Portugal
      return (
        <svg style={flagStyle} viewBox="0 0 24 18" fill="none">
          <rect width="24" height="18" fill="#FF0000"/>
          <rect width="9.6" height="18" fill="#006600"/>
          <circle cx="9.6" cy="9" r="3.5" fill="#FFFF00" stroke="#000" strokeWidth="0.2"/>
          <circle cx="9.6" cy="9" r="2.5" fill="#0000FF"/>
          <circle cx="9.6" cy="9" r="1.5" fill="#FFFFFF"/>
          <rect x="8.8" y="8.2" width="1.6" height="1.6" fill="#FF0000"/>
        </svg>
      );
 
    default:
      return (
        <svg style={flagStyle} viewBox="0 0 24 18" fill="none">
          <rect width="24" height="18" fill="#f0f0f0" stroke="#ccc"/>
          <text x="12" y="12" textAnchor="middle" fontSize="8" fill="#666">?</text>
        </svg>
      );
  }
};
 
const languageAssets: Record<Language, { flag: string; color: string }> = {
    spanish: { flag: 'ES', color: '#3b82f6' },
    french: { flag: 'FR', color: '#ef4444' },
    italian: { flag: 'IT', color: '#22c55e' },
    portuguese: { flag: 'PT', color: '#f97316' },
};
 
const TUTORIAL_STEPS = [
    {
        title: 'Welcome to LingoDeck!',
        content: 'Welcome to your language learning journey! This guided tour will show you all the powerful features available to help you master Spanish, French, Italian, and Portuguese.'
    },
    {
        title: 'Switch Languages',
        content: 'Click any of these language buttons to instantly switch your learning experience. Try clicking "French" or "Italian" to see the vocabulary and exercises change!'
    },
    {
        title: 'Interactive Flashcards',
        content: 'This is your vocabulary learning area. Click on any flashcard to reveal the translation, and use the arrow buttons below to browse through different words.'
    },
    {
        title: 'Sentence Builder',
        content: 'Here\'s where you practice! Drag words from the "Word Bank" below into the sentence slots above. This teaches you proper grammar and word order.'
    },
    {
        title: 'Track Your Progress',
        content: 'Watch your learning progress in real-time! These bars show how many words you\'ve learned, sentences completed, and your accuracy percentage.'
    },
    {
        title: 'Get Grammar Help',
        content: 'When you make mistakes, helpful grammar tips appear here automatically. These personalized tips help you understand the rules and improve faster.'
    },
];
 
// --- MAIN WRAPPER COMPONENT ---
export default function AppWrapper() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [appKey, setAppKey] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
 
    // Handle hydration and localStorage
    useEffect(() => {
        setIsHydrated(true);
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('lingodeck-dark-mode');
            if (saved) {
                setIsDarkMode(JSON.parse(saved));
            }
        }
    }, []);
 
    // Save theme preference to localStorage whenever it changes
    useEffect(() => {
        if (isHydrated && typeof window !== 'undefined') {
            localStorage.setItem('lingodeck-dark-mode', JSON.stringify(isDarkMode));
        }
    }, [isDarkMode, isHydrated]);
 
    const handleLogin = () => {
        setIsLoggedIn(true);
        setAppKey(prevKey => prevKey + 1);
    };
 
    if (!isLoggedIn) {
        return <AuthPage onLogin={handleLogin} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
    }
 
    return <LanguageLearningDashboard key={appKey} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
}
 
 
// --- AUTHENTICATION PAGE COMPONENT ---
const AuthPage = ({ onLogin, isDarkMode, setIsDarkMode }: {
    onLogin: () => void;
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
}) => {
    const [authStage, setAuthStage] = useState<'welcome' | 'login'>('welcome');
    const [isExiting, setIsExiting] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [windowDimensions, setWindowDimensions] = useState({ width: 1024, height: 768 });
 
    const styles = getStyles(screenSize, windowDimensions, isDarkMode);
    const isMobile = screenSize === 'mobile';
 
    // Handle mobile detection and window resize
    useEffect(() => {
        const updateScreenSize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            setWindowDimensions({ width, height });
 
            if (width < 768) {
                setScreenSize('mobile');
            } else if (width < 1024) {
                setScreenSize('tablet');
            } else {
                setScreenSize('desktop');
            }
        };
 
        updateScreenSize();
        window.addEventListener('resize', updateScreenSize);
        return () => window.removeEventListener('resize', updateScreenSize);
    }, []);
 
    useEffect(() => {
        // Prevent layout flash by initializing immediately on mobile
        if (isMobile) {
            setAuthStage('login');
            setIsInitialized(true);
        } else {
            setIsInitialized(true);
            const timer = setTimeout(() => {
                setAuthStage('login');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isMobile]);
 
    const handleAction = () => {
        setIsExiting(true);
        setTimeout(onLogin, 500);
    };
 
    // Prevent layout flash during initialization
    if (!isInitialized) {
        return (
            <div style={styles.authContainer}>
                <div style={styles.authLoadingScreen}>
                    <div style={styles.authLogo}>L</div>
                </div>
            </div>
        );
    }
 
    return (
        <div className="auth-container" style={{...styles.authContainer, opacity: isExiting ? 0 : 1}}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 1000,
                backgroundColor: isDarkMode ? 'rgba(228, 230, 234, 0.95)' : 'rgba(255, 255, 255, 0.9)',
                border: isDarkMode ? '2px solid #3b82f6' : '2px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isDarkMode ? '#1a1a2e' : '#4c6ef5',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
                boxShadow: isDarkMode ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            <div className="auth-welcome-panel" style={{...styles.authWelcomePanel, ...(authStage === 'login' ? styles.authWelcomePanelActive : {})}}>
                <div style={styles.authLogo}>L</div>
                <h1 style={styles.authTitle}>Start your language journey with LingoDeck</h1>
                <p style={styles.authSubtitle}>Your future in multi-linguistics.</p>
            </div>
            <div className="auth-form-panel" style={{...styles.authFormPanel, ...(authStage === 'login' ? styles.authFormPanelActive : {})}}>
                <div style={styles.authFormContent}>
                    <h2 style={{margin: '0 0 2rem 0', fontSize: '2rem', fontWeight: 600, color: styles.theme.colors.text}}>Sign up</h2>
                    <div style={styles.inputGroup}>
                        <label htmlFor="email" style={styles.inputLabel}>Email</label>
                        <input id="email" type="email" placeholder="you@email.com" className="auth-input" style={styles.authInput} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.inputLabel}>Password</label>
                        <input id="password" type="password" placeholder="••••••••" className="auth-input" style={styles.authInput}/>
                    </div>
                    <div style={styles.authConsent}>
                        <input type="checkbox" id="agree" />
                        <label htmlFor="agree">I agree to the <a href="#" style={styles.authConsentLink}>Terms of Service</a> and <a href="#" style={styles.authConsentLink}>Privacy Policy</a>.</label>
                    </div>
                    <button className="primary-button" style={{...styles.primaryButton, width: '100%'}} onClick={handleAction}>Continue</button>
                    <div className="auth-separator" style={styles.authSeparator}><span>OR</span></div>
                    <button style={{...styles.socialButton, ...styles.googleButton}} onClick={handleAction}><span style={styles.socialIcon}>G</span> Continue with Google</button>
                    <button style={{...styles.socialButton, ...styles.githubButton}} onClick={handleAction}><span style={styles.socialIcon}>⚡</span> Continue with GitHub</button>
                </div>
            </div>
        </div>
    );
};
 
 
// --- MAIN DASHBOARD COMPONENT ---
function LanguageLearningDashboard({ isDarkMode, setIsDarkMode }: {
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
}) {
  // Add CSS for webkit scrollbar hiding and other pseudo-selectors
  React.useEffect(() => {
    const styleId = 'component-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .flashcard-carousel-wrapper::-webkit-scrollbar {
          display: none;
        }
        .flashcard-carousel-wrapper {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .tutorial-button:hover {
          background-color: ${isDarkMode ? '#374151' : '#f8f9fa'} !important;
          color: ${isDarkMode ? '#60a5fa' : '#007bff'} !important;
        }
        .theme-toggle-button:hover {
          background-color: ${isDarkMode ? '#374151' : '#f8f9fa'} !important;
          color: ${isDarkMode ? '#60a5fa' : '#007bff'} !important;
        }
        .primary-button:disabled {
          background-color: #e9ecef !important;
          cursor: not-allowed !important;
        }
        .grammar-note-dismiss:hover {
          background-color: #e9ecef !important;
          color: #212529 !important;
        }
        .auth-input:focus {
          border-color: #007bff !important;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1) !important;
          outline: none !important;
        }
        .auth-separator::before,
        .auth-separator::after {
          content: "";
          height: 1px;
          flex: 1;
          background-color: #e9ecef;
        }
        .auth-container {
          position: relative;
          overflow: hidden;
        }
        .auth-form-panel {
          box-sizing: border-box;
        }
        .auth-welcome-panel {
          box-sizing: border-box;
        }
        .footer-list-item:hover {
          color: #007bff !important;
        }
        .footer-social-link:hover {
          transform: scale(1.2) !important;
        }
        .footer-link:hover {
          color: #007bff !important;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 4px #007bff, 0 0 0 9999px rgba(0, 0, 0, 0.6); }
          50% { box-shadow: 0 0 0 6px #007bff, 0 0 0 9999px rgba(0, 0, 0, 0.6); }
          100% { box-shadow: 0 0 0 4px #007bff, 0 0 0 9999px rgba(0, 0, 0, 0.6); }
        }
        .tutorial-skip:hover {
          background-color: rgba(0, 0, 0, 0.1) !important;
        }
 
        /* Mobile-specific improvements */
        @media (max-width: 768px) {
          .flashcard-carousel-wrapper {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }
 
          /* Improve touch targets */
          button, .draggable-word, .sentence-slot {
            min-height: 44px !important;
            min-width: 44px !important;
          }
 
          /* Better mobile typography */
          body {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
 
          /* Prevent zoom on input focus */
          input, select, textarea {
            font-size: 16px !important;
          }
        }
 
        /* Tablet-specific improvements */
        @media (min-width: 769px) and (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, [isDarkMode]);
 
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorialComplete, setShowTutorialComplete] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('spanish');
  const [transitioningTo, setTransitioningTo] = useState<Language | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [currentSentence, setCurrentSentence] = useState<(string | null)[]>([]);
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>({ type: null, message: '' });
  const [isSentenceComplete, setIsSentenceComplete] = useState(false);
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());
  const [completedSentences, setCompletedSentences] = useState<Set<string>>(new Set());
  const [grammarNotes, setGrammarNotes] = useState<GrammarNote[]>([]);
  const [accuracy, setAccuracy] = useState(100);
  const [attempts, setAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [collapsedSections, setCollapsedSections] = useState<CollapsedSections>({
      flashcards: false,
      sentences: false,
      progress: false,
      grammar: false,
  });
 
  // Improved responsive state management
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [windowDimensions, setWindowDimensions] = useState({ width: 1024, height: 768 });
 
  // Update screen size and dimensions on resize
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowDimensions({ width, height });
 
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
 
    // Set initial values
    updateScreenSize();
 
    // Add resize listener
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);
 
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const welcomeRef = useRef<HTMLDivElement>(null);
  const languageSelectorRef = useRef<HTMLDivElement>(null);
  const vocabularyPanelRef = useRef<HTMLElement>(null);
  const sentenceBuilderPanelRef = useRef<HTMLElement>(null);
  const progressContentRef = useRef<HTMLDivElement>(null);
  const grammarContentRef = useRef<HTMLDivElement>(null);
 
    const tutorialRefs = [welcomeRef, languageSelectorRef, vocabularyPanelRef, sentenceBuilderPanelRef, progressContentRef, grammarContentRef];
  
  const currentVocabulary = vocabularyData[selectedLanguage];
  
  // Initialize cardRefs array
  useEffect(() => {
    cardRefs.current = new Array(currentVocabulary.length).fill(null);
  }, [currentVocabulary.length]);
  const currentSentences = sentenceData[selectedLanguage];
  const currentSentenceData = currentSentences[selectedSentenceIndex];
  
  useEffect(() => {
    if (!currentSentenceData) return;
    setCurrentSentence(new Array(currentSentenceData.template.length).fill(null));
    setFeedback({ type: null, message: '' });
    setIsSentenceComplete(false);
  }, [selectedSentenceIndex, selectedLanguage, currentSentenceData]);
  
  useEffect(() => {
    setCurrentCardIndex(0);
    setSelectedSentenceIndex(0);
    setLearnedWords(new Set());
    setCompletedSentences(new Set());
    setGrammarNotes([]);
    setAccuracy(100);
    setAttempts(0);
    setCorrectAttempts(0);
    if(carouselRef.current) carouselRef.current.scrollLeft = 0;
  }, [selectedLanguage]);
 
  const addGrammarNote = useCallback((tipId: string) => {
      const tip = grammarTips[tipId];
      if (tip && !grammarNotes.some(note => note.id === tipId)) {
          setGrammarNotes(prev => [{ ...tip, language: selectedLanguage }, ...prev]);
      }
  }, [grammarNotes, selectedLanguage]);
  
  const removeGrammarNote = (tipId: string) => {
      setGrammarNotes(prev => prev.filter(note => note.id !== tipId));
  }
 
  const handleSubmitSentence = useCallback(() => {
      setAttempts(prev => prev + 1);
      const isCorrect = currentSentence.every((word, index) => word === currentSentenceData.correctOrder[index]);
      if (isCorrect) {
        setFeedback({ type: 'success', message: 'Correct!' });
        setIsSentenceComplete(true);
        setCorrectAttempts(prev => prev + 1);
        setCompletedSentences(prev => new Set(prev).add(currentSentenceData.id));
        setLearnedWords(prev => new Set([...prev, ...(currentSentence as string[])]));
      } else {
        setFeedback({ type: 'error', message: 'Not quite right. Try again.' });
        setIsSentenceComplete(false);
        if(currentSentenceData.grammarTipId){
            addGrammarNote(currentSentenceData.grammarTipId);
        }
      }
  }, [currentSentence, currentSentenceData, addGrammarNote]);
 
  useEffect(() => {
    if (attempts > 0) {
      setAccuracy(Math.round((correctAttempts / attempts) * 100));
    } else {
      setAccuracy(100);
    }
  }, [attempts, correctAttempts]);
  
  const handleLanguageChange = (lang: Language) => {
    if (lang !== selectedLanguage && !transitioningTo) setTransitioningTo(lang);
  };
  const handleTransitionPeak = () => {
    if(transitioningTo) setSelectedLanguage(transitioningTo);
  };
  const handleTransitionEnd = () => setTransitioningTo(null);
 
  const handleDragStart = (word: string, fromIndex: number | null) => {
    setDraggedItem({ word, fromIndex });
  };
 
  const handleDrop = (toIndex: number) => {
    if (!draggedItem) return;
    const { word, fromIndex } = draggedItem;
    const newSentence = [...currentSentence];
    if (fromIndex !== null) {
      const wordAtTarget = newSentence[toIndex];
      newSentence[toIndex] = word;
      newSentence[fromIndex] = wordAtTarget;
    } else {
      newSentence[toIndex] = word;
    }
    setCurrentSentence(newSentence);
    setFeedback({ type: null, message: '' }); 
    setDraggedItem(null);
  };
 
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const changeCard = (direction: 'next' | 'prev') => {
      const newIndex = direction === 'next'
          ? (currentCardIndex + 1) % currentVocabulary.length
          : (currentCardIndex - 1 + currentVocabulary.length) % currentVocabulary.length;
      
      cardRefs.current[newIndex]?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
      });
  };
  
  const onCarouselScroll = useCallback(() => {
    if (!carouselRef.current || currentVocabulary.length === 0) return;
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.scrollWidth / currentVocabulary.length;
    if (cardWidth === 0) return;
    const newIndex = Math.round(scrollLeft / cardWidth);
 
    if (newIndex !== currentCardIndex && newIndex >= 0 && newIndex < currentVocabulary.length) {
        setShowTranslation(false);
        setCurrentCardIndex(newIndex);
    }
  }, [currentCardIndex, currentVocabulary.length]);
 
  const resetSentence = () => {
    setCurrentSentence(new Array(currentSentenceData.template.length).fill(null));
    setFeedback({ type: null, message: '' });
    setIsSentenceComplete(false);
  };
  
  const nextChallenge = () => {
      setSelectedSentenceIndex(prev => (prev + 1) % currentSentences.length);
  };
 
  const toggleSection = useCallback((section: keyof CollapsedSections) => {
    setCollapsedSections(prev => ({...prev, [section]: !prev[section]}));
  }, []);
 
  const startTutorial = () => {
    // Ensure all sections are expanded for tutorial
    setCollapsedSections({
        flashcards: false,
        sentences: false,
        progress: false,
        grammar: false,
    });
 
    // Reset tutorial state
    setTutorialStep(0);
    setIsTutorialActive(true);
  };
 
  const handleFinishTutorial = () => {
    setIsTutorialActive(false);
    setShowTutorialComplete(true);
    setTimeout(() => setShowTutorialComplete(false), 2000);
  }
 
  const dynamicStyles = getStyles(screenSize, windowDimensions, isDarkMode);
  const currentCard = currentVocabulary[currentCardIndex];
 
  if (!currentSentenceData || !currentCard) {
      return <div style={{...dynamicStyles.appContainer, ...dynamicStyles.loadingScreen}}>Loading...</div>;
  }
 
  const isSentenceFilled = currentSentence.every(word => word !== null);
 
  return (
    <div style={dynamicStyles.appContainer}>
      {isTutorialActive && <TutorialGuide currentStep={tutorialStep} setStep={setTutorialStep} targetRefs={tutorialRefs} onFinish={handleFinishTutorial} collapsedSections={collapsedSections} setCollapsedSections={setCollapsedSections} />}
      {showTutorialComplete && <TutorialCompletion />}
      {transitioningTo && <LanguageTransition targetLanguage={transitioningTo} onPeak={handleTransitionPeak} onTransitionEnd={handleTransitionEnd} />}
      
      <header ref={welcomeRef} style={dynamicStyles.header}>
        <h1 style={dynamicStyles.title}>LingoDeck</h1>
        <div ref={languageSelectorRef} style={dynamicStyles.languageSelector}>
          {(Object.keys(languageAssets) as Language[]).map(lang => (
            <button key={lang} onClick={() => handleLanguageChange(lang)} disabled={!!transitioningTo} style={{...dynamicStyles.languageButton, ...(selectedLanguage === lang ? dynamicStyles.languageButtonActive : {})}}>
              <FlagSVG country={languageAssets[lang].flag} size={20} /> <span style={dynamicStyles.langLabel}>{lang}</span>
            </button>
          ))}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="theme-toggle-button"
              style={dynamicStyles.tutorialButton}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>
            <button onClick={startTutorial} className="tutorial-button" style={dynamicStyles.tutorialButton} title="Start Tutorial">
              <FaCircleQuestion size={18} />
            </button>
            <div style={{position: 'relative'}}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                style={dynamicStyles.profileButton}
                title="Profile Menu"
              >
                <FaUser size={16} />
              </button>
              <ProfileDropdown
                isOpen={isProfileDropdownOpen}
                onClose={() => setIsProfileDropdownOpen(false)}
                styles={dynamicStyles}
              />
            </div>
        </div>
      </header>
      
      <main style={dynamicStyles.mainContent}>
        <div style={dynamicStyles.leftPanel}>
           <CollapsiblePanel ref={vocabularyPanelRef} title="Vocabulary Cards" isCollapsed={collapsedSections.flashcards} onToggle={() => toggleSection('flashcards')} styles={dynamicStyles}>
              <div ref={carouselRef} onScroll={onCarouselScroll} className="flashcard-carousel-wrapper" style={dynamicStyles.flashcardCarouselWrapper}>
                  {currentVocabulary.map((card, index) => (
                     <FlashcardItem
                        ref={(el: HTMLDivElement | null) => { cardRefs.current[index] = el; return undefined; }}
                        key={card.id}
                        card={card}
                        isCurrent={card.id === currentCard.id}
                        styles={dynamicStyles}
                        showTranslation={showTranslation}
                        onFlip={() => setShowTranslation(p => !p)}
                        isDarkMode={isDarkMode}
                      />
                  ))}
              </div>
              <div style={dynamicStyles.cardControls}>
                  <button style={dynamicStyles.controlButton} onClick={() => changeCard('prev')} aria-label="Previous card">
                    <FaChevronLeft size={20} />
                  </button>
                  <span style={dynamicStyles.cardCounter}>{currentCardIndex + 1} / {currentVocabulary.length}</span>
                  <button style={dynamicStyles.controlButton} onClick={() => changeCard('next')} aria-label="Next card">
                    <FaChevronRight size={20} />
                  </button>
              </div>
          </CollapsiblePanel>
 
          <CollapsiblePanel title="Grammar Tips" isCollapsed={collapsedSections.grammar} onToggle={() => toggleSection('grammar')} styles={dynamicStyles}>
            <div ref={grammarContentRef} style={dynamicStyles.grammarFeedbackContainer}>
              {grammarNotes.length === 0 ? (
                <p style={dynamicStyles.noGrammarNotes}>No feedback yet. Keep practicing!</p>
              ) : (
                <ul style={dynamicStyles.grammarNoteList}>
                  {grammarNotes.map(note => (
                    <li key={note.id} style={dynamicStyles.grammarNoteItem}>
                      <div style={dynamicStyles.grammarNoteHeader}>
                        <strong style={dynamicStyles.grammarNoteRule}><FlagSVG country={languageAssets[note.language].flag} size={16} /> {note.rule}</strong>
                        <button className="grammar-note-dismiss" style={dynamicStyles.grammarNoteDismiss} onClick={() => removeGrammarNote(note.id)} title="Dismiss tip">✓</button>
                      </div>
                      <p style={dynamicStyles.grammarNoteExample}>{note.example}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CollapsiblePanel>
        </div>
        
        <div style={dynamicStyles.rightPanel}>
          <CollapsiblePanel ref={sentenceBuilderPanelRef} title="Sentence Builder" isCollapsed={collapsedSections.sentences} onToggle={() => toggleSection('sentences')} styles={dynamicStyles}>
               <div style={dynamicStyles.sentenceBuilder}>
                  <p style={dynamicStyles.translationHint}>Construct the sentence: &ldquo;{currentSentenceData.translation}&rdquo;</p>
                  <div style={dynamicStyles.sentenceArea} onDragOver={handleDragOver}>
                      {currentSentence.map((word, index) => (
                        <div key={index} onDrop={() => handleDrop(index)} style={{...dynamicStyles.sentenceSlot, ...(word ? dynamicStyles.filledSlot : {})}} onDragStart={() => handleDragStart(word!, index)} draggable={!!word && !isSentenceComplete}>
                          {word}
                        </div>
                      ))}
                  </div>
                  
                  <div style={dynamicStyles.feedbackContainer}>
                    {feedback.type && (
                        <div style={{...dynamicStyles.feedback, ...(feedback.type === 'success' ? dynamicStyles.successFeedback : dynamicStyles.errorFeedback)}} aria-live="polite">
                        {feedback.message}
                        </div>
                    )}
                  </div>
 
                  <h3 style={dynamicStyles.wordBankTitle}>Word Bank</h3>
                   <div style={dynamicStyles.wordBank}>
                      {currentSentenceData.wordBank.map(word => (
                      <div key={word} draggable={!isSentenceComplete} onDragStart={() => handleDragStart(word, null)} style={{...dynamicStyles.draggableWord, ...(draggedItem?.word === word ? dynamicStyles.draggableWordActive : {}), ...(isSentenceComplete ? { cursor: 'not-allowed', opacity: 0.5 } : {})}}>
                          {word}
                      </div>
                      ))}
                  </div>
                   <div style={dynamicStyles.sentenceControls}>
                      <button style={dynamicStyles.secondaryButton} onClick={resetSentence}>Reset</button>
                      {isSentenceComplete ? (
                          <button className="primary-button" style={dynamicStyles.primaryButton} onClick={nextChallenge}>Next Challenge →</button>
                      ) : (
                          <button className="primary-button" style={dynamicStyles.primaryButton} onClick={handleSubmitSentence} disabled={!isSentenceFilled}>Check Answer</button>
                      )}
                  </div>
              </div>
          </CollapsiblePanel>
          
           <CollapsiblePanel title="Lesson Progress" isCollapsed={collapsedSections.progress} onToggle={() => toggleSection('progress')} styles={dynamicStyles}>
             <div ref={progressContentRef} style={dynamicStyles.progressContainer}>
                <ProgressBar label="Words Learned" value={learnedWords.size} max={currentVocabulary.length} styles={dynamicStyles} />
                <ProgressBar label="Sentences Mastered" value={completedSentences.size} max={currentSentences.length} styles={dynamicStyles} color={dynamicStyles.theme.colors.success} />
                <ProgressBar label="Accuracy" value={accuracy} max={100} unit="%" styles={dynamicStyles} color={accuracy > 75 ? dynamicStyles.theme.colors.success : accuracy > 50 ? dynamicStyles.theme.colors.warning : dynamicStyles.theme.colors.error} />
              </div>
           </CollapsiblePanel>
        </div>
      </main>
      <Footer styles={dynamicStyles} />
    </div>
  );
}
 
// --- SUB-COMPONENTS ---
interface TutorialGuideProps {
  currentStep: number;
  setStep: (step: number | ((prev: number) => number)) => void;
  targetRefs: TutorialRefs;
  onFinish: () => void;
  collapsedSections: CollapsedSections;
  setCollapsedSections: React.Dispatch<React.SetStateAction<CollapsedSections>>;
}

const TutorialGuide = ({ currentStep, setStep, targetRefs, onFinish, collapsedSections, setCollapsedSections }: TutorialGuideProps) => {
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [windowDimensions, setWindowDimensions] = useState({ width: 1024, height: 768 });
    const collapsedSectionsRef = useRef(collapsedSections);
    
    // Update ref when collapsedSections changes
    useEffect(() => {
        collapsedSectionsRef.current = collapsedSections;
    }, [collapsedSections]);
 
    // Update screen size for tutorial
    useEffect(() => {
        const updateScreenSize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            setWindowDimensions({ width, height });
 
            if (width < 768) {
                setScreenSize('mobile');
            } else if (width < 1024) {
                setScreenSize('tablet');
            } else {
                setScreenSize('desktop');
            }
        };
 
        updateScreenSize();
        window.addEventListener('resize', updateScreenSize);
        return () => window.removeEventListener('resize', updateScreenSize);
    }, []);
 
    const styles = getStyles(screenSize, windowDimensions, false);
    const stepData = TUTORIAL_STEPS[currentStep];
 
    useEffect(() => {
        setIsVisible(false);
        setTargetRect(null);
 
        // Ensure relevant panels are expanded for tutorial steps
        const ensurePanelExpanded = () => {
            const currentCollapsedSections = collapsedSectionsRef.current;
            switch (currentStep) {
                case 2: // Vocabulary Flashcards
                    if (currentCollapsedSections.flashcards) {
                        setCollapsedSections((prev: CollapsedSections) => ({ ...prev, flashcards: false }));
                    }
                    break;
                case 3: // Sentence Builder
                    if (currentCollapsedSections.sentences) {
                        setCollapsedSections((prev: CollapsedSections) => ({ ...prev, sentences: false }));
                    }
                    break;
                case 4: // Progress Tracking
                    if (currentCollapsedSections.progress) {
                        setCollapsedSections((prev: CollapsedSections) => ({ ...prev, progress: false }));
                    }
                    break;
                case 5: // Grammar Tips
                    if (currentCollapsedSections.grammar) {
                        setCollapsedSections((prev: CollapsedSections) => ({ ...prev, grammar: false }));
                    }
                    break;
            }
        };
 
        ensurePanelExpanded();
 
        const updateTargetPosition = () => {
            const target = targetRefs[currentStep]?.current;
 
            if (target && typeof window !== 'undefined') {
                // Get position immediately without scrolling first
                const rect = target.getBoundingClientRect();
 
                if (rect.width > 0 && rect.height > 0) {
                    setTargetRect(rect);
                    setIsVisible(true);
 
                    // Scroll into view after setting position
                    setTimeout(() => {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'center'
                        });
                    }, 100);
                } else {
                    // If target has no dimensions, try again after a short delay
                    setTimeout(updateTargetPosition, 150);
                }
            } else {
                // If no target, show tutorial anyway with a default position
                setTargetRect(new DOMRect(100, 100, 200, 50));
                setIsVisible(true);
            }
        };
 
        // Use a delay to ensure DOM is ready and panels are expanded
        const timer = setTimeout(updateTargetPosition, 200);
 
        // Fallback timeout to ensure tutorial never gets stuck
        const fallbackTimer = setTimeout(() => {
            if (!isVisible) {
                setTargetRect(new DOMRect(100, 100, 200, 50));
                setIsVisible(true);
            }
        }, 2000);
 
        // Handle window resize and scroll to update positioning
        const handlePositionUpdate = () => {
            if (isVisible) {
                const target = targetRefs[currentStep]?.current;
                if (target) {
                    const rect = target.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        setTargetRect(rect);
                    }
                }
            }
        };
 
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handlePositionUpdate);
            window.addEventListener('scroll', handlePositionUpdate);
        }
 
        return () => {
            clearTimeout(timer);
            clearTimeout(fallbackTimer);
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handlePositionUpdate);
                window.removeEventListener('scroll', handlePositionUpdate);
            }
        };
    }, [currentStep, targetRefs]);
 
    if (!isVisible) {
        return (
            <div style={styles.tutorialOverlay}>
                <div style={styles.tutorialLoadingBox}>
                    <div style={styles.tutorialSpinner}></div>
                    <p>Preparing step {currentStep + 1}...</p>
                </div>
            </div>
        );
    }
 
    // Calculate tooltip position with proper scroll handling
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768;
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const scrollX = typeof window !== 'undefined' ? window.scrollX : 0;
    const tooltipWidth = 350;
    const tooltipHeight = 200;
    const margin = 20;
 
    // Use targetRect if available, otherwise use center of screen
    const safeTargetRect = targetRect || new DOMRect(
        viewportWidth / 2 - 100,
        viewportHeight / 2 - 25,
        200,
        50
    );
 
    // Convert viewport coordinates to absolute page coordinates
    const absoluteTargetTop = safeTargetRect.top + scrollY;
    const absoluteTargetBottom = safeTargetRect.bottom + scrollY;
    const absoluteTargetLeft = safeTargetRect.left + scrollX;
 
    let tooltipTop = absoluteTargetBottom + margin;
    let tooltipLeft = absoluteTargetLeft + (safeTargetRect.width / 2) - (tooltipWidth / 2);
    let arrowPosition = 'top';
    let arrowLeft = '50%';
 
    // Adjust if tooltip goes off screen horizontally (considering scroll)
    const minLeft = scrollX + margin;
    const maxLeft = scrollX + viewportWidth - tooltipWidth - margin;
 
    if (tooltipLeft < minLeft) {
        tooltipLeft = minLeft;
        arrowLeft = `${absoluteTargetLeft + (safeTargetRect.width / 2) - tooltipLeft}px`;
    } else if (tooltipLeft > maxLeft) {
        tooltipLeft = maxLeft;
        arrowLeft = `${absoluteTargetLeft + (safeTargetRect.width / 2) - tooltipLeft}px`;
    }
 
    // Adjust if tooltip goes off screen vertically (considering scroll)
    const maxTop = scrollY + viewportHeight - tooltipHeight - margin;
 
    if (tooltipTop > maxTop) {
        tooltipTop = absoluteTargetTop - tooltipHeight - margin;
        arrowPosition = 'bottom';
    }
 
    // Ensure tooltip stays within viewport bounds
    const minTop = scrollY + margin;
    tooltipTop = Math.max(minTop, Math.min(tooltipTop, maxTop));
 
    return (
        <div style={styles.tutorialOverlay}>
            {/* Highlight overlay with cutout */}
            <div style={styles.tutorialHighlightOverlay}>
                <div
                    style={{
                        ...styles.tutorialHighlight,
                        top: absoluteTargetTop - 8,
                        left: absoluteTargetLeft - 8,
                        width: safeTargetRect.width + 16,
                        height: safeTargetRect.height + 16,
                    }}
                />
            </div>
 
            {/* Tooltip */}
            <div
                style={{
                    ...styles.tutorialTooltip,
                    top: tooltipTop,
                    left: tooltipLeft,
                    width: tooltipWidth,
                }}
            >
                {/* Arrow */}
                <div
                    style={{
                        ...styles.tutorialArrow,
                        ...(arrowPosition === 'top' ? styles.tutorialArrowTop : styles.tutorialArrowBottom),
                        left: arrowLeft,
                        transform: arrowLeft === '50%' ? 'translateX(-50%)' : 'none'
                    }}
                />
 
                <div style={styles.tutorialTooltipContent}>
                    <h3 style={styles.tutorialTitle}>{stepData.title}</h3>
                    <p style={styles.tutorialContent}>{stepData.content}</p>
 
                    <div style={styles.tutorialControls}>
                        <button
                            style={styles.secondaryButton}
                            onClick={() => setStep((p:number) => Math.max(0, p-1))}
                            disabled={currentStep === 0}
                        >
                            Back
                        </button>
                        <span style={styles.tutorialCounter}>
                            {currentStep + 1} / {TUTORIAL_STEPS.length}
                        </span>
                        {currentStep === TUTORIAL_STEPS.length - 1 ? (
                            <button
                                className="primary-button"
                                style={styles.primaryButton}
                                onClick={onFinish}
                            >
                                Finish
                            </button>
                        ) : (
                            <button
                                className="primary-button"
                                style={styles.primaryButton}
                                onClick={() => setStep((p:number) => p+1)}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
 
                <button className="tutorial-skip" style={styles.tutorialSkip} onClick={onFinish}>
                    <FaXmark size={16} />
                </button>
            </div>
        </div>
    );
};
 
const TutorialCompletion = () => {
    const [visible, setVisible] = useState(false);
    const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [windowDimensions, setWindowDimensions] = useState({ width: 1024, height: 768 });
 
    // Update screen size for tutorial completion
    useEffect(() => {
        const updateScreenSize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            setWindowDimensions({ width, height });
 
            if (width < 768) {
                setScreenSize('mobile');
            } else if (width < 1024) {
                setScreenSize('tablet');
            } else {
                setScreenSize('desktop');
            }
        };
 
        updateScreenSize();
        window.addEventListener('resize', updateScreenSize);
        return () => window.removeEventListener('resize', updateScreenSize);
    }, []);
 
    const styles = getStyles(screenSize, windowDimensions, false);
    useEffect(() => {
        setVisible(true);
    }, []);
    return <div style={{...styles.tutorialCompletion, opacity: visible ? 1 : 0}}>Tutorial Complete!</div>
}
 
interface CollapsiblePanelProps {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  styles: Styles;
}

const CollapsiblePanel = React.forwardRef<HTMLElement, CollapsiblePanelProps>(({ title, isCollapsed, onToggle, children, styles }, ref) => (
    <section ref={ref} style={styles.panel}>
        <h2 style={styles.panelTitle} onClick={onToggle} role="button" aria-expanded={!isCollapsed}>
            <span>{title}</span>
            <span style={{...styles.collapseIcon, ...(isCollapsed ? {} : styles.collapseIconActive)}}>▼</span>
        </h2>
        <div style={{...styles.collapsibleContentContainer, ...(!isCollapsed ? styles.collapsibleContentContainerExpanded : {})}}>
            <div style={styles.collapsibleContentInner}>
                {children}
            </div>
        </div>
    </section>
));
CollapsiblePanel.displayName = 'CollapsiblePanel';
 
 
interface FlashcardItemProps {
  card: Flashcard;
  isCurrent: boolean;
  showTranslation: boolean;
  onFlip: () => void;
  styles: Styles;
  isDarkMode: boolean;
}

const FlashcardItem = React.forwardRef<HTMLDivElement, FlashcardItemProps>(({ card, isCurrent, showTranslation, onFlip, styles, isDarkMode }, ref) => (
    <div ref={ref} style={styles.flashcardContainer}>
        <div style={{...styles.flashcard, ...(isCurrent ? styles.flashcardCurrent : {})}}>
            <div style={{...styles.flashcardInner, ...(showTranslation && isCurrent ? styles.flashcardInnerFlipped : {})}} onClick={isCurrent ? onFlip : undefined}>
                <div style={{...styles.flashcardFace, ...styles.flashcardFront}}>
                    <div style={styles.cardImage}><VocabularySVG type={card.image} size={80} isDarkMode={isDarkMode} /></div>
                    <div style={styles.cardWord}>{card.word}</div>
                    <div style={styles.cardCategory}>{card.category}</div>
                </div>
                <div style={{...styles.flashcardFace, ...styles.flashcardBack}}>
                    <div style={styles.cardTranslation}>{card.translation}</div>
                    <div style={styles.cardCategory}>{card.category}</div>
                </div>
            </div>
        </div>
    </div>
));
FlashcardItem.displayName = 'FlashcardItem';
 
interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  styles: Styles;
  color?: string;
}

const ProgressBar = ({ label, value, max, unit = '', styles, color }: ProgressBarProps) => {
    const [animatedValue, setAnimatedValue] = useState(0);
 
    useEffect(() => {
        const timeout = setTimeout(() => setAnimatedValue(value), 100);
        return () => clearTimeout(timeout);
    }, [value]);
 
    return (
        <div style={styles.progressItem}>
            <div style={styles.progressLabel}>
                <span style={styles.progressTitle}>{label}</span>
                <span style={styles.progressValue}>{value}{unit} / {max}{unit}</span>
            </div>
            <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${(animatedValue / max) * 100}%`, backgroundColor: color || styles.theme.colors.accent }} />
            </div>
        </div>
    );
};
 
const Footer = ({ styles }: { styles: Styles }) => {
    const currentYear = new Date().getFullYear();
 
    return (
        <footer style={styles.footer}>
            <div style={styles.footerContainer}>
                <div style={styles.footerContent}>
                    <div style={styles.footerSection}>
                        <div style={styles.footerBrand}>
                            <div style={styles.footerLogo}>L</div>
                            <div>
                                <h3 style={styles.footerBrandName}>LingoDeck</h3>
                                <p style={styles.footerBrandTagline}>Master languages with interactive learning</p>
                            </div>
                        </div>
                        <p style={styles.footerDescription}>
                            Transform your language learning journey with our innovative flashcard system,
                            sentence building exercises, and comprehensive progress tracking.
                        </p>
                    </div>
 
                    <div style={styles.footerSection}>
                        <h4 style={styles.footerSectionTitle}>Features</h4>
                        <ul style={styles.footerList}>
                            <li className="footer-list-item" style={styles.footerListItem}>Interactive Flashcards</li>
                            <li className="footer-list-item" style={styles.footerListItem}>Sentence Builder</li>
                            <li className="footer-list-item" style={styles.footerListItem}>Progress Tracking</li>
                            <li className="footer-list-item" style={styles.footerListItem}>Grammar Tips</li>
                        </ul>
                    </div>
 
                    <div style={styles.footerSection}>
                        <h4 style={styles.footerSectionTitle}>Languages</h4>
                        <ul style={styles.footerList}>
                            <li className="footer-list-item" style={styles.footerListItem}>ES Spanish</li>
                            <li className="footer-list-item" style={styles.footerListItem}>FR French</li>
                            <li className="footer-list-item" style={styles.footerListItem}>IT Italian</li>
                            <li className="footer-list-item" style={styles.footerListItem}>PT Portuguese</li>
                        </ul>
                    </div>
 
                    <div style={styles.footerSection}>
                        <h4 style={styles.footerSectionTitle}>Connect</h4>
                        <div style={styles.footerSocial}>
                            <a href="#" className="footer-social-link" style={styles.footerSocialLink} title="Twitter">
                              <FaTwitter size={18} />
                            </a>
                            <a href="#" className="footer-social-link" style={styles.footerSocialLink} title="Facebook">
                              <FaFacebook size={18} />
                            </a>
                            <a href="#" className="footer-social-link" style={styles.footerSocialLink} title="Instagram">
                              <FaInstagram size={18} />
                            </a>
                            <a href="#" className="footer-social-link" style={styles.footerSocialLink} title="LinkedIn">
                              <FaLinkedin size={18} />
                            </a>
                        </div>
                        <div style={styles.footerContact}>
                            <p style={styles.footerContactItem}>
                              <FaEnvelope size={14} style={{marginRight: '0.5rem'}} />
                              hello@lingodeck.com
                            </p>
                            <p style={styles.footerContactItem}>
                              <FaGlobe size={14} style={{marginRight: '0.5rem'}} />
                              www.lingodeck.com
                            </p>
                        </div>
                    </div>
                </div>
 
                <div style={styles.footerBottom}>
                    <div style={styles.footerBottomContent}>
                        <p style={styles.footerCopyright}>
                            © {currentYear} LingoDeck. All rights reserved.
                        </p>
                        <div style={styles.footerLinks}>
                            <a href="#" className="footer-link" style={styles.footerLink}>Privacy Policy</a>
                            <span style={styles.footerSeparator}>•</span>
                            <a href="#" className="footer-link" style={styles.footerLink}>Terms of Service</a>
                            <span style={styles.footerSeparator}>•</span>
                            <a href="#" className="footer-link" style={styles.footerLink}>Support</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
 
 
const LanguageTransition = ({ targetLanguage, onPeak, onTransitionEnd }: { targetLanguage: Language, onPeak: () => void, onTransitionEnd: () => void }) => {
    const [animationStage, setAnimationStage] = useState<'start' | 'peaked' | 'end'>('start');
    const { color, flag } = languageAssets[targetLanguage];
    
    useEffect(() => {
        const keyframesId = 'wave-keyframes';
        if (!document.getElementById(keyframesId)) {
            const style = document.createElement('style');
            style.id = keyframesId;
            style.innerHTML = `@keyframes wave-move { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`;
            document.head.appendChild(style);
        }
        const riseTimer = setTimeout(() => { setAnimationStage('peaked'); onPeak(); }, 50);
        const peakTimer = setTimeout(() => setAnimationStage('end'), 1300);
        const fallTimer = setTimeout(onTransitionEnd, 2000);
        return () => { clearTimeout(riseTimer); clearTimeout(peakTimer); clearTimeout(fallTimer); };
    }, [onPeak, onTransitionEnd]);
    
    const overlayStyle: CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', color: 'white', overflow: 'hidden' };
    const waveContainerStyle: CSSProperties = { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '110%', transform: animationStage === 'start' ? 'translateY(100%)' : animationStage === 'peaked' ? 'translateY(0)' : 'translateY(100%)', transition: `transform 0.7s ${animationStage === 'peaked' ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'cubic-bezier(0.55, 0.085, 0.68, 0.53)'}`, backgroundColor: color, };
    const waveStyle: CSSProperties = { position: 'absolute', bottom: '99%', left: 0, width: '200%', height: '120px', animation: 'wave-move 10s linear infinite' };
    const contentStyle: CSSProperties = { position: 'relative', opacity: animationStage === 'peaked' ? 1 : 0, transform: animationStage === 'peaked' ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease-out 0.4s, transform 0.5s ease-out 0.4s', textAlign: 'center', marginBottom: '40vh', };
    
    return (
        <div style={overlayStyle}>
            <div style={waveContainerStyle}>
                <div style={{...waveStyle, animationDuration: '12s', opacity: 0.3, fill: color}}><svg width="100%" height="100%" viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0,64 C240,112 480,112 720,64 S1200,16 1440,64 V120 H0 Z"></path></svg></div>
                <div style={{...waveStyle, animationDuration: '10s', animationDirection: 'reverse', opacity: 0.5, fill: color}}><svg width="100%" height="100%" viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0,80 C240,32 480,32 720,80 S1200,128 1440,80 V120 H0 Z"></path></svg></div>
                <div style={{...waveStyle, animationDuration: '8s', opacity: 1, fill: color}}><svg width="100%" height="100%" viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0,96 C240,144 480,144 720,96 S1200,48 1440,96 V120 H0 Z"></path></svg></div>
            </div>
            <div style={contentStyle}>
                <div style={{ fontSize: '6rem' }}><FlagSVG country={flag} size={120} /></div>
                <h2 style={{ fontSize: '3rem', fontWeight: 700, margin: 0, textTransform: 'capitalize', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>{targetLanguage}</h2>
            </div>
        </div>
    );
};
 
// --- STYLING OBJECT ---
const getStyles = (
  screenSize: 'mobile' | 'tablet' | 'desktop',
  windowDimensions: { width: number; height: number },
  isDarkMode: boolean = false
): Styles => {
    const isMobile = screenSize === 'mobile';
    const isTablet = screenSize === 'tablet';
    const theme = {
        colors: isDarkMode ? {
            background: '#0f0f23',
            panel: '#1a1a2e',
            border: '#16213e',
            text: '#e4e6ea',
            textLight: '#9ca3af',
            accent: '#3b82f6',
            accentLight: 'rgba(59, 130, 246, 0.15)',
            secondary: '#6b7280',
            success: '#10b981',
            error: '#ef4444',
            gradientStart: '#1e40af',
            gradientEnd: '#7c3aed'
        } : {
            background: '#f8f9fa',
            panel: '#ffffff',
            border: '#e9ecef',
            text: '#212529',
            textLight: '#6c757d',
            accent: '#007bff',
            accentLight: 'rgba(0, 123, 255, 0.1)',
            secondary: '#6c757d',
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            gradientStart: '#1A2980',
            gradientEnd: '#26D0CE',
        },
        shadows: isDarkMode ? {
            soft: '0 4px 12px rgba(0, 0, 0, 0.3)',
            medium: '0 8px 24px rgba(0, 0, 0, 0.4)',
            hard: '0 10px 30px rgba(0, 0, 0, 0.6)',
        } : {
            soft: '0 4px 12px rgba(0, 0, 0, 0.05)',
            medium: '0 8px 24px rgba(0, 0, 0, 0.1)',
            hard: '0 10px 30px rgba(0, 0, 0, 0.2)',
        },
        borderRadius: '8px',
        fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };
 
    return {
        theme,
        appContainer: { minHeight: '100vh', backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.fontFamily, display: 'flex', flexDirection: 'column' },
        loadingScreen: { display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '1.5rem' : '2rem' },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '0.75rem 1rem' : '1rem 2rem',
            backgroundColor: theme.colors.panel,
            borderBottom: `1px solid ${theme.colors.border}`,
            position: 'sticky',
            top: 0,
            zIndex: 50,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: isMobile ? '0.5rem' : '1rem'
        },
        title: {
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            fontWeight: 600,
            color: theme.colors.accent,
            marginRight: isMobile ? '0' : 'auto',
            order: isMobile ? 1 : 0,
            width: isMobile ? '100%' : 'auto',
            textAlign: isMobile ? 'center' : 'left'
        },
        languageSelector: {
            display: 'flex',
            gap: isMobile ? '0.25rem' : '0.5rem',
            alignItems: 'center',
            position: isMobile ? 'static' : 'absolute',
            left: isMobile ? 'auto' : '50%',
            transform: isMobile ? 'none' : 'translateX(-50%)',
            order: isMobile ? 2 : 0,
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'center' : 'flex-start'
        },
        languageButton: {
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '0.25rem' : '0.5rem',
            padding: isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: '1px solid transparent',
            color: theme.colors.textLight,
            borderRadius: theme.borderRadius,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: 500,
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            minHeight: '44px' // Ensure touch-friendly size
        },
        languageButtonActive: { color: theme.colors.accent, backgroundColor: theme.colors.accentLight },
        langLabel: { display: isMobile ? 'none' : 'inline' },
        userAvatar: {
            width: isMobile ? '36px' : '40px',
            height: isMobile ? '36px' : '40px',
            borderRadius: '50%',
            backgroundColor: theme.colors.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            color: 'white'
        },
        tutorialButton: {
            backgroundColor: 'transparent',
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.textLight,
            width: isMobile ? '36px' : '40px',
            height: isMobile ? '36px' : '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: isMobile ? '1rem' : '1.2rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px', // Touch-friendly
            minWidth: '44px'
        },
 
        // Profile Button & Dropdown Styles
        profileButton: {
            position: 'relative',
            width: isMobile ? '36px' : '40px',
            height: isMobile ? '36px' : '40px',
            borderRadius: '50%',
            backgroundColor: theme.colors.panel,
            border: `2px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: theme.colors.accent,
            boxShadow: theme.shadows.soft,
            minHeight: '44px', // Touch-friendly
            minWidth: '44px',
            order: isMobile ? 3 : 0
        },
        profileIndicator: {
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            border: '2px solid white',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
        },
        profileDropdown: {
            position: 'absolute',
            top: isMobile ? '45px' : '50px',
            right: '0',
            width: isMobile ? '260px' : '280px',
            backgroundColor: theme.colors.panel,
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            border: `1px solid ${theme.colors.border}`,
            zIndex: 1000,
            overflow: 'hidden',
            maxWidth: isMobile ? 'calc(100vw - 2rem)' : '280px'
        },
        profileDropdownHeader: {
            padding: '20px',
            borderBottom: `1px solid ${theme.colors.border}`
        },
        profileHeaderInfo: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        },
        profileName: {
            fontSize: '16px',
            fontWeight: 600,
            color: theme.colors.text,
            margin: 0
        },
        profileEmail: {
            fontSize: '14px',
            color: theme.colors.textLight,
            margin: 0
        },
        profileDropdownMenu: {
            padding: '8px'
        },
        profileMenuItem: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            color: theme.colors.text,
            transition: 'all 0.2s ease',
            textAlign: 'left'
        },
        profileMenuItemDanger: {
            color: '#ef4444'
        },
        profileDropdownDivider: {
            height: '1px',
            backgroundColor: theme.colors.border,
            margin: '8px 0'
        },
        
        mainContent: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1fr 1fr',
            gap: isMobile ? '1rem' : '2rem',
            padding: isMobile ? '1rem' : '2rem',
            alignItems: 'start',
            flex: 1
        },
        leftPanel: {
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '1rem' : '2rem'
        },
        rightPanel: {
            position: isMobile || isTablet ? 'static' : 'sticky',
            top: 'calc(2rem + 81px)',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '1rem' : '2rem'
        },
        
        panel: {
            backgroundColor: theme.colors.panel,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius,
            boxShadow: theme.shadows.soft
        },
        panelTitle: {
            fontSize: isMobile ? '1.1rem' : '1.2rem',
            fontWeight: 600,
            color: theme.colors.text,
            margin: 0,
            paddingTop: isMobile ? '1rem' : '1.5rem',
            paddingLeft: isMobile ? '1rem' : '1.5rem',
            paddingRight: isMobile ? '1rem' : '1.5rem',
            paddingBottom: isMobile ? '0.75rem' : '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            cursor: 'pointer'
        },
        
        collapseIcon: { fontSize: '1rem', color: theme.colors.textLight, transition: 'transform 0.3s ease', transform: 'rotate(-90deg)' },
        collapseIconActive: { transform: 'rotate(0deg)'},
        collapsibleContentContainer: { display: 'grid', gridTemplateRows: '0fr', transition: 'grid-template-rows 0.4s ease-out' },
        collapsibleContentContainerExpanded: { gridTemplateRows: '1fr' },
        collapsibleContentInner: {
            overflow: 'hidden',
            paddingTop: '0',
            paddingLeft: isMobile ? '1rem' : '1.5rem',
            paddingRight: isMobile ? '1rem' : '1.5rem',
            paddingBottom: isMobile ? '1rem' : '1.5rem'
        },
 
        flashcardCarouselWrapper: {
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            padding: isMobile ? '0.5rem 0' : '1rem 0'
        },
        flashcardContainer: {
            flex: '0 0 100%',
            height: isMobile ? '280px' : '350px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            scrollSnapAlign: 'center'
        },
        flashcard: {
            width: isMobile ? 'calc(100vw - 4rem)' : '320px',
            height: isMobile ? 'calc(100vw - 4rem)' : '320px',
            maxWidth: isMobile ? '280px' : '320px',
            maxHeight: isMobile ? '280px' : '320px',
            transition: 'transform 0.5s ease, opacity 0.5s ease'
        },
        flashcardCurrent: { transform: 'scale(1)', opacity: 1 },
        flashcardInner: { position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform 0.6s' },
        flashcardInnerFlipped: { transform: 'rotateY(180deg)' },
        flashcardFace: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            borderRadius: theme.borderRadius,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: isMobile ? '1rem' : '2rem',
            border: `1px solid ${theme.colors.border}`,
            boxShadow: isDarkMode ? `0 8px 24px rgba(79, 158, 255, 0.3)` : `0 8px 24px rgba(0, 102, 204, 0.15)`,
            cursor: 'pointer'
        },
        flashcardFront: { backgroundColor: theme.colors.panel },
        flashcardBack: { backgroundColor: theme.colors.accent, color: 'white', transform: 'rotateY(180deg)' },
        cardImage: {
            color: theme.colors.accent,
            backgroundColor: isDarkMode ? '#000000' : '#ffffff',
            padding: isMobile ? '0.75rem' : '1rem',
            borderRadius: '8px',
            border: `2px solid ${theme.colors.accent}`,
            minWidth: isMobile ? '60px' : '80px',
            minHeight: isMobile ? '60px' : '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        cardWord: {
            fontSize: isMobile ? '2rem' : '3rem',
            fontWeight: 700,
            color: theme.colors.text,
            marginTop: isMobile ? '0.75rem' : '1rem',
            textAlign: 'center',
            lineHeight: 1.2
        },
        cardTranslation: {
            fontSize: isMobile ? '1.75rem' : '2.5rem',
            fontWeight: 600,
            textAlign: 'center',
            lineHeight: 1.2
        },
        cardCategory: {
            position: 'absolute',
            top: isMobile ? '0.75rem' : '1rem',
            right: isMobile ? '0.75rem' : '1rem',
            backgroundColor: isDarkMode ? '#333333' : '#f0f0f0',
            color: theme.colors.text,
            padding: isMobile ? '0.2rem 0.5rem' : '0.25rem 0.75rem',
            borderRadius: '99px',
            fontSize: isMobile ? '0.65rem' : '0.75rem',
            border: `1px solid ${theme.colors.border}`
        },
        cardControls: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '0.75rem' : '1rem',
            width: '100%',
            marginTop: isMobile ? '1rem' : '1.5rem'
        },
        controlButton: {
            width: isMobile ? '2.5rem' : '3rem',
            height: isMobile ? '2.5rem' : '3rem',
            borderRadius: '50%',
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.panel,
            color: theme.colors.text,
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            minHeight: '44px', // Touch-friendly
            minWidth: '44px'
        },
        cardCounter: {
            fontSize: isMobile ? '0.9rem' : '1rem',
            color: theme.colors.textLight,
            fontWeight: 500,
            minWidth: isMobile ? '40px' : '50px',
            textAlign: 'center'
        },
 
        sentenceBuilder: {
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '0.75rem' : '1rem'
        },
        translationHint: {
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            color: theme.colors.textLight,
            textAlign: 'center',
            marginBottom: '0.5rem'
        },
        sentenceArea: {
            display: 'flex',
            gap: isMobile ? '0.5rem' : '0.75rem',
            flexWrap: 'wrap',
            padding: isMobile ? '0.75rem' : '1rem',
            backgroundColor: theme.colors.background,
            borderRadius: '8px',
            minHeight: isMobile ? '80px' : '100px',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${theme.colors.border}`
        },
        sentenceSlot: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: isMobile ? '44px' : '52px',
            minWidth: isMobile ? '60px' : '80px',
            padding: isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
            backgroundColor: theme.colors.panel,
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: isMobile ? '0.9rem' : '1rem',
            fontWeight: 500,
            color: theme.colors.textLight,
            borderWidth: '2px',
            borderStyle: 'dashed',
            borderColor: theme.colors.border,
            transition: 'all 0.2s ease'
        },
        filledSlot: {
            cursor: 'grab',
            backgroundColor: theme.colors.accentLight,
            borderColor: theme.colors.accent,
            color: theme.colors.accent,
            borderStyle: 'solid',
            fontWeight: 600
        },
        wordBankTitle: {
            fontSize: isMobile ? '0.75rem' : '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: theme.colors.textLight,
            textAlign: 'center',
            marginTop: isMobile ? '0.75rem' : '1rem'
        },
        wordBank: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '0.5rem' : '0.75rem',
            justifyContent: 'center',
            padding: isMobile ? '0.75rem' : '1rem',
            borderTop: `1px solid ${theme.colors.border}`,
            marginTop: isMobile ? '0.75rem' : '1rem'
        },
        draggableWord: {
            padding: isMobile ? '0.5rem 0.875rem' : '0.5rem 1rem',
            backgroundColor: theme.colors.panel,
            borderRadius: '2rem',
            textAlign: 'center',
            cursor: 'grab',
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            fontWeight: 500,
            color: theme.colors.text,
            transition: 'all 0.2s ease',
            border: `1px solid ${isDarkMode ? '#ffffff' : theme.colors.border}`,
            boxShadow: theme.shadows.soft,
            minHeight: '44px', // Touch-friendly
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        draggableWordActive: {
            cursor: 'grabbing',
            backgroundColor: theme.colors.accent,
            color: 'white',
            transform: 'scale(1.05)',
            boxShadow: theme.shadows.medium
        },
        feedbackContainer: {
            minHeight: isMobile ? '32px' : '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        feedback: {
            width: '100%',
            padding: isMobile ? '0.625rem' : '0.75rem',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            fontWeight: 600,
            transition: 'transform 0.2s'
        },
        successFeedback: {
            backgroundColor: isDarkMode ? 'rgba(0, 208, 132, 0.2)' : 'rgba(40, 167, 69, 0.1)',
            color: theme.colors.success,
            border: `1px solid ${theme.colors.success}`
        },
        errorFeedback: {
            backgroundColor: isDarkMode ? 'rgba(255, 71, 87, 0.2)' : 'rgba(220, 53, 69, 0.1)',
            color: theme.colors.error,
            border: `1px solid ${theme.colors.error}`
        },
        sentenceControls: {
            display: 'flex',
            gap: isMobile ? '0.75rem' : '1rem',
            justifyContent: isMobile ? 'center' : 'flex-end',
            marginTop: isMobile ? '0.75rem' : '1rem',
            flexWrap: isMobile ? 'wrap' : 'nowrap'
        },
        primaryButton: {
            padding: isMobile ? '0.75rem 1.25rem' : '0.75rem 1.5rem',
            backgroundColor: theme.colors.accent,
            color: isDarkMode ? '#000000' : '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: isMobile ? '0.8rem' : '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxSizing: 'border-box',
            minHeight: '44px', // Touch-friendly
            flex: isMobile ? '1' : 'none'
        },
        secondaryButton: {
            padding: isMobile ? '0.75rem 1.25rem' : '0.75rem 1.5rem',
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
            color: isDarkMode ? '#ffffff' : theme.colors.textLight,
            border: `1px solid ${isDarkMode ? '#ffffff' : theme.colors.border}`,
            borderRadius: '8px',
            fontSize: isMobile ? '0.8rem' : '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            minHeight: '44px', // Touch-friendly
            flex: isMobile ? '1' : 'none'
        },
        
        progressContainer: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
        progressItem: {},
        progressLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' },
        progressTitle: { fontSize: '0.9rem', fontWeight: 500, color: theme.colors.text },
        progressValue: { fontSize: '0.8rem', fontWeight: 400, color: theme.colors.textLight },
        progressBar: { width: '100%', height: '16px', backgroundColor: isDarkMode ? '#333333' : '#e0e0e0', borderRadius: theme.borderRadius, overflow: 'hidden', boxShadow: isDarkMode ? 'inset 0 1px 2px rgba(255,255,255,0.1)' : 'inset 0 1px 2px rgba(0,0,0,0.1)' },
        progressFill: { height: '100%', transition: 'width 0.5s ease-out, background-color 0.4s ease' },
 
        grammarFeedbackContainer: { maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' },
        noGrammarNotes: { color: theme.colors.textLight, textAlign: 'center', fontStyle: 'italic' },
        grammarNoteList: {
            listStyle: 'none',
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0,
            margin: 0
        },
        grammarNoteItem: {
            position: 'relative',
            marginBottom: '1rem',
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: '1rem',
            borderBottom: `1px solid ${theme.colors.border}`
        },
        grammarNoteHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' },
        grammarNoteRule: { display: 'block', fontWeight: 600, color: theme.colors.text },
        grammarNoteDismiss: {
            backgroundColor: 'transparent',
            border: 'none',
            color: theme.colors.textLight,
            cursor: 'pointer',
            fontSize: '1rem',
            paddingTop: '0.25rem',
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem',
            paddingBottom: '0.25rem',
            borderRadius: '50%'
        },
        grammarNoteExample: { fontSize: '0.9rem', color: theme.colors.textLight, margin: 0, lineHeight: 1.5 },
 
        authContainer: { display: 'flex', width: '100vw', height: '100vh', backgroundColor: theme.colors.background, transition: 'opacity 0.5s ease', overflow: 'hidden', position: 'relative' },
        authLoadingScreen: { width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(45deg, ${theme.colors.gradientStart}, ${theme.colors.gradientEnd})` },
        authWelcomePanel: {
            width: isMobile ? '100vw' : '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(45deg, ${theme.colors.gradientStart}, ${theme.colors.gradientEnd})`,
            color: 'white',
            transition: 'all 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
            flexShrink: 0,
            position: isMobile ? 'absolute' : 'relative',
            zIndex: isMobile ? 1 : 'auto'
        },
        authWelcomePanelActive: {
            width: isMobile ? '0vw' : '50vw',
            transform: isMobile ? 'translateX(-100%)' : 'none'
        },
        authFormPanel: {
            width: isMobile ? '100vw' : '50vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: isMobile ? '2rem' : '4rem 4rem 4rem 4rem',
            opacity: 0,
            transform: isMobile ? 'translateX(100%)' : 'translateX(20px)',
            transition: 'opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s',
            flexShrink: 0,
            backgroundColor: theme.colors.background,
            position: isMobile ? 'absolute' : 'relative',
            zIndex: isMobile ? 2 : 'auto',
            height: isMobile ? '100vh' : 'auto',
            overflowY: isMobile ? 'auto' : 'visible'
        },
        authFormPanelActive: {
            opacity: 1,
            transform: 'translateX(0)'
        },
        authFormContent: {
            maxWidth: isMobile ? '100%' : '380px',
            width: '100%',
            margin: '0 auto',
            paddingTop: '0',
            paddingLeft: '0',
            paddingRight: isMobile ? '0' : '1rem',
            paddingBottom: '0',
            boxSizing: 'border-box'
        },
        authLogo: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '2rem', backdropFilter: 'blur(10px)', border: '2px solid rgba(255, 255, 255, 0.3)' },
        authTitle: {
            fontSize: isMobile ? '2.5rem' : '4rem',
            fontWeight: 700,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            paddingTop: '0',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            paddingBottom: '0',
            position: 'relative',
            lineHeight: 1.2
        },
          
        authSubtitle: { fontSize: '1.2rem', marginTop: '0.5rem', opacity: 0.8 },
        authPrompt: { color: theme.colors.textLight, marginBottom: '2rem' },
        inputGroup: { width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' },
        inputLabel: { fontSize: '0.9rem', fontWeight: 600, color: isDarkMode ? '#e4e6ea' : theme.colors.text, marginBottom: '0.25rem' },
        authInput: { padding: '0.75rem 1rem', borderRadius: theme.borderRadius, border: `1px solid ${theme.colors.border}`, fontSize: '1rem', boxSizing: 'border-box', backgroundColor: isDarkMode ? theme.colors.panel : '#ffffff', color: theme.colors.text },
        authConsent: { display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: '0.8rem', color: theme.colors.textLight, margin: '1rem 0' },
        authConsentLink: { color: isDarkMode ? '#60a5fa' : '#007bff', textDecoration: 'underline' },
        authSeparator: { margin: '1.5rem 0', color: theme.colors.textLight, textAlign: 'center', display: 'flex', alignItems: 'center', gap: '1rem' },
        socialButton: { padding: '0.75rem 1.5rem', backgroundColor: theme.colors.panel, color: theme.colors.text, borderWidth: '1px', borderStyle: 'solid', borderColor: theme.colors.border, borderRadius: theme.borderRadius, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', width: '100%', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxSizing: 'border-box' },
        googleButton: { backgroundColor: '#ffffff', borderColor: '#dadce0', color: '#3c4043' },
        githubButton: { backgroundColor: '#24292e', borderColor: '#24292e', color: '#ffffff' },
        socialIcon: { fontSize: '1.2rem', fontWeight: 'bold'},
        
        tutorialOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: typeof document !== 'undefined' ? Math.max(document.documentElement.scrollHeight || 0, typeof window !== 'undefined' ? window.innerHeight : 768) + 'px' : '100vh',
            zIndex: 150,
            pointerEvents: 'none'
        },
        tutorialHighlightOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.6)',
            pointerEvents: 'none'
        },
        tutorialHighlight: {
            position: 'absolute',
            borderRadius: '8px',
            boxShadow: `0 0 0 4px ${theme.colors.accent}, 0 0 0 9999px rgba(0, 0, 0, 0.6)`,
            border: `2px solid ${theme.colors.accent}`,
            pointerEvents: 'none',
            zIndex: 151,
            animation: 'pulse 2s ease-in-out infinite'
        },
        tutorialTooltip: {
            position: 'absolute',
            backgroundColor: theme.colors.panel,
            borderRadius: theme.borderRadius,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: `1px solid ${theme.colors.border}`,
            zIndex: 152,
            pointerEvents: 'auto',
            maxWidth: '400px',
            minWidth: '300px'
        },
        tutorialTooltipContent: {
            padding: '1.5rem'
        },
        tutorialArrow: {
            position: 'absolute',
            width: 0,
            height: 0,
            borderStyle: 'solid'
        },
        tutorialArrowTop: {
            top: '-8px',
            borderWidth: '0 8px 8px 8px',
            borderColor: `transparent transparent ${theme.colors.panel} transparent`
        },
        tutorialArrowBottom: {
            bottom: '-8px',
            borderWidth: '8px 8px 0 8px',
            borderColor: `${theme.colors.panel} transparent transparent transparent`
        },
        tutorialLoadingBox: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: theme.colors.panel,
            padding: '2rem',
            borderRadius: theme.borderRadius,
            boxShadow: theme.shadows.hard,
            textAlign: 'center',
            pointerEvents: 'auto'
        },
        tutorialSpinner: {
            width: '24px',
            height: '24px',
            borderWidth: '3px',
            borderStyle: 'solid',
            borderColor: theme.colors.border,
            borderTopColor: theme.colors.accent,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
        },
        tutorialTitle: {
            marginTop: 0,
            fontSize: '1.2rem',
            color: theme.colors.accent,
            marginBottom: '0.75rem',
            fontWeight: 600
        },
        tutorialContent: {
            lineHeight: 1.5,
            color: theme.colors.text,
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            margin: 0
        },
        tutorialControls: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.5rem',
            gap: '0.5rem'
        },
        tutorialCounter: {
            color: theme.colors.textLight,
            fontWeight: 500,
            fontSize: '0.8rem',
            backgroundColor: theme.colors.background,
            padding: '0.25rem 0.5rem',
            borderRadius: '12px',
            border: `1px solid ${theme.colors.border}`
        },
        tutorialSkip: {
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            color: theme.colors.textLight,
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '0.5rem',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        tutorialCompletion: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '2rem 4rem', backgroundColor: theme.colors.accent, color: 'white', borderRadius: theme.borderRadius, zIndex: 200, boxShadow: theme.shadows.hard, transition: 'opacity 0.3s ease' },
 
        // Footer Styles
        footer: {
            backgroundColor: theme.colors.panel,
            borderTop: `1px solid ${theme.colors.border}`,
            marginTop: isMobile ? '2rem' : '4rem'
        },
        footerContainer: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: isMobile ? '2rem 1rem' : isTablet ? '3rem 1.5rem' : '4rem 2rem'
        },
        footerContent: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '1.5rem' : isTablet ? '2rem' : '3rem',
            marginBottom: isMobile ? '2rem' : '3rem'
        },
        footerSection: { display: 'flex', flexDirection: 'column', gap: '1rem' },
        footerBrand: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' },
        footerLogo: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: theme.colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'white', flexShrink: 0 },
        footerBrandName: { fontSize: '1.5rem', fontWeight: 700, color: theme.colors.text, margin: 0 },
        footerBrandTagline: { fontSize: '0.9rem', color: theme.colors.textLight, margin: '0.25rem 0 0 0' },
        footerDescription: { fontSize: '0.9rem', color: theme.colors.textLight, lineHeight: 1.6, margin: 0 },
        footerSectionTitle: { fontSize: '1.1rem', fontWeight: 600, color: theme.colors.text, margin: 0, marginBottom: '0.5rem' },
        footerList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
        footerListItem: { fontSize: '0.9rem', color: theme.colors.textLight, cursor: 'pointer', transition: 'color 0.2s ease' },
        footerSocial: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
        footerSocialLink: { fontSize: '1.5rem', textDecoration: 'none', transition: 'transform 0.2s ease' },
        footerContact: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
        footerContactItem: { fontSize: '0.9rem', color: theme.colors.textLight, margin: 0 },
        footerBottom: {
            borderTop: `1px solid ${theme.colors.border}`,
            paddingTop: '2rem',
            paddingLeft: '0',
            paddingRight: '0',
            paddingBottom: '0'
        },
        footerBottomContent: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1rem' : 0,
            textAlign: isMobile ? 'center' : 'left'
        },
        footerCopyright: { fontSize: '0.9rem', color: theme.colors.textLight, margin: 0 },
        footerLinks: { display: 'flex', alignItems: 'center', gap: '1rem' },
        footerLink: { fontSize: '0.9rem', color: theme.colors.textLight, textDecoration: 'none', transition: 'color 0.2s ease' },
        footerSeparator: { color: theme.colors.border, fontSize: '0.8rem' }
    };
};