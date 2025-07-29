import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { Shield, AlertTriangle, Heart, Users, Home, HelpCircle } from 'lucide-react'

export const Report: React.FC = () => {
  const { t } = useLanguage()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    issue_type: '',
    description: '',
    allow_followup: false,
    school_name: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const issueTypes = [
    { value: 'bullying', label: t('report.issue_bullying'), icon: Users },
    { value: 'harassment', label: t('report.issue_harassment'), icon: AlertTriangle },
    { value: 'grooming', label: t('report.issue_grooming'), icon: Shield },
    { value: 'mental_health', label: t('report.issue_mental_health'), icon: Heart },
    { value: 'family', label: t('report.issue_family'), icon: Home },
    { value: 'other', label: t('report.issue_other'), icon: HelpCircle }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.issue_type || !formData.description.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please select an issue type and provide a description.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Generate token
      const token = 'ST' + Math.random().toString(36).substr(2, 6).toUpperCase()
      
      // Create report in database
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert([{
          token,
          type: formData.issue_type,
          description: formData.description,
          wants_followup: formData.allow_followup
        }])
        .select()
        .single()

      if (reportError) throw reportError

      // Create chat session
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .insert([{
          token,
          report_id: report.id
        }])

      if (sessionError) throw sessionError
      
      // Store token in sessionStorage for the token page
      sessionStorage.setItem('reportToken', token)
      
      toast({
        title: "Report submitted successfully",
        description: "Your anonymous report has been received safely.",
        variant: "default"
      })
      
      navigate('/token')
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again. If the problem persists, contact emergency services.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-muted/30">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-primary p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-strong">
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('report.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('report.subtitle')}
          </p>
        </div>

        {/* Privacy Notice */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-primary mb-1">Your Privacy is Protected</p>
                <p className="text-muted-foreground">
                  This report is completely anonymous. No personal information is collected or stored. 
                  You will receive a secure token to continue any conversation if needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Form */}
        <Card className="shadow-strong bg-gradient-card border-0">
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
            <CardDescription>
              Share what happened in your own words. Include as much or as little detail as you're comfortable with.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Type */}
              <div className="space-y-3">
                <Label htmlFor="issue_type" className="text-base font-medium">
                  {t('report.issue_type')} *
                </Label>
                <Select 
                  value={formData.issue_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, issue_type: value }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select the type of issue you're reporting" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypes.map((type) => {
                      const IconComponent = type.icon
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-medium">
                  {t('report.description')} *
                </Label>
                <Textarea
                  id="description"
                  placeholder={t('report.description_placeholder')}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-32 resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Feel free to include details about when, where, and what happened. 
                  Your safety and comfort are the priority.
                </p>
              </div>

              {/* School Name (Optional) */}
              <div className="space-y-3">
                <Label htmlFor="school_name" className="text-base font-medium">
                  {t('report.school_optional')}
                </Label>
                <Input
                  id="school_name"
                  placeholder="Enter your school name (this helps us provide better support)"
                  value={formData.school_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, school_name: e.target.value }))}
                  className="h-12"
                />
              </div>

              {/* Follow-up Checkbox */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
                  <Checkbox
                    id="allow_followup"
                    checked={formData.allow_followup}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, allow_followup: checked as boolean }))
                    }
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="allow_followup" className="text-base font-medium cursor-pointer">
                      {t('report.followup')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('report.followup_description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-base shadow-medium hover:shadow-strong transition-all duration-300"
                >
                  {isSubmitting ? t('report.submitting') : t('report.submit')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Need immediate help? Contact emergency services or call our helpline
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