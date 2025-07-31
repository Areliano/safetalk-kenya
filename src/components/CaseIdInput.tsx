import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Key, ArrowRight } from 'lucide-react'

interface CaseIdInputProps {
  onCaseFound: (caseData: { reportId: string; chatSessionId?: string; caseId: string }) => void
}

export const CaseIdInput: React.FC<CaseIdInputProps> = ({ onCaseFound }) => {
  const [caseId, setCaseId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const handleCaseIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!caseId.trim()) {
      setError('Please enter a case ID')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // First, look for the report with this case ID
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .select('*')
        .eq('case_id', caseId.trim())
        .maybeSingle()

      if (reportError) {
        throw reportError
      }

      if (!report) {
        setError('No case found with this ID. Please check your case ID and try again.')
        return
      }

      // Look for existing chat session with this case ID
      const { data: chatSession, error: chatError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('case_id', caseId.trim())
        .maybeSingle()

      if (chatError && chatError.code !== 'PGRST116') { // Ignore "no rows" error
        throw chatError
      }

      // Pass the found data to parent component
      onCaseFound({
        reportId: report.id,
        chatSessionId: chatSession?.id,
        caseId: caseId.trim()
      })

      toast({
        title: "Case Found!",
        description: `Case #${caseId} has been loaded successfully.`,
      })

    } catch (error) {
      console.error('Error finding case:', error)
      setError('An error occurred while searching for your case. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-fit">
          <Key className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle>Enter Your Case ID</CardTitle>
        <CardDescription>
          Use your 6-digit case ID to access your previous report and chat history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCaseIdSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caseId">Case ID</Label>
            <Input
              id="caseId"
              type="text"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="e.g., 123456"
              maxLength={6}
              className="text-center text-lg font-mono"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !caseId.trim()}
          >
            {isLoading ? (
              'Searching...'
            ) : (
              <>
                Access My Case
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have a case ID? You'll get one when you submit a new report.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}