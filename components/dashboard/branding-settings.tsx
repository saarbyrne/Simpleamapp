"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateOrganizationBranding } from "@/app/actions/organization"
import { toast } from "sonner"
import { useState } from "react"

const brandingSchema = z.object({
  logo: z.string().url("Must be valid URL").optional().or(z.literal("")),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be valid hex color").optional().or(z.literal("")),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be valid hex color").optional().or(z.literal("")),
})

export function BrandingSettings({ organization }: { organization: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      logo: organization?.logo || "",
      primaryColor: organization?.primaryColor || "",
      secondaryColor: organization?.secondaryColor || "",
    },
  })

  async function onSubmit(data: z.infer<typeof brandingSchema>) {
    setIsSubmitting(true)
    const result = await updateOrganizationBranding({
      logo: data.logo || null,
      primaryColor: data.primaryColor || null,
      secondaryColor: data.secondaryColor || null,
    })
    setIsSubmitting(false)

    if (result.success) {
      toast.success("Branding updated successfully")
    } else {
      toast.error(result.error || "Failed to update branding")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Branding</CardTitle>
        <CardDescription>
          Customize team logo and brand colors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Logo URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://upload.wikimedia.org/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Public URL to team logo (SVG or PNG recommended)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        type="color"
                        className="w-20 h-10 cursor-pointer"
                        {...field}
                      />
                    </FormControl>
                    <Input
                      placeholder="#C8102E"
                      className="flex-1"
                      {...field}
                    />
                  </div>
                  <FormDescription>
                    Primary team color (hex format, e.g., #C8102E)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Color</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        type="color"
                        className="w-20 h-10 cursor-pointer"
                        {...field}
                      />
                    </FormControl>
                    <Input
                      placeholder="#F6EB61"
                      className="flex-1"
                      {...field}
                    />
                  </div>
                  <FormDescription>
                    Secondary team color (hex format, e.g., #F6EB61)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Branding"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
