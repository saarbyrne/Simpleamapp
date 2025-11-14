'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useAuth, UserRole } from './auth-provider'
import { toast } from 'sonner@2.0.3'
import { Loader2, SkipForward } from 'lucide-react'

export function AuthScreen() {
  const { signIn, signUp, skipLogin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [signInData, setSignInData] = useState({ email: '', password: '' })
  const [signUpData, setSignUpData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    role: 'coach' as UserRole 
  })

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await signIn(signInData.email, signInData.password)
      toast.success('Welcome back!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    setLoading(true)
    
    try {
      await signUp(signUpData.email, signUpData.password, signUpData.role)
      toast.success('Account created! Please check your email to verify.')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  // TEMPORARY: Skip login for demo purposes - REMOVE THIS BEFORE PRODUCTION
  const handleSkipLogin = () => {
    skipLogin()
    toast.success('Demo mode activated!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">LuvFutbol</h1>
          <p className="text-muted-foreground mt-2">
            Football tactics platform for coaches and players
          </p>
        </div>

        {/* TEMPORARY: Demo skip button - REMOVE THIS BEFORE PRODUCTION */}
        <Card className="mb-4 border-dashed border-orange-200 bg-orange-50/50">
          <CardContent className="pt-4">
            <div className="text-center space-y-3">
              <p className="text-sm text-orange-700">
                🚧 Development Mode
              </p>
              <Button 
                variant="outline" 
                className="w-full border-orange-200 text-orange-700 hover:bg-orange-100"
                onClick={handleSkipLogin}
                disabled={loading}
              >
                <SkipForward className="mr-2 h-4 w-4" />
                Skip Login (Demo Mode)
              </Button>
              <p className="text-xs text-orange-600">
                Temporary demo access - will be removed in production
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                  Sign in to your coaching account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="coach@example.com"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create account</CardTitle>
                <CardDescription>
                  Join the football coaching community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="coach@example.com"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Role</Label>
                    <Select
                      value={signUpData.role}
                      onValueChange={(value: UserRole) => setSignUpData(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coach">Coach</SelectItem>
                        <SelectItem value="player">Player</SelectItem>
                        <SelectItem value="guest">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}