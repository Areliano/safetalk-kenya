import { createClient } from '@supabase/supabase-js'

// These would normally be environment variables
// For demo purposes, using placeholder values
const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Report {
  id: string
  token: string
  issue_type: string
  description: string
  allow_followup: boolean
  timestamp: string
  school_name?: string
  region?: string
}

export interface ChatSession {
  id: string
  session_id: string
  start_time: string
  is_active: boolean
  last_activity?: string
}

export interface Message {
  id: string
  session_id: string
  sender: 'student' | 'counselor'
  content: string
  timestamp: string
}

// Helper function to generate anonymous tokens
export const generateToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Database operations
export const createReport = async (reportData: Omit<Report, 'id' | 'token' | 'timestamp'>) => {
  const token = generateToken()
  const { data, error } = await supabase
    .from('reports')
    .insert({
      ...reportData,
      token,
      timestamp: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return { ...data, token }
}

export const createChatSession = async (token: string) => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      session_id: token,
      start_time: new Date().toISOString(),
      is_active: true
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const sendMessage = async (sessionId: string, sender: 'student' | 'counselor', content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      session_id: sessionId,
      sender,
      content,
      timestamp: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getMessages = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: true })

  if (error) throw error
  return data as Message[]
}

export const getReports = async () => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('timestamp', { ascending: false })

  if (error) throw error
  return data as Report[]
}

export const getActiveSessions = async () => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('is_active', true)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data as ChatSession[]
}