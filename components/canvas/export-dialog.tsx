'use client'

import { useState } from 'react'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/dist/types/excalidraw/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Download } from 'lucide-react'
import { toast } from 'sonner'
import { exportToCanvas, exportToSvg } from '@excalidraw/excalidraw'
import jsPDF from 'jspdf'

interface ExportDialogProps {
  excalidrawAPI: ExcalidrawImperativeAPI
  drawingName: string
  onClose: () => void
}

type ExportFormat = 'png' | 'svg' | 'pdf'
type ExportScale = 1 | 2 | 4

export function ExportDialog({
  excalidrawAPI,
  drawingName,
  onClose,
}: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('png')
  const [scale, setScale] = useState<ExportScale>(2)
  const [includeBackground, setIncludeBackground] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const elements = excalidrawAPI.getSceneElements()
      const appState = excalidrawAPI.getAppState()
      const files = excalidrawAPI.getFiles()

      const exportOptions = {
        elements,
        appState: {
          ...appState,
          exportBackground: includeBackground,
          exportWithDarkMode: false,
        },
        files,
      }

      if (format === 'png') {
        await exportToPNG(exportOptions, scale)
      } else if (format === 'svg') {
        await exportToSVG(exportOptions)
      } else if (format === 'pdf') {
        await exportToPDF(exportOptions, scale)
      }

      toast.success(`Drawing exported as ${format.toUpperCase()}`)
      onClose()
    } catch (error) {
      console.error('Error exporting:', error)
      toast.error('Failed to export drawing')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPNG = async (options: any, scale: ExportScale) => {
    const canvas = await exportToCanvas({
      ...options,
      getDimensions: (width: number, height: number) => ({
        width: width * scale,
        height: height * scale,
        scale,
      }),
    })

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${drawingName}.png`
        link.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  const exportToSVG = async (options: any) => {
    const svg = await exportToSvg(options)
    const svgString = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${drawingName}.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportToPDF = async (options: any, scale: ExportScale) => {
    const canvas = await exportToCanvas({
      ...options,
      getDimensions: (width: number, height: number) => ({
        width: width * scale,
        height: height * scale,
        scale,
      }),
    })

    const imgData = canvas.toDataURL('image/png')

    // Create PDF with appropriate size
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    })

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`${drawingName}.pdf`)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Drawing</DialogTitle>
          <DialogDescription>
            Choose your export format and settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format selection */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="png" id="png" />
                <Label htmlFor="png" className="cursor-pointer">
                  <div>
                    <div className="font-medium">PNG Image</div>
                    <div className="text-sm text-muted-foreground">
                      High-resolution raster image (1920×1080)
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="svg" id="svg" />
                <Label htmlFor="svg" className="cursor-pointer">
                  <div>
                    <div className="font-medium">SVG</div>
                    <div className="text-sm text-muted-foreground">
                      Vector format (scalable)
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="cursor-pointer">
                  <div>
                    <div className="font-medium">PDF</div>
                    <div className="text-sm text-muted-foreground">
                      Print-ready document
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Scale selection (for PNG and PDF) */}
          {(format === 'png' || format === 'pdf') && (
            <div className="space-y-2">
              <Label>Scale</Label>
              <Select value={scale.toString()} onValueChange={(v) => setScale(Number(v) as ExportScale)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x (Standard)</SelectItem>
                  <SelectItem value="2">2x (High-res)</SelectItem>
                  <SelectItem value="4">4x (Print)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Background option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="background"
              checked={includeBackground}
              onCheckedChange={(checked) => setIncludeBackground(checked as boolean)}
            />
            <Label htmlFor="background" className="cursor-pointer">
              Include background
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
