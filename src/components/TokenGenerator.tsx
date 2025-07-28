import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { generateToken } from '@/lib/supabase'
import { Copy, RefreshCw, Shield } from 'lucide-react'

interface TokenGeneratorProps {
  onTokenGenerated?: (token: string) => void
  className?: string
}

export const TokenGenerator: React.FC<TokenGeneratorProps> = ({ 
  onTokenGenerated, 
  className = "" 
}) => {
  const { toast } = useToast()
  const [currentToken, setCurrentToken] = useState('')
  const [customPrefix, setCustomPrefix] = useState('ST')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateToken = async () => {
    setIsGenerating(true)
    
    // Add a slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newToken = generateToken()
    const formattedToken = customPrefix + newToken.slice(2) // Replace default prefix
    
    setCurrentToken(formattedToken)
    onTokenGenerated?.(formattedToken)
    
    toast({
      title: "New token generated",
      description: "Your anonymous token is ready to use",
      variant: "default"
    })
    
    setIsGenerating(false)
  }

  const copyToClipboard = async () => {
    if (!currentToken) return
    
    try {
      await navigator.clipboard.writeText(currentToken)
      toast({
        title: "Token copied!",
        description: "Token has been copied to clipboard",
        variant: "default"
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please manually copy the token",
        variant: "destructive"
      })
    }
  }

  return (
    <Card className={`shadow-medium bg-gradient-card border-0 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>Token Generator</span>
        </CardTitle>
        <CardDescription>
          Generate secure anonymous tokens for student access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Custom Prefix */}
        <div className="space-y-2">
          <Label htmlFor="prefix">Token Prefix</Label>
          <Input
            id="prefix"
            value={customPrefix}
            onChange={(e) => setCustomPrefix(e.target.value.toUpperCase().slice(0, 3))}
            placeholder="ST"
            className="h-10 font-mono text-center"
            maxLength={3}
          />
          <p className="text-xs text-muted-foreground">
            2-3 character prefix for easy identification
          </p>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerateToken}
          disabled={isGenerating}
          className="w-full h-10"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate New Token
            </>
          )}
        </Button>

        {/* Token Display */}
        {currentToken && (
          <div className="space-y-3">
            <div className="bg-muted/50 p-4 rounded-lg border-2 border-dashed border-primary/30">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-primary mb-2 tracking-widest">
                  {currentToken}
                </div>
                <p className="text-xs text-muted-foreground">
                  Generated token - valid for 48 hours
                </p>
              </div>
            </div>
            
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Token
            </Button>
          </div>
        )}

        {/* Token Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Tokens are 8 characters long</p>
          <p>• Each token is unique and secure</p>
          <p>• Tokens expire after 48 hours for privacy</p>
          <p>• Use tokens to access anonymous chat</p>
        </div>
      </CardContent>
    </Card>
  )
}