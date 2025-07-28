import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { Copy, CheckCircle, MessageCircle, Home, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export const Token: React.FC = () => {
  const { t } = useLanguage()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [token, setToken] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const savedToken = sessionStorage.getItem('reportToken')
    if (!savedToken) {
      navigate('/')
      return
    }
    setToken(savedToken)
  }, [navigate])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      toast({
        title: "Token copied!",
        description: "Your anonymous token has been copied to clipboard.",
        variant: "default"
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please manually copy your token from above.",
        variant: "destructive"
      })
    }
  }

  if (!token) {
    return null
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-muted/30">
      <div className="container mx-auto max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-primary p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-strong animate-pulse">
            <CheckCircle className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('token.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            Your report has been received safely and anonymously.
          </p>
        </div>

        {/* Token Display */}
        <Card className="mb-8 shadow-strong bg-gradient-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span>{t('token.your_token')}</span>
            </CardTitle>
            <CardDescription>
              {t('token.save_token')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Token Display */}
              <div className="bg-muted/50 p-6 rounded-lg border-2 border-dashed border-primary/30">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-mono font-bold text-primary mb-2 tracking-widest">
                    {token}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Keep this token safe - you'll need it for any follow-up conversations
                  </p>
                </div>
              </div>

              {/* Copy Button */}
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                className="w-full h-12"
                disabled={copied}
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Token
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Important Information:</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Your report has been sent to our trained counselors</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Use your token to start an anonymous chat if you want to talk more</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">•</span>
                  <span>This token will remain active for 48 hours for your privacy</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">•</span>
                  <span>A counselor may reach out to you through the chat system</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-medium hover:shadow-strong transition-all duration-300 border-0 bg-gradient-card">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg flex items-center justify-center space-x-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>Start Chat</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Ready to talk with a counselor?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to={`/chat?token=${token}`}>
                  {t('token.start_chat')}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-strong transition-all duration-300 border-0 bg-gradient-card">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg flex items-center justify-center space-x-2">
                <Home className="h-5 w-5 text-primary" />
                <span>Return Home</span>
              </CardTitle>
              <CardDescription className="text-sm">
                You can always come back later
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">
                  {t('token.home')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Support Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Remember: You are not alone. Help is available.
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="font-medium text-accent">Emergency: 999</span>
            <span className="font-medium text-primary">Childline: 116</span>
          </div>
        </div>
      </div>
    </div>
  )
}