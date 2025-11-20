'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { PageCard } from '@/components/ui/page-card'

interface AISettingsData {
  injuryRiskAlerts: boolean
  wellnessAlerts: boolean
  loadAlerts: boolean
  formCompletionAlerts: boolean
  alertFrequency: string
  dataAccess: {
    playerWellness: boolean
    loadData: boolean
    medicalNotes: boolean
    formResponses: boolean
    eventAttendance: boolean
    privateNotes: boolean
  }
  monthlyTokenLimit: number
  tokensUsedThisMonth: number
}

export function AISettings() {
  const [settings, setSettings] = useState<AISettingsData>({
    injuryRiskAlerts: true,
    wellnessAlerts: true,
    loadAlerts: true,
    formCompletionAlerts: true,
    alertFrequency: 'real_time',
    dataAccess: {
      playerWellness: true,
      loadData: true,
      medicalNotes: false,
      formResponses: true,
      eventAttendance: true,
      privateNotes: false
    },
    monthlyTokenLimit: 1000000,
    tokensUsedThisMonth: 0
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/ai/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/ai/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast.success('Settings saved successfully')
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const tokensUsedPercentage = (settings.tokensUsedThisMonth / settings.monthlyTokenLimit) * 100

  return (
    <div className="space-y-6">
      <PageCard
        title="Proactive Insights"
        description="AI monitors your data and alerts you to important patterns"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="injury-risk">Injury Risk Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when players show high injury risk
              </p>
            </div>
            <Switch
              id="injury-risk"
              checked={settings.injuryRiskAlerts}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, injuryRiskAlerts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="wellness-alerts">Wellness Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Alert when team wellness declines significantly
              </p>
            </div>
            <Switch
              id="wellness-alerts"
              checked={settings.wellnessAlerts}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, wellnessAlerts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="load-alerts">Load Monitoring</Label>
              <p className="text-sm text-muted-foreground">
                Alert on acute load spikes or dangerous ratios
              </p>
            </div>
            <Switch
              id="load-alerts"
              checked={settings.loadAlerts}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, loadAlerts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="form-completion">Form Completion</Label>
              <p className="text-sm text-muted-foreground">
                Alert when form completion drops below threshold
              </p>
            </div>
            <Switch
              id="form-completion"
              checked={settings.formCompletionAlerts}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, formCompletionAlerts: checked })
              }
            />
          </div>
        </div>
      </PageCard>

      <PageCard
        title="Alert Frequency"
        description="Choose how often you receive AI insights"
      >
        <Select
          value={settings.alertFrequency}
          onValueChange={(value) =>
            setSettings({ ...settings, alertFrequency: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="real_time">Real-time</SelectItem>
            <SelectItem value="daily_digest">Daily digest</SelectItem>
            <SelectItem value="weekly_summary">Weekly summary</SelectItem>
          </SelectContent>
        </Select>
      </PageCard>

      <PageCard
        title="Data Access"
        description="Control what data AI can access"
      >
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="player-wellness"
              checked={settings.dataAccess.playerWellness}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  dataAccess: {
                    ...settings.dataAccess,
                    playerWellness: !!checked
                  }
                })
              }
            />
            <Label htmlFor="player-wellness" className="cursor-pointer">
              Player wellness data
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="load-data"
              checked={settings.dataAccess.loadData}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  dataAccess: {
                    ...settings.dataAccess,
                    loadData: !!checked
                  }
                })
              }
            />
            <Label htmlFor="load-data" className="cursor-pointer">
              Load/GPS data
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="medical-notes"
              checked={settings.dataAccess.medicalNotes}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  dataAccess: {
                    ...settings.dataAccess,
                    medicalNotes: !!checked
                  }
                })
              }
            />
            <Label htmlFor="medical-notes" className="cursor-pointer">
              Medical notes
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="form-responses"
              checked={settings.dataAccess.formResponses}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  dataAccess: {
                    ...settings.dataAccess,
                    formResponses: !!checked
                  }
                })
              }
            />
            <Label htmlFor="form-responses" className="cursor-pointer">
              Form responses
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="event-attendance"
              checked={settings.dataAccess.eventAttendance}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  dataAccess: {
                    ...settings.dataAccess,
                    eventAttendance: !!checked
                  }
                })
              }
            />
            <Label htmlFor="event-attendance" className="cursor-pointer">
              Event attendance
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="private-notes"
              checked={settings.dataAccess.privateNotes}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  dataAccess: {
                    ...settings.dataAccess,
                    privateNotes: !!checked
                  }
                })
              }
            />
            <Label htmlFor="private-notes" className="cursor-pointer">
              Private notes
            </Label>
          </div>
        </div>
      </PageCard>

      <PageCard
        title="Usage & Limits"
        description="Monitor your AI usage and costs"
      >
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Monthly Token Usage</span>
              <span className="text-sm text-muted-foreground">
                {settings.tokensUsedThisMonth.toLocaleString()} / {settings.monthlyTokenLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${Math.min(tokensUsedPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {tokensUsedPercentage.toFixed(1)}% of monthly limit used
            </p>
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Estimated Cost</h4>
            <p className="text-2xl font-bold">
              ${((settings.tokensUsedThisMonth / 1000000) * 3).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Based on Claude Sonnet 4 pricing ($3 per million tokens)
            </p>
          </div>
        </div>
      </PageCard>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
