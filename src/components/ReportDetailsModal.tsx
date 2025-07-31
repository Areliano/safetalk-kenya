import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Calendar, MapPin, User, AlertTriangle, Clock, Phone, Mail } from 'lucide-react'

interface Report {
  id: string
  case_id?: string
  type: string
  description: string
  timestamp: string
  status: string
  priority: string
  wants_followup: boolean
  who_involved?: string
  location?: string
  when_happened?: string
  has_happened_before?: string
  feels_safe?: string
  witnesses?: string
  what_action_wanted?: string
  contact_name?: string
  contact_info?: string
  why_anonymous?: string
  age?: string
  class_form?: string
  school_name?: string
  county_region?: string
  disability?: string
}

interface ReportDetailsModalProps {
  report: Report | null
  isOpen: boolean
  onClose: () => void
  onReportUpdated: () => void
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  report,
  isOpen,
  onClose,
  onReportUpdated
}) => {
  const [status, setStatus] = useState(report?.status || 'pending')
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleStatusUpdate = async () => {
    if (!report) return

    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', report.id)

      if (error) throw error

      toast({
        title: "Status Updated",
        description: `Report status changed to ${status}`,
      })
      
      onReportUpdated()
      onClose()
    } catch (error) {
      console.error('Error updating report status:', error)
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500'
      case 'resolved': return 'bg-green-500'
      case 'in_progress': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (!report) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Report Details - Case #{report.case_id || 'N/A'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-4">
            <Badge className={`${getStatusColor(report.status)} text-white`}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </Badge>
            <Badge className={`${getPriorityColor(report.priority)} text-white`}>
              {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {new Date(report.timestamp).toLocaleString()}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Report Type</h3>
                <p className="text-sm text-muted-foreground">{report.type}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.description}</p>
              </div>

              {report.location && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </h3>
                  <p className="text-sm text-muted-foreground">{report.location}</p>
                </div>
              )}

              {report.when_happened && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    When It Happened
                  </h3>
                  <p className="text-sm text-muted-foreground">{report.when_happened}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {report.who_involved && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Who Was Involved
                  </h3>
                  <p className="text-sm text-muted-foreground">{report.who_involved}</p>
                </div>
              )}

              {report.witnesses && (
                <div>
                  <h3 className="font-semibold mb-2">Witnesses</h3>
                  <p className="text-sm text-muted-foreground">{report.witnesses}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Safety Status</h3>
                <p className="text-sm text-muted-foreground">
                  Feels safe: {report.feels_safe || 'Not specified'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Happened before: {report.has_happened_before || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Student Information */}
          {(report.age || report.class_form || report.school_name || report.county_region) && (
            <div>
              <h3 className="font-semibold mb-4">Student Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {report.age && (
                  <div>
                    <p className="text-sm font-medium">Age</p>
                    <p className="text-sm text-muted-foreground">{report.age}</p>
                  </div>
                )}
                {report.class_form && (
                  <div>
                    <p className="text-sm font-medium">Class/Form</p>
                    <p className="text-sm text-muted-foreground">{report.class_form}</p>
                  </div>
                )}
                {report.school_name && (
                  <div>
                    <p className="text-sm font-medium">School</p>
                    <p className="text-sm text-muted-foreground">{report.school_name}</p>
                  </div>
                )}
                {report.county_region && (
                  <div>
                    <p className="text-sm font-medium">County/Region</p>
                    <p className="text-sm text-muted-foreground">{report.county_region}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {(report.contact_name || report.contact_info) && (
            <div>
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-2">
                {report.contact_name && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{report.contact_name}</span>
                  </div>
                )}
                {report.contact_info && (
                  <div className="flex items-center gap-2">
                    {report.contact_info.includes('@') ? (
                      <Mail className="h-4 w-4" />
                    ) : (
                      <Phone className="h-4 w-4" />
                    )}
                    <span className="text-sm">{report.contact_info}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Requested */}
          {report.what_action_wanted && (
            <div>
              <h3 className="font-semibold mb-2">Action Requested</h3>
              <p className="text-sm text-muted-foreground">{report.what_action_wanted}</p>
            </div>
          )}

          {/* Status Update Section */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Update Report Status</h3>
            <div className="flex items-center gap-4">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleStatusUpdate} 
                disabled={isUpdating || status === report.status}
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}