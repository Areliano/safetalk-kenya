import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/hooks/use-toast'
import { Send, MessageCircle, Shield, User, UserCheck } from 'lucide-react'

interface Message {
  id: string
  sender: 'student' | 'counselor'
  content: string
  timestamp: string
}

// Mock messages for demo
const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'counselor',
    content: 'Hello, I received your report and I\'m here to help. Thank you for reaching out - that took courage. How are you feeling right now?',
    timestamp: new Date(Date.now() - 300000).toISOString()
  }
]

export const Chat: React.FC = () => {
  const { t } = useLanguage()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [token, setToken] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    const tokenFromSession = sessionStorage.getItem('reportToken')
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
      loadChat(tokenFromUrl)
    } else if (tokenFromSession) {
      setToken(tokenFromSession)
      loadChat(tokenFromSession)
    } else {
      setIsLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadChat = async (tokenValue: string) => {
    setIsLoading(true)
    try {
      // Mock loading messages
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessages(mockMessages)
      setIsConnected(true)
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Could not load chat. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !token) return

    const message: Message = {
      id: Date.now().toString(),
      sender: 'student',
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Mock counselor response
    setTimeout(() => {
      const counselorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'counselor',
        content: 'Thank you for sharing that with me. I understand this must be difficult. Can you tell me more about what support you might need right now?',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, counselorResponse])
    }, 2000)
  }

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (token.trim()) {
      navigate(`/chat?token=${token.trim()}`)
      loadChat(token.trim())
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="shadow-medium">
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-4 animate-pulse" />
              <p>{t('chat.connecting')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!token || !isConnected) {
    return (
      <div className="min-h-screen py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-strong bg-gradient-card border-0">
            <CardHeader className="text-center">
              <div className="bg-gradient-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle>{t('chat.title')}</CardTitle>
              <CardDescription>
                Enter your anonymous token to continue your conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTokenSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="token">Anonymous Token</Label>
                  <Input
                    id="token"
                    placeholder="Enter your token (e.g., ST1A2B3C)"
                    value={token}
                    onChange={(e) => setToken(e.target.value.toUpperCase())}
                    className="h-12 font-mono text-center text-lg tracking-widest"
                  />
                </div>
                <Button type="submit" className="w-full h-12">
                  Start Chat
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Chat Header */}
      <div className="bg-gradient-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-primary p-2 rounded-full">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold">{t('chat.title')}</h1>
                <p className="text-sm text-muted-foreground">Token: {token}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-safe rounded-full"></div>
              <span>Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-4 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-lg ${
                message.sender === 'student' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* Avatar */}
                <div className={`p-2 rounded-full ${
                  message.sender === 'student' 
                    ? 'bg-primary' 
                    : 'bg-accent'
                }`}>
                  {message.sender === 'student' ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <UserCheck className="h-4 w-4 text-accent-foreground" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`p-3 rounded-lg shadow-medium ${
                  message.sender === 'student'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'student' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-gradient-card border-t border-border shadow-soft">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <div className="flex-1">
              <Input
                placeholder={t('chat.placeholder')}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="h-12"
                maxLength={1000}
              />
            </div>
            <Button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="h-12 px-6"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:block ml-2">{t('chat.send')}</span>
            </Button>
          </form>
          
          <div className="mt-2 text-center">
            <p className="text-xs text-muted-foreground">
              {t('chat.counselor_offline')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}