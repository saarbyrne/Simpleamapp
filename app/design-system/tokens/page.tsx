'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { colors } from '@/design-system/tokens/colors'
import { spacing } from '@/design-system/tokens/spacing'
import { typography } from '@/design-system/tokens/typography'
import { motion } from '@/design-system/tokens/motion'

export default function TokensPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Design System Tokens</h1>
            <p className="text-muted-foreground mt-2">
              Interactive showcase of all design tokens used in SimpleAM
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </div>

        <Tabs defaultValue="colors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="motion">Motion</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Semantic Colors</CardTitle>
                <CardDescription>
                  Colors that adapt automatically to light and dark themes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ColorSwatch
                    name="Primary"
                    light={colors.primary.light}
                    dark={colors.primary.dark}
                    foreground={colors.primary.foreground.light}
                  />
                  <ColorSwatch
                    name="Secondary"
                    light={colors.secondary.light}
                    dark={colors.secondary.dark}
                    foreground={colors.secondary.foreground.light}
                  />
                  <ColorSwatch
                    name="Destructive"
                    light={colors.destructive.light}
                    dark={colors.destructive.dark}
                    foreground={colors.destructive.foreground.light}
                  />
                  <ColorSwatch
                    name="Muted"
                    light={colors.muted.light}
                    dark={colors.muted.dark}
                    foreground={colors.muted.foreground.light}
                  />
                  <ColorSwatch
                    name="Accent"
                    light={colors.accent.light}
                    dark={colors.accent.dark}
                    foreground={colors.accent.foreground.light}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Background Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div
                      className="h-20 rounded-lg border"
                      style={{ backgroundColor: 'var(--background)' }}
                    >
                      <div className="p-2 text-sm font-medium">Background</div>
                    </div>
                    <code className="text-xs">var(--background)</code>
                  </div>
                  <div className="space-y-2">
                    <div
                      className="h-20 rounded-lg border"
                      style={{ backgroundColor: 'var(--card)' }}
                    >
                      <div className="p-2 text-sm font-medium">Card</div>
                    </div>
                    <code className="text-xs">var(--card)</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chart Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(colors.chart).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div
                        className="h-20 rounded-lg"
                        style={{ backgroundColor: value }}
                      />
                      <code className="text-xs block">Chart {key}</code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spacing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spacing Scale</CardTitle>
                <CardDescription>
                  Base unit: 0.25rem (4px). Use Tailwind spacing utilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(spacing)
                    .filter(([key]) => ['0', '1', '2', '4', '6', '8', '12', '16', '24'].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-mono">{key}</div>
                        <div className="flex-1">
                          <div
                            className="bg-primary h-8 rounded"
                            style={{ width: value }}
                          />
                        </div>
                        <div className="w-24 text-xs text-muted-foreground font-mono">
                          {value}
                        </div>
                        <div className="w-16 text-xs text-muted-foreground">
                          {parseFloat(value) * 16}px
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Font Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(typography.fontSize)
                    .filter(([key]) => ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex items-baseline gap-4">
                          <code className="text-xs w-20 font-mono">text-{key}</code>
                          <div style={{ fontSize: value }} className="font-medium">
                            The quick brown fox jumps over the lazy dog
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground ml-24 font-mono">
                          {value}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Font Weights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(typography.fontWeight)
                    .filter(([key]) => ['normal', 'medium', 'semibold', 'bold'].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className="flex items-center gap-4">
                        <code className="text-xs w-24 font-mono">font-{key}</code>
                        <div style={{ fontWeight: value }} className="text-lg">
                          The quick brown fox
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {value}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="motion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Animation Durations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(motion.duration).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-4">
                      <code className="text-xs w-24 font-mono">{key}</code>
                      <div className="flex-1">
                        <div
                          className="bg-primary h-4 rounded animate-pulse"
                          style={{
                            animationDuration: `${value}ms`,
                          }}
                        />
                      </div>
                      <div className="w-20 text-xs text-muted-foreground font-mono">
                        {value}ms
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Easing Functions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(motion.easing).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <code className="text-xs font-mono">{key}</code>
                      <div className="text-sm font-mono text-muted-foreground">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ColorSwatch({
  name,
  light,
  dark,
  foreground,
}: {
  name: string
  light: string
  dark: string
  foreground: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div
          className="flex-1 h-20 rounded-lg border flex items-center justify-center"
          style={{ backgroundColor: light }}
        >
          <span style={{ color: foreground }} className="text-sm font-medium">
            Light
          </span>
        </div>
        <div
          className="flex-1 h-20 rounded-lg border flex items-center justify-center"
          style={{ backgroundColor: dark }}
        >
          <span style={{ color: foreground }} className="text-sm font-medium">
            Dark
          </span>
        </div>
      </div>
      <div>
        <div className="text-sm font-medium">{name}</div>
        <code className="text-xs text-muted-foreground font-mono">
          bg-{name.toLowerCase()}
        </code>
      </div>
    </div>
  )
}
