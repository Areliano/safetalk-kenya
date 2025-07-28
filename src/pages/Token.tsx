import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TokenGenerator } from '@/components/TokenGenerator'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  MessageSquare, 
  Key, 
  Shield, 
  Clock, 
  Users, 
  ArrowRight,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export const Token: React.FC = () => {
  const { t } = useLanguage()
  const [generatedToken, setGeneratedToken] = useState('')

  const handleTokenGenerated = (token: string) => {
    setGeneratedToken(token)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="hero-gradient px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
            <Key className="h-4 w-4 text-primary" />
            Secure Token System
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Anonymous Chat Access
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate a secure token to start anonymous conversations with trained counselors
          </p>
        </div>
      </section>

      <div className="px-6 py-12 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Token Generator */}
          <div className="space-y-6">
            <TokenGenerator 
              onTokenGenerated={handleTokenGenerated}
              className="w-full"
            />

            {/* Action Buttons */}
            {generatedToken && (
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-center">Ready to Chat?</CardTitle>
                  <CardDescription className="text-center">
                    Use your token to start a confidential conversation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/chat">
                    <Button className="w-full h-12 btn-primary">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Enter Anonymous Chat
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Your token: <span className="font-mono font-bold text-primary">{generatedToken}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            {/* How It Works */}
            <Card className="card-elevated">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-5 w-5 text-primary" />
                  <CardTitle>How Anonymous Tokens Work</CardTitle>
                </div>
                <CardDescription>
                  Understanding our privacy-first approach to student safety
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Generate Your Token</h4>
                      <p className="text-sm text-muted-foreground">
                        Create a unique, anonymous identifier with custom prefix
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Enter Secure Chat</h4>
                      <p className="text-sm text-muted-foreground">
                        Use your token to access encrypted chat with counselors
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Get Professional Help</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive support while maintaining complete anonymity
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Features */}
            <Card className="card-elevated">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Privacy & Security</CardTitle>
                </div>
                <CardDescription>
                  Your safety and privacy are our top priorities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">Complete Anonymity</h4>
                    <p className="text-xs text-muted-foreground">
                      No personal information required or stored
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">Auto-Expiring Sessions</h4>
                    <p className="text-xs text-muted-foreground">
                      Tokens expire after 48 hours for enhanced privacy
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">Trained Counselors</h4>
                    <p className="text-xs text-muted-foreground">
                      Licensed professionals available in English & Kiswahili
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">Encrypted Communication</h4>
                    <p className="text-xs text-muted-foreground">
                      All messages are encrypted and secure
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="border-warning/20 bg-warning/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <CardTitle className="text-warning">Important Notice</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  • Keep your token private and secure
                </p>
                <p className="text-sm">
                  • Each token can only be used once
                </p>
                <p className="text-sm">
                  • For emergencies, contact 116 immediately
                </p>
                <p className="text-sm">
                  • Counselors may recommend school intervention if you're at risk
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Link to="/report">
            <Card className="card-elevated hover:scale-105 transition-transform cursor-pointer">
              <CardContent className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Submit Anonymous Report</h3>
                <p className="text-sm text-muted-foreground">
                  Report issues without revealing your identity
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/resources">
            <Card className="card-elevated hover:scale-105 transition-transform cursor-pointer">
              <CardContent className="text-center p-6">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Emergency Resources</h3>
                <p className="text-sm text-muted-foreground">
                  Immediate help and emergency contacts
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/chat">
            <Card className="card-elevated hover:scale-105 transition-transform cursor-pointer">
              <CardContent className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Access Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Enter chat room with your token
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}