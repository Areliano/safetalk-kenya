import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/hooks/use-toast'
import { Send, MessageCircle, Shield, User, UserCheck, Bot, Clock } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { ChatBot } from '@/utils/chatbot'

interface Message {
  id: string
  sender: 'student' | 'counselor' | 'bot'
  content: string
  timestamp: string
  suggested_actions?: string[]
}

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
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [chatBot] = useState(() => new ChatBot())
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null)

  // Real-time subscription for messages
  useEffect(() => {
    if (!sessionId) return

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          const newMessage = payload.new as any
          setMessages(prev => [...prev, {
            id: newMessage.id,
            sender: newMessage.sender,
            content: newMessage.content,
            timestamp: newMessage.timestamp
          }])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId])

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
      // Check if chat session exists
      const { data: session } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('token', tokenValue)
        .single()

      if (session) {
        // Check if session is expired
        if (new Date(session.expires_at) < new Date()) {
          toast({
            title: "Session Expired",
            description: "This chat session has expired. Please generate a new token.",
            variant: "destructive"
          })
          return
        }

        setSessionId(session.id)
        setSessionExpiry(new Date(session.expires_at))

        // Load existing messages
        const { data: existingMessages } = await supabase
          .from('messages')
          .select('*')
          .eq('session_id', session.id)
          .order('timestamp', { ascending: true })

        if (existingMessages) {
          const formattedMessages: Message[] = existingMessages.map(msg => ({
            id: msg.id,
            sender: msg.sender as 'student' | 'counselor' | 'bot',
            content: msg.content,
            timestamp: msg.timestamp,
            suggested_actions: msg.message_type === 'bot_suggestion' ? JSON.parse(msg.content || '[]') : undefined
          }))
          setMessages(formattedMessages)
        }
      } else {
        // Create new session
        const { data: newSession, error } = await supabase
          .from('chat_sessions')
          .insert([{ token: tokenValue }])
          .select()
          .single()

        if (error) {
          throw error
        }

        setSessionId(newSession.id)
        setSessionExpiry(new Date(newSession.expires_at))

        // Send initial bot message
        const initialResponse = chatBot.getInitialMessage()
        await addBotMessage(newSession.id, initialResponse)
      }

      setIsConnected(true)
    } catch (error) {
      console.error('Error loading chat:', error)
      toast({
        title: "Connection failed",
        description: "Could not load chat. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addBotMessage = async (sessionId: string, response: { message: string; suggestedActions?: string[] }) => {
    const botMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'bot',
      content: response.message,
      timestamp: new Date().toISOString(),
      suggested_actions: response.suggestedActions
    }

    // Add to local state immediately for responsiveness
    setMessages(prev => [...prev, botMessage])

    // Save to database
    await supabase
      .from('messages')
      .insert([{
        session_id: sessionId,
        sender: 'bot',
        content: response.message,
        message_type: response.suggestedActions ? 'bot_suggestion' : 'text'
      }])
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !token || !sessionId) return

    const message: Message = {
      id: crypto.randomUUID(),
      sender: 'student',
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    }

    // Add to local state immediately
    setMessages(prev => [...prev, message])
    
    // Save to database
    await supabase
      .from('messages')
      .insert([{
        session_id: sessionId,
        sender: 'student',
        content: newMessage.trim(),
        message_type: 'text'
      }])

    const userInput = newMessage.trim()
    setNewMessage('')

    // Get bot response
    setTimeout(async () => {
      const botResponse = chatBot.getResponse(userInput)
      await addBotMessage(sessionId, botResponse)
    }, 1000)
  }

  const handleSuggestedAction = async (action: string) => {
    if (!sessionId) return

    const message: Message = {
      id: crypto.randomUUID(),
      sender: 'student',
      content: action,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, message])
    
    await supabase
      .from('messages')
      .insert([{
        session_id: sessionId,
        sender: 'student',
        content: action,
        message_type: 'text'
      }])

    // Get bot response
    setTimeout(async () => {
      const botResponse = chatBot.getResponse(action)
      await addBotMessage(sessionId, botResponse)
    }, 1000)
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
                    : message.sender === 'bot'
                    ? 'bg-accent'
                    : 'bg-safe'
                }`}>
                  {message.sender === 'student' ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : message.sender === 'bot' ? (
                    <Bot className="h-4 w-4 text-accent-foreground" />
                  ) : (
                    <UserCheck className="h-4 w-4 text-safe-foreground" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`p-3 rounded-lg shadow-medium ${
                  message.sender === 'student'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border'
                }`}>
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Badge variant="secondary" className="text-xs">
                        AI Counselor
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Suggested Actions */}
                  {message.suggested_actions && message.suggested_actions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-muted-foreground">Quick responses:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggested_actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestedAction(action)}
                            className="text-xs h-8"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className={`text-xs mt-1 ${
                    message.sender === 'student' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {formatTime(message.timestamp)}
                    {sessionExpiry && message.sender === 'bot' && (
                      <span className="ml-2 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Expires: {sessionExpiry.toLocaleDateString()}
                      </span>
                    )}
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