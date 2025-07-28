import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TokenGenerator } from '@/components/TokenGenerator'
import { 
  Shield, 
  MessageCircle, 
  Key, 
  Clock,
  Users,
  BookOpen
} from 'lucide-react'

export const TokenManager: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-primary p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-strong">
            <Key className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Token Management
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate secure anonymous tokens for students or access existing conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Token Generator */}
          <TokenGenerator className="h-fit" />

          {/* How to Use Tokens */}
          <Card className="shadow-medium bg-gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>How Tokens Work</span>
              </CardTitle>
              <CardDescription>
                Understanding the SafeTalk token system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Anonymous & Secure</h4>
                    <p className="text-xs text-muted-foreground">
                      Tokens provide access without revealing identity
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Chat Access</h4>
                    <p className="text-xs text-muted-foreground">
                      Use tokens to start or continue conversations
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Time Limited</h4>
                    <p className="text-xs text-muted-foreground">
                      Tokens expire after 48 hours for privacy
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Counselor Access</h4>
                    <p className="text-xs text-muted-foreground">
                      Trained counselors can respond using the token
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-medium hover:shadow-strong transition-all duration-300 border-0 bg-gradient-card">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg flex items-center justify-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Report Issue</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Submit a new anonymous report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/report">Create Report</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-strong transition-all duration-300 border-0 bg-gradient-card">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg flex items-center justify-center space-x-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>Join Chat</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Continue an existing conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a href="/chat">Access Chat</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-strong transition-all duration-300 border-0 bg-gradient-card">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg flex items-center justify-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Get Help</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Emergency contacts and resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a href="/resources">View Resources</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}