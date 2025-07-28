import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'en' | 'sw'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionary
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.report': 'Report Issue',
    'nav.chat': 'Anonymous Chat',
    'nav.resources': 'Resources',
    'nav.admin': 'Admin Login',
    
    // Home page
    'home.title': 'SafeTalk Kenya',
    'home.subtitle': 'Your Voice. Your Safety. Your Anonymity.',
    'home.description': 'A safe space for students to report issues and get support anonymously',
    'home.report_button': 'Report an Issue',
    'home.chat_button': 'Continue Chat',
    'home.resources_button': 'Get Help & Resources',
    
    // Report form
    'report.title': 'Anonymous Report',
    'report.subtitle': 'Share your concern safely and anonymously',
    'report.issue_type': 'Type of Issue',
    'report.issue_bullying': 'Bullying',
    'report.issue_harassment': 'Harassment',
    'report.issue_grooming': 'Grooming/Inappropriate Contact',
    'report.issue_mental_health': 'Mental Health',
    'report.issue_family': 'Family Issues',
    'report.issue_other': 'Other',
    'report.description': 'Description',
    'report.description_placeholder': 'Please describe what happened. You can include as much or as little detail as you feel comfortable sharing.',
    'report.followup': 'Allow follow-up conversation?',
    'report.followup_description': 'Check this if you\'re open to chatting with a counselor about your report',
    'report.school_optional': 'School Name (Optional)',
    'report.submit': 'Submit Report',
    'report.submitting': 'Submitting...',
    
    // Token page
    'token.title': 'Report Submitted Successfully',
    'token.your_token': 'Your Anonymous Token',
    'token.save_token': 'Please save this token safely. You\'ll need it to continue any conversation with a counselor.',
    'token.start_chat': 'Start Anonymous Chat',
    'token.home': 'Return Home',
    
    // Chat
    'chat.title': 'Anonymous Chat',
    'chat.connecting': 'Connecting...',
    'chat.placeholder': 'Type your message...',
    'chat.send': 'Send',
    'chat.counselor_offline': 'Counselors are currently offline. Your message will be received when they come online.',
    
    // Resources
    'resources.title': 'Help & Resources',
    'resources.emergency': 'Emergency Contacts',
    'resources.helpline': 'National Helpline: 116',
    'resources.crisis': 'Crisis Text Line: Send SMS to 123456',
    'resources.mental_health': 'Mental Health Support',
    'resources.tips': 'Self-Care Tips',
    
    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.login': 'Admin Login',
    'admin.reports': 'Recent Reports',
    'admin.active_chats': 'Active Chats',
    'admin.analytics': 'Analytics Overview',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.back': 'Back',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
  },
  sw: {
    // Navigation
    'nav.home': 'Nyumbani',
    'nav.report': 'Ripoti Tatizo',
    'nav.chat': 'Mazungumzo ya Siri',
    'nav.resources': 'Rasilimali',
    'nav.admin': 'Kuingia kwa Msimamizi',
    
    // Home page
    'home.title': 'SafeTalk Kenya',
    'home.subtitle': 'Sauti Yako. Usalama Wako. Siri Yako.',
    'home.description': 'Mahali salama kwa wanafunzi kuripoti masuala na kupata msaada kwa siri',
    'home.report_button': 'Ripoti Tatizo',
    'home.chat_button': 'Endelea na Mazungumzo',
    'home.resources_button': 'Pata Msaada na Rasilimali',
    
    // Report form
    'report.title': 'Ripoti ya Siri',
    'report.subtitle': 'Shiriki wasiwasi wako kwa usalama na siri',
    'report.issue_type': 'Aina ya Tatizo',
    'report.issue_bullying': 'Uonevu',
    'report.issue_harassment': 'Unyanyasaji',
    'report.issue_grooming': 'Mawasiliano Yasiyofaa',
    'report.issue_mental_health': 'Afya ya Akili',
    'report.issue_family': 'Masuala ya Familia',
    'report.issue_other': 'Mengineyo',
    'report.description': 'Maelezo',
    'report.description_placeholder': 'Tafadhali eleza kilichotokea. Unaweza kujumuisha maelezo mengi au machache kama unavyojisikia vizuri kushiriki.',
    'report.followup': 'Ruhusu mazungumzo ya kufuata?',
    'report.followup_description': 'Chagua hii ikiwa uko tayari kuzungumza na mshauri kuhusu ripoti yako',
    'report.school_optional': 'Jina la Shule (Si Lazima)',
    'report.submit': 'Tuma Ripoti',
    'report.submitting': 'Inatuma...',
    
    // Token page
    'token.title': 'Ripoti Imetumwa Kwa Mafanikio',
    'token.your_token': 'Tokeni Yako ya Siri',
    'token.save_token': 'Tafadhali hifadhi tokeni hii kwa usalama. Utaihitaji kuendelea na mazungumzo yoyote na mshauri.',
    'token.start_chat': 'Anza Mazungumzo ya Siri',
    'token.home': 'Rudi Nyumbani',
    
    // Chat
    'chat.title': 'Mazungumzo ya Siri',
    'chat.connecting': 'Inaunganisha...',
    'chat.placeholder': 'Andika ujumbe wako...',
    'chat.send': 'Tuma',
    'chat.counselor_offline': 'Washauri hawako mtandaoni sasa. Ujumbe wako utapokelewa wakati watakapokuwa mtandaoni.',
    
    // Resources
    'resources.title': 'Msaada na Rasilimali',
    'resources.emergency': 'Nambari za Dharura',
    'resources.helpline': 'Simu ya Kitaifa ya Msaada: 116',
    'resources.crisis': 'Laini ya Maandishi ya Dharura: Tuma SMS kwa 123456',
    'resources.mental_health': 'Msaada wa Afya ya Akili',
    'resources.tips': 'Vidokezo vya Kujitunza',
    
    // Admin
    'admin.title': 'Dashibodi ya Msimamizi',
    'admin.login': 'Kuingia kwa Msimamizi',
    'admin.reports': 'Ripoti za Hivi Karibuni',
    'admin.active_chats': 'Mazungumzo Yanayoendelea',
    'admin.analytics': 'Muhtasari wa Takwimu',
    
    // Common
    'common.loading': 'Inapakia...',
    'common.error': 'Kuna tatizo',
    'common.back': 'Rudi',
    'common.close': 'Funga',
    'common.save': 'Hifadhi',
    'common.cancel': 'Ghairi',
  }
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}