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
    reporting_for: '',
    description: '',
    incident_type: [] as string[],
    location: '',
    when_happened: '',
    repeated: '',
    feel_safe: '',
    perpetrator_known: '',
    perpetrator_info: '',
    still_around: '',
    age: '',
    class_form: '',
    school_name: '',
    county: '',
    disability: '',
    disability_description: '',
    witnesses: '',
    witness_info: '',
    has_proof: '',
    desired_action: [] as string[],
    want_followup: '',
    want_chat: '',
    contact_name: '',
    contact_info: '',
    why_anonymous: [] as string[],
    why_anonymous_other: ''
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
    
    if (!formData.reporting_for || !formData.description.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please indicate who you're reporting for and provide a description.",
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
          type: formData.reporting_for,
          description: JSON.stringify(formData),
          wants_followup: formData.want_followup === 'yes'
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
            SafeTalk Kenya – Speak Up Form
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            (For High School Students)
          </p>
          <div className="text-left max-w-3xl mx-auto bg-muted/30 p-6 rounded-lg">
            <p className="mb-4">
              Hey 👋🏾 We're really glad you found this space. This form is for students in high schools across Kenya who want to share something that made them or someone they care about feel hurt, unsafe, or uncomfortable. You can use this form to report bullying, abuse, harassment, or anything else that's not okay.
            </p>
            <p className="mb-4">
              You don't have to write everything. Just fill in what you're ready to share. You can stay anonymous, and no one will pressure you.
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-primary mb-1">🔐 Your Privacy</p>
                <p className="text-muted-foreground">
                  Everything you share here is private and protected. Only trusted SafeTalk support members will read this form. We'll only act or contact others if you ask us to or if someone is in danger.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Form */}
        <Card className="shadow-strong bg-gradient-card border-0">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. Are You Reporting for Yourself or Someone Else? */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  🧍🏾‍♀ 1. Are You Reporting for Yourself or Someone Else?
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="reporting_for"
                      value="myself"
                      checked={formData.reporting_for === 'myself'}
                      onChange={(e) => setFormData(prev => ({ ...prev, reporting_for: e.target.value }))}
                      className="h-4 w-4"
                    />
                    <span>I'm reporting something that happened to me</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="reporting_for"
                      value="someone_else"
                      checked={formData.reporting_for === 'someone_else'}
                      onChange={(e) => setFormData(prev => ({ ...prev, reporting_for: e.target.value }))}
                      className="h-4 w-4"
                    />
                    <span>I'm reporting something that happened to someone else (like a friend or classmate)</span>
                  </label>
                </div>
              </div>

              {/* 2. What Happened to You (or Them)? */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  💬 2. What Happened to You (or Them)?
                </h3>
                <p className="text-sm text-muted-foreground">
                  We understand this may be hard to write. Please share as much as you feel okay with. If you'd rather talk to someone, let us know at the end.
                </p>
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Please describe the incident in your own words: *
                  </Label>
                  <Textarea
                    placeholder="Describe what happened..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-32 resize-none"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Not sure how to describe it? You can tick the boxes that match what happened:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      "I was hit, slapped, kicked, or hurt physically",
                      "Someone touched my body in a sexual way that I didn't want",
                      "Someone made sexual comments or jokes about me",
                      "Someone stared at me in a way that made me feel uncomfortable",
                      "I was asked to send photos or do something sexual online",
                      "I was insulted, embarrassed, or threatened",
                      "I was forced to do something I didn't want to do",
                      "I was bullied or cyberbullied",
                      "Someone kept bothering me even after I told them to stop",
                      "I saw someone else being treated badly",
                      "Other"
                    ].map((incident, index) => (
                      <label key={index} className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                          checked={formData.incident_type.includes(incident)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({ ...prev, incident_type: [...prev.incident_type, incident] }))
                            } else {
                              setFormData(prev => ({ ...prev, incident_type: prev.incident_type.filter(i => i !== incident) }))
                            }
                          }}
                        />
                        <span className="text-sm">{incident}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">📍Where did it happen?</Label>
                    <Input
                      placeholder="e.g. classroom, dormitory, field, online"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">📅 When did it happen?</Label>
                    <Input
                      placeholder="e.g. last week, this morning"
                      value={formData.when_happened}
                      onChange={(e) => setFormData(prev => ({ ...prev, when_happened: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">🔁 Has this happened before?</Label>
                    <Select value={formData.repeated} onValueChange={(value) => setFormData(prev => ({ ...prev, repeated: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="not_sure">Not sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">🛡 Do you feel safe right now?</Label>
                    <Select value={formData.feel_safe} onValueChange={(value) => setFormData(prev => ({ ...prev, feel_safe: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="not_sure">Not sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 3. Who Was Involved? */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  🙋🏽 3. Who Was Involved?
                </h3>
                <p className="text-sm text-muted-foreground">
                  We need to know this to take proper steps. Even if you don't know their name, a short description helps.
                </p>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Do you know who did this?</Label>
                  <div className="flex space-x-4">
                    {['yes', 'no'].map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="perpetrator_known"
                          value={option}
                          checked={formData.perpetrator_known === option}
                          onChange={(e) => setFormData(prev => ({ ...prev, perpetrator_known: e.target.value }))}
                          className="h-4 w-4"
                        />
                        <span className="capitalize">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.perpetrator_known === 'yes' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">If yes, what's their name, nickname or role?</Label>
                      <Input
                        placeholder="e.g. Form 4 student, maths teacher, cleaner"
                        value={formData.perpetrator_info}
                        onChange={(e) => setFormData(prev => ({ ...prev, perpetrator_info: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Are they still around you?</Label>
                      <Select value={formData.still_around} onValueChange={(value) => setFormData(prev => ({ ...prev, still_around: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="sometimes">Sometimes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>

              {/* 4. About You */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  📚 4. About You (This helps us support you better)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Your age:</Label>
                    <Input
                      placeholder="Write in numbers, e.g. 14"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Your class/form:</Label>
                    <Input
                      placeholder="e.g. Form 1, Form 3"
                      value={formData.class_form}
                      onChange={(e) => setFormData(prev => ({ ...prev, class_form: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Your school name:</Label>
                    <Input
                      value={formData.school_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, school_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Your county/region:</Label>
                    <Input
                      value={formData.county}
                      onChange={(e) => setFormData(prev => ({ ...prev, county: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Do you have any disability or special need?</Label>
                  <div className="flex space-x-4">
                    {['yes', 'no', 'prefer_not_to_say'].map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="disability"
                          value={option}
                          checked={formData.disability === option}
                          onChange={(e) => setFormData(prev => ({ ...prev, disability: e.target.value }))}
                          className="h-4 w-4"
                        />
                        <span className="capitalize">{option.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.disability === 'yes' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">If yes, describe it briefly (optional):</Label>
                    <Input
                      value={formData.disability_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, disability_description: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              {/* 5. Witnesses */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  👀 5. Did Anyone Witness It?
                </h3>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Were there any witnesses?</Label>
                  <Select value={formData.witnesses} onValueChange={(value) => setFormData(prev => ({ ...prev, witnesses: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="not_sure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.witnesses === 'yes' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">If yes, who? (You can write nicknames or describe them)</Label>
                    <Input
                      value={formData.witness_info}
                      onChange={(e) => setFormData(prev => ({ ...prev, witness_info: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              {/* 6. Proof */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  📎 6. Do You Have Any Proof? (Optional)
                </h3>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Do you have pictures, videos, or screenshots?</Label>
                  <div className="flex space-x-4">
                    {['yes', 'no'].map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="has_proof"
                          value={option}
                          checked={formData.has_proof === option}
                          onChange={(e) => setFormData(prev => ({ ...prev, has_proof: e.target.value }))}
                          className="h-4 w-4"
                        />
                        <span className="capitalize">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 7. What Do You Want to Happen? */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  ✅ 7. What Do You Want to Happen?
                </h3>
                <p className="text-sm text-muted-foreground">Let us know what you'd like us to do:</p>
                
                <div className="space-y-2">
                  {[
                    "I just needed to talk about it",
                    "I want someone to check on me",
                    "I want the school staff to be informed",
                    "I want this reported to authorities (like police or children's officers)",
                    "I'm not sure yet, I just needed to share"
                  ].map((action, index) => (
                    <label key={index} className="flex items-center space-x-3 cursor-pointer">
                      <Checkbox
                        checked={formData.desired_action.includes(action)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({ ...prev, desired_action: [...prev.desired_action, action] }))
                          } else {
                            setFormData(prev => ({ ...prev, desired_action: prev.desired_action.filter(a => a !== action) }))
                          }
                        }}
                      />
                      <span className="text-sm">{action}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Would you like someone to follow up with you about this?</Label>
                  <div className="flex space-x-4">
                    {['yes', 'no', 'maybe_later'].map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="want_followup"
                          value={option}
                          checked={formData.want_followup === option}
                          onChange={(e) => setFormData(prev => ({ ...prev, want_followup: e.target.value }))}
                          className="h-4 w-4"
                        />
                        <span className="capitalize">{option.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Would you like to chat anonymously with someone who can help?</Label>
                  <div className="flex space-x-4">
                    {['yes', 'no'].map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="want_chat"
                          value={option}
                          checked={formData.want_chat === option}
                          onChange={(e) => setFormData(prev => ({ ...prev, want_chat: e.target.value }))}
                          className="h-4 w-4"
                        />
                        <span className="capitalize">{option === 'yes' ? "Yes, I'd like to chat anonymously and get some help" : "No, I'm okay for now"}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 8. Contact Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  ☎ 8. Want to Be Contacted? (Optional)
                </h3>
                <p className="text-sm text-muted-foreground">You can choose to give us a way to reach you — totally up to you.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Your name:</Label>
                    <Input
                      placeholder="first name or nickname is okay"
                      value={formData.contact_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Your phone number or email:</Label>
                    <Input
                      value={formData.contact_info}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact_info: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* 9. Why Anonymous */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  🧠 9. Why Did You Choose to Report Anonymously Today? (Optional)
                </h3>
                <p className="text-sm text-muted-foreground">Tick any that apply:</p>
                
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "I've reported before but nothing was done",
                    "I'm scared no one will believe me",
                    "I feel embarrassed or ashamed",
                    "I'm afraid of getting in trouble or hurting someone else",
                    "I don't want to be known as a troublemaker",
                    "I'm worried it could affect my school or future",
                    "I don't want to go through investigations",
                    "I'm scared the person might find out and hurt me again",
                    "I live near or with the person who did this",
                    "I'm not ready to talk about it",
                    "I just want the school to know this happened",
                    "I don't know what to do",
                    "I don't have proof",
                    "I'm still confused about what happened"
                  ].map((reason, index) => (
                    <label key={index} className="flex items-center space-x-3 cursor-pointer">
                      <Checkbox
                        checked={formData.why_anonymous.includes(reason)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({ ...prev, why_anonymous: [...prev.why_anonymous, reason] }))
                          } else {
                            setFormData(prev => ({ ...prev, why_anonymous: prev.why_anonymous.filter(r => r !== reason) }))
                          }
                        }}
                      />
                      <span className="text-sm">{reason}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Other (explain if you want):</Label>
                  <Textarea
                    placeholder="Optional explanation..."
                    value={formData.why_anonymous_other}
                    onChange={(e) => setFormData(prev => ({ ...prev, why_anonymous_other: e.target.value }))}
                    className="min-h-20"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <div className="bg-muted/30 p-4 rounded-lg mb-4">
                  <p className="text-sm text-center text-muted-foreground">
                    💚 Thank you for speaking up. We believe you, and we're here to help. You are not alone.
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-base shadow-medium hover:shadow-strong transition-all duration-300"
                >
                  {isSubmitting ? "Submitting Report..." : "Submit Anonymous Report"}
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