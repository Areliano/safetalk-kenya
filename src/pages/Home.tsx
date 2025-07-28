import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { Shield, MessageCircle, BookOpen, Users, Lock, Heart } from 'lucide-react'

export const Home: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 px-4">
        <div className="container mx-auto text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              {t('home.subtitle')}
            </p>
            <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
              {t('home.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 shadow-strong"
              >
                <Link to="/report" className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>{t('home.report_button')}</span>
                </Link>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-white/5 backdrop-blur-sm border-white/30 text-white hover:bg-white/10"
              >
                <Link to="/chat" className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>{t('home.chat_button')}</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Safe. Anonymous. Supportive.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide a secure platform where students can seek help without fear, 
              connecting them with trained counselors who understand their challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Anonymous Reporting */}
            <Card className="shadow-medium hover:shadow-strong transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader className="text-center">
                <div className="bg-gradient-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Complete Anonymity</CardTitle>
                <CardDescription>
                  Report issues without revealing your identity. No registration required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• No personal information stored</li>
                  <li>• Anonymous token system</li>
                  <li>• Secure encrypted communications</li>
                </ul>
              </CardContent>
            </Card>

            {/* Professional Support */}
            <Card className="shadow-medium hover:shadow-strong transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader className="text-center">
                <div className="bg-gradient-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Trained Counselors</CardTitle>
                <CardDescription>
                  Connect with qualified professionals who understand student challenges.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Certified counselors available</li>
                  <li>• Specialized in youth issues</li>
                  <li>• Crisis intervention training</li>
                </ul>
              </CardContent>
            </Card>

            {/* 24/7 Support */}
            <Card className="shadow-medium hover:shadow-strong transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader className="text-center">
                <div className="bg-gradient-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Always Available</CardTitle>
                <CardDescription>
                  Get help when you need it most, with resources available round the clock.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Emergency helpline access</li>
                  <li>• Self-help resources</li>
                  <li>• Crisis support protocols</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="shadow-medium hover:shadow-strong transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span>Need Help Now?</span>
                </CardTitle>
                <CardDescription>
                  Access immediate resources and emergency contacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/resources">{t('home.resources_button')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-all duration-300 border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <span>Continue Conversation</span>
                </CardTitle>
                <CardDescription>
                  Have a token? Continue your anonymous chat with a counselor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/chat">{t('home.chat_button')}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Anonymous</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">Safe</div>
              <div className="text-sm text-muted-foreground">& Secure</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">Free</div>
              <div className="text-sm text-muted-foreground">Always</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}