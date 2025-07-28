import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  MessageSquare, 
  FileText, 
  Shield, 
  Users, 
  Clock, 
  Heart,
  ArrowRight,
  KeyRound,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Lock
} from 'lucide-react'

export const Home: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
            <Shield className="h-4 w-4 text-primary" />
            100% Anonymous & Secure
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            {t('home.title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t('home.description')}
          </p>

          {/* Main CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/report">
              <Button size="lg" className="btn-primary w-full sm:w-auto h-14 px-8 text-lg">
                <FileText className="h-5 w-5 mr-2" />
                {t('home.report_button')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/token">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg border-2 hover:bg-primary/5">
                <KeyRound className="h-5 w-5 mr-2" />
                Get Token & Chat
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Anonymous</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">Safe</div>
              <div className="text-sm text-muted-foreground">& Secure</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">Free</div>
              <div className="text-sm text-muted-foreground">Service</div>
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
                  <MessageSquare className="h-6 w-6 text-primary" />
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