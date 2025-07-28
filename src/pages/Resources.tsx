import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { Phone, MessageCircle, Heart, Shield, BookOpen, Users, AlertTriangle, Clock } from 'lucide-react'

export const Resources: React.FC = () => {
  const { t } = useLanguage()

  const emergencyContacts = [
    {
      name: 'National Emergency',
      number: '999',
      description: 'Police, Fire, Medical emergencies',
      icon: AlertTriangle,
      color: 'text-accent'
    },
    {
      name: 'Childline Kenya',
      number: '116',
      description: 'Free 24/7 helpline for children',
      icon: Shield,
      color: 'text-primary'
    },
    {
      name: 'Gender-Based Violence',
      number: '1195',
      description: 'National GBV helpline',
      icon: Heart,
      color: 'text-safe'
    },
    {
      name: 'Crisis Text Line',
      number: '15151',
      description: 'Text HELLO for immediate support',
      icon: MessageCircle,
      color: 'text-warning'
    }
  ]

  const mentalHealthTips = [
    {
      title: 'Take Deep Breaths',
      description: 'When feeling overwhelmed, try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8.',
      icon: Heart
    },
    {
      title: 'Talk to Someone',
      description: 'Share your feelings with a trusted friend, family member, teacher, or counselor.',
      icon: Users
    },
    {
      title: 'Take Breaks',
      description: 'Step away from stressful situations. Go for a walk, listen to music, or do something you enjoy.',
      icon: Clock
    },
    {
      title: 'Stay Connected',
      description: 'Maintain relationships with people who care about you. You are not alone.',
      icon: Heart
    }
  ]

  const schoolResources = [
    {
      title: 'Guidance & Counseling Teacher',
      description: 'Every school should have a trained counselor. Ask at the school office.',
      action: 'Find Your Counselor'
    },
    {
      title: 'Head Teacher/Principal',
      description: 'For serious issues that need immediate school administration attention.',
      action: 'Report to Administration'
    },
    {
      title: 'Trusted Teacher',
      description: 'Any teacher you feel comfortable talking to can help or direct you to appropriate support.',
      action: 'Identify Safe Adults'
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-primary p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-strong">
            <BookOpen className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('resources.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Immediate help, emergency contacts, and mental health support resources available to you 24/7.
          </p>
        </div>

        {/* Emergency Contacts */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('resources.emergency')}
            </h2>
            <p className="text-muted-foreground">
              These numbers are always available when you need immediate help
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyContacts.map((contact, index) => {
              const IconComponent = contact.icon
              return (
                <Card key={index} className="shadow-medium hover:shadow-strong transition-all duration-300 border-0 bg-gradient-card">
                  <CardHeader className="text-center">
                    <div className={`p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-primary`}>
                      <IconComponent className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {contact.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className={`text-2xl font-bold mb-3 ${contact.color}`}>
                      {contact.number}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(`tel:${contact.number}`, '_self')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Mental Health Support */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('resources.mental_health')}
            </h2>
            <p className="text-muted-foreground">
              Simple strategies to help you cope and feel better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentalHealthTips.map((tip, index) => {
              const IconComponent = tip.icon
              return (
                <Card key={index} className="shadow-medium hover:shadow-strong transition-all duration-300 border-0 bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="bg-gradient-primary p-2 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span>{tip.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tip.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* School Resources */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Support at School
            </h2>
            <p className="text-muted-foreground">
              People at your school who can help you
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {schoolResources.map((resource, index) => (
              <Card key={index} className="shadow-medium hover:shadow-strong transition-all duration-300 border-0 bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {resource.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Safety Tips */}
        <section className="mb-12">
          <Card className="shadow-strong bg-gradient-card border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground mb-4">
                Remember: You Are Not Alone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-primary mb-3">If you're in immediate danger:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Call 999 for emergency services</li>
                    <li>• Go to a safe place with trusted adults</li>
                    <li>• Tell someone you trust what's happening</li>
                    <li>• Keep important phone numbers saved</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-3">For ongoing support:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Use our anonymous reporting system</li>
                    <li>• Talk to a school counselor</li>
                    <li>• Reach out to trusted family or friends</li>
                    <li>• Contact professional helplines</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="shadow-medium bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Need to Report Something?
              </h3>
              <p className="text-muted-foreground mb-6">
                Use our safe, anonymous reporting system to get the help you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <a href="/report">Report an Issue</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="/chat">Continue a Chat</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}