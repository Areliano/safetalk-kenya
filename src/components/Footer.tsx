import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Heart, Shield } from 'lucide-react'

export const Footer: React.FC = () => {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border bg-gradient-card py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">SafeTalk Kenya</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Creating safe spaces for students to seek help and support anonymously. 
              Your privacy and safety are our top priorities.
            </p>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Emergency Contacts</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Emergency: <span className="font-medium text-accent">999</span></p>
              <p>Childline: <span className="font-medium text-primary">116</span></p>
              <p>Crisis Text: <span className="font-medium text-primary">15151</span></p>
            </div>
          </div>

          {/* Privacy Notice */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Privacy & Safety</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• All reports are anonymous</li>
              <li>• No personal data is stored</li>
              <li>• Conversations expire automatically</li>
              <li>• Trained counselors available</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 SafeTalk Kenya. Built for student safety and wellbeing.
          </p>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-2 md:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-accent fill-current" />
            <span>for Kenya's students</span>
          </div>
        </div>
      </div>
    </footer>
  )
}