import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/hooks/use-toast'
import { SimpleBarChart, SimplePieChart, SimpleLineChart } from '@/components/ui/simple-chart'
import { supabase } from '@/integrations/supabase/client'
import { AdminSignup } from '@/components/AdminSignup'
import { 
  Shield, 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  BarChart3,
  Calendar,
  Filter,
  UserPlus,
  Eye,
  EyeOff
} from 'lucide-react'

// Mock analytics data
const mockReportsData = [
  { type: 'Bullying', count: 45 },
  { type: 'Mental Health', count: 32 },
  { type: 'Harassment', count: 28 },
  { type: 'Grooming', count: 12 },
  { type: 'Family Issues', count: 23 },
  { type: 'Other', count: 18 }
]

const mockTimelineData = [
  { date: 'Jan', reports: 20 },
  { date: 'Feb', reports: 35 },
  { date: 'Mar', reports: 42 },
  { date: 'Apr', reports: 38 },
  { date: 'May', reports: 58 },
  { date: 'Jun', reports: 45 }
]

const mockRecentReports = [
  {
    id: 'ST1A2B3C',
    type: 'Bullying',
    timestamp: '2024-01-15 14:30',
    status: 'Active',
    hasChat: true
  },
  {
    id: 'ST4D5E6F',
    type: 'Mental Health',
    timestamp: '2024-01-15 13:45',
    status: 'Resolved',
    hasChat: false
  },
  {
    id: 'ST7G8H9I',
    type: 'Harassment',
    timestamp: '2024-01-15 12:20',
    status: 'In Progress',
    hasChat: true
  }
]

export const Admin: React.FC = () => {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [realTimeData, setRealTimeData] = useState({
    totalReports: 0,
    activeChats: 0,
    recentReports: [],
    activeSessions: []
  })

  // Real-time data subscription
  useEffect(() => {
    loadRealTimeData()

    const reportsChannel = supabase
      .channel('reports-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, loadRealTimeData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' }, loadRealTimeData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, loadRealTimeData)
      .subscribe()

    return () => {
      supabase.removeChannel(reportsChannel)
    }
  }, [])

  const loadRealTimeData = async () => {
    try {
      // Get total reports
      const { count: totalReports } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })

      // Get active chat sessions
      const { data: activeSessions } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())

      // Get recent reports
      const { data: recentReports } = await supabase
        .from('reports')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10)

      setRealTimeData({
        totalReports: totalReports || 0,
        activeChats: activeSessions?.length || 0,
        recentReports: recentReports || [],
        activeSessions: activeSessions || []
      })
    } catch (error) {
      console.error('Error loading real-time data:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Query admin users table
      const { data: admin, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !admin) {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive"
        })
        return
      }

      // Basic password check (in production, use proper password hashing)
      const providedPasswordHash = btoa(password)
      if (admin.password_hash === providedPasswordHash) {
        setIsAuthenticated(true)
        toast({
          title: "Login successful",
          description: `Welcome back, ${admin.full_name}!`,
          variant: "default"
        })
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword('')
    setEmail('')
  }

  // Show signup component
  if (showSignup) {
    return (
      <AdminSignup 
        onBack={() => setShowSignup(false)}
        onSignupSuccess={() => {
          setShowSignup(false)
          toast({
            title: "Account Created",
            description: "Please login with your new credentials",
          })
        }}
      />
    )
  }

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md shadow-strong bg-gradient-card border-0">
          <CardHeader className="text-center">
            <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">{t('admin.login')}</CardTitle>
            <CardDescription>
              Enter admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12" 
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setShowSignup(true)}
                className="text-sm"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Admin Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-gradient-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('admin.title')}</h1>
              <p className="text-muted-foreground">Monitor reports, manage chats, and view analytics</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="chats">Active Chats</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-medium bg-gradient-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                  <Shield className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{realTimeData.totalReports}</div>
                  <p className="text-xs text-muted-foreground">Real-time count</p>
                </CardContent>
              </Card>

              <Card className="shadow-medium bg-gradient-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                  <MessageCircle className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{realTimeData.activeChats}</div>
                  <p className="text-xs text-muted-foreground">Currently ongoing</p>
                </CardContent>
              </Card>

              <Card className="shadow-medium bg-gradient-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-safe" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">2.4h</div>
                  <p className="text-xs text-muted-foreground">Average response</p>
                </CardContent>
              </Card>

              <Card className="shadow-medium bg-gradient-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">87%</div>
                  <p className="text-xs text-muted-foreground">Cases resolved</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-medium bg-gradient-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-accent" />
                    <span>Urgent Reports</span>
                  </CardTitle>
                  <CardDescription>Reports requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-accent/10 rounded-lg">
                      <span className="text-sm font-medium">Grooming Report - ST7G8H9I</span>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-accent/10 rounded-lg">
                      <span className="text-sm font-medium">Bullying Report - ST1A2B3C</span>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium bg-gradient-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Counselor Status</span>
                  </CardTitle>
                  <CardDescription>Current counselor availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dr. Sarah Mwangi</span>
                      <span className="text-xs bg-safe/20 text-safe px-2 py-1 rounded">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">James Ochieng</span>
                      <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded">Busy</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mary Wanjiku</span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Offline</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="shadow-medium bg-gradient-card border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>Latest anonymous reports from students</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-sm font-medium">{report.id}</span>
                          <span className="text-sm text-muted-foreground">{report.type}</span>
                          {report.hasChat && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Has Chat</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{report.timestamp}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          report.status === 'Active' ? 'bg-safe/20 text-safe' :
                          report.status === 'Resolved' ? 'bg-muted text-muted-foreground' :
                          'bg-warning/20 text-warning'
                        }`}>
                          {report.status}
                        </span>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chats Tab */}
          <TabsContent value="chats" className="space-y-6">
            <Card className="shadow-medium bg-gradient-card border-0">
              <CardHeader>
                <CardTitle>Active Chat Sessions</CardTitle>
                <CardDescription>Ongoing conversations with students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active chat sessions at the moment</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Students can start conversations using their anonymous tokens
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-medium bg-gradient-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Reports by Type</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SimplePieChart 
                    data={mockReportsData} 
                    dataKey="count" 
                    nameKey="type"
                  />
                </CardContent>
              </Card>

              <Card className="shadow-medium bg-gradient-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Reports Over Time</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleLineChart 
                    data={mockTimelineData} 
                    dataKey="reports" 
                    xAxisKey="date"
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-medium bg-gradient-card border-0">
              <CardHeader>
                <CardTitle>Report Volume Analysis</CardTitle>
                <CardDescription>Monthly report distribution by issue type</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart 
                  data={mockReportsData} 
                  dataKey="count" 
                  xAxisKey="type"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}