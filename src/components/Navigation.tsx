import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { Shield, Globe } from 'lucide-react'

export const Navigation: React.FC = () => {
  const { language, setLanguage, t } = useLanguage()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="border-b border-border bg-gradient-card shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-primary p-2 rounded-lg shadow-medium group-hover:shadow-strong transition-all duration-300">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SafeTalk Kenya
              </h1>
              <p className="text-xs text-muted-foreground">Anonymous & Safe</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/">{t('nav.home')}</Link>
            </Button>
            <Button
              variant={isActive('/report') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/report">{t('nav.report')}</Link>
            </Button>
            <Button
              variant={isActive('/chat') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/chat">{t('nav.chat')}</Link>
            </Button>
            <Button
              variant={isActive('/resources') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/resources">{t('nav.resources')}</Link>
            </Button>
          </div>

          {/* Language Toggle & Admin */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
              className="flex items-center space-x-1"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'en' ? 'Kiswahili' : 'English'}</span>
            </Button>
            
            <Button
              variant={isActive('/admin') ? 'default' : 'outline'}
              size="sm"
              asChild
            >
              <Link to="/admin">{t('nav.admin')}</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex flex-wrap gap-2">
          <Button
            variant={isActive('/') ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/">{t('nav.home')}</Link>
          </Button>
          <Button
            variant={isActive('/report') ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/report">{t('nav.report')}</Link>
          </Button>
          <Button
            variant={isActive('/chat') ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/chat">{t('nav.chat')}</Link>
          </Button>
          <Button
            variant={isActive('/resources') ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/resources">{t('nav.resources')}</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}