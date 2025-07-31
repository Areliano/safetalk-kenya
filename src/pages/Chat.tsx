import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Send, Bot, User, MessageCircle } from 'lucide-react'
import { ChatBot } from '@/utils/chatbot'
import { CaseIdInput } from '@/components/CaseIdInput'

interface Message {
  id: string
  sender: 'student' | 'counselor' | 'bot'
  content: string
  timestamp: string
  suggested_actions?: string[]
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [token, setToken] = useState('')
  const [caseId, setCaseId] = useState<string | null>(null)
  const [showCaseInput, setShowCaseInput] = useState(false)
  const [searchParams] = useSearchParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { toast } = useToast()
  const chatBot = new ChatBot()

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    const caseIdFromUrl = searchParams.get('caseId')
    const storedSessionId = sessionStorage.getItem('chatSessionId')
    
    if (tokenFromUrl) {
      loadChat(tokenFromUrl)
    } else if (caseIdFromUrl) {
      handleCaseIdAccess({ reportId: '', chatSessionId: '', caseId: caseIdFromUrl })
    } else if (storedSessionId) {
      setSessionId(storedSessionId)
      setIsConnected(true)
      loadExistingChat(storedSessionId)
    }
  }, [searchParams])

  // Real-time subscription for new messages
  useEffect(() => {
    if (!sessionId) return

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          // Only add messages not sent by current user to avoid duplicates
          const newMessage = payload.new as any
          if (newMessage.sender !== 'student') {
            setMessages(prev => [...prev, {
              id: newMessage.id,
              sender: newMessage.sender,
              content: newMessage.content,
              timestamp: newMessage.timestamp
            }])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleCaseIdAccess = async (caseData: { reportId: string; chatSessionId?: string; caseId: string }) => {
    setIsLoading(true)
    setCaseId(caseData.caseId)
    
    try {
      let currentSessionId: string

      if (caseData.chatSessionId) {
        // Existing chat session found
        currentSessionId = caseData.chatSessionId
      } else {
        // Create new chat session linked to the case
        const { data: newSession, error: createError } = await supabase
          .from('chat_sessions')
          .insert({
            token: `CASE-${caseData.caseId}`,
            case_id: caseData.caseId,
            status: 'active'
          })
          .select()
          .single()

        if (createError) throw createError
        currentSessionId = newSession.id
      }

      setSessionId(currentSessionId)
      setIsConnected(true)
      
      // Store session for persistence
      sessionStorage.setItem('chatSessionId', currentSessionId)
      
      // Load existing messages
      await loadExistingChat(currentSessionId)
      
      // Add initial bot message if no messages exist
      if (messages.length === 0) {
        await addBotMessage(currentSessionId, chatBot.getInitialMessage())
      }
    } catch (error) {
      console.error('Error accessing case:', error)
      toast({
        title: "Error",
        description: "Failed to access case chat session",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadChat = async (tokenValue: string) => {
    setIsLoading(true)
    try {
      // Check if chat session already exists for this token
      const { data: existingSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('token', tokenValue)
        .maybeSingle()

      if (sessionError && sessionError.code !== 'PGRST116') {
        throw sessionError
      }

      let currentSessionId: string

      if (existingSession) {
        currentSessionId = existingSession.id
      } else {
        // Create new chat session
        const { data: newSession, error: createError } = await supabase
          .from('chat_sessions')
          .insert({
            token: tokenValue,
            status: 'active'
          })
          .select()
          .single()

        if (createError) throw createError
        currentSessionId = newSession.id
      }

      setSessionId(currentSessionId)
      setToken(tokenValue)
      setIsConnected(true)
      
      // Store session for persistence
      sessionStorage.setItem('chatSessionId', currentSessionId)
      
      // Load existing messages
      await loadExistingChat(currentSessionId)
      
      // Add initial bot message if no messages exist
      if (messages.length === 0) {
        await addBotMessage(currentSessionId, chatBot.getInitialMessage())
      }
    } catch (error) {
      console.error('Error loading chat:', error)
      toast({
        title: "Error",
        description: "Failed to load chat session",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadExistingChat = async (sessionId: string) => {
    try {
      const { data: existingMessages } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true })

      if (existingMessages) {
        const formattedMessages: Message[] = existingMessages.map(msg => ({
          id: msg.id,
          sender: msg.sender as 'student' | 'counselor' | 'bot',
          content: msg.content,
          timestamp: msg.timestamp
        }))
        setMessages(formattedMessages)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
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
    try {
      await supabase
        .from('messages')
        .insert({
          session_id: sessionId,
          sender: 'bot',
          content: response.message,
          message_type: 'text'
        })
    } catch (error) {
      console.error('Error saving bot message:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputValue.trim() || !sessionId) return

    const message: Message = {
      id: crypto.randomUUID(),
      sender: 'student',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    }

    // Add to local state immediately
    setMessages(prev => [...prev, message])
    
    // Save to database
    try {
      await supabase
        .from('messages')
        .insert({
          session_id: sessionId,
          sender: 'student',
          content: inputValue.trim(),
          message_type: 'text'
        })
    } catch (error) {
      console.error('Error saving message:', error)
    }

    const userInput = inputValue.trim()
    setInputValue('')

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
    
    try {
      await supabase
        .from('messages')
        .insert({
          session_id: sessionId,
          sender: 'student',
          content: action,
          message_type: 'text'
        })
    } catch (error) {
      console.error('Error saving message:', error)
    }

    // Get bot response
    setTimeout(async () => {
      const botResponse = chatBot.getResponse(action)
      await addBotMessage(sessionId, botResponse)
    }, 1000)
  }

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (token.trim()) {
      loadChat(token.trim())
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-96">
        <div className="text-center">
          <MessageCircle className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading chat...</p>
        </div>
      </div>
    )
  }

  if (!isConnected && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Your Chat</h1>
          <p className="text-muted-foreground mb-8">
            Enter your case ID or chat token to continue your conversation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Case ID Input */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Have a Case ID?</h2>
            <CaseIdInput onCaseFound={handleCaseIdAccess} />
          </div>

          {/* Token Input */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Have a Chat Token?</h2>
            <Card className="w-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-fit">
                  <MessageCircle className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Connect with Token</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTokenSubmit} className="space-y-4">
                  <Input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter your chat token"
                    required
                  />
                  <Button type="submit" className="w-full">
                    Connect to Chat
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Anonymous Chat
            </div>
            <div className="flex gap-2">
              {caseId && (
                <Badge variant="default">Case #{caseId}</Badge>
              )}
              {token && (
                <Badge variant="outline">Token: {token}</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs md:max-w-md ${
                  message.sender === 'student' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {message.sender === 'student' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'student'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    
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
                              className="text-xs h-6"
                            >
                              {action}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
