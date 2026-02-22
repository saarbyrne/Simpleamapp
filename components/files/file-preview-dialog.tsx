'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Download,
  Share2,
  Edit,
  Trash2,
  File,
  ExternalLink,
} from 'lucide-react'
import { formatBytes, isPreviewable, getFileIcon } from '@/lib/files'
import { formatDate } from '@/lib/date'
import { cn } from '@/components/ui/utils'

interface FilePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: {
    id: string
    name: string
    originalName: string
    mimeType: string
    size: number
    url: string | null
    description: string | null
    tags: string[]
    visibility: string
    createdAt: Date
    uploadedBy: {
      id: string
      name: string
      avatar: string | null
    }
    links?: Array<{
      targetType: string
      targetId: string
    }>
  } | null
  onDownload?: (file: any) => void
  onShare?: (file: any) => void
  onEdit?: (file: any) => void
  onDelete?: (file: any) => void
}

export function FilePreviewDialog({
  open,
  onOpenChange,
  file,
  onDownload,
  onShare,
  onEdit,
  onDelete,
}: FilePreviewDialogProps) {
  const t = useTranslations()
  const [imageError, setImageError] = useState(false)

  if (!file) return null

  const canPreview = file.url && isPreviewable(file.mimeType) && !imageError
  const isImage = file.mimeType.startsWith('image/')
  const isVideo = file.mimeType.startsWith('video/')
  const isPdf = file.mimeType === 'application/pdf'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pe-8">
            <File className="h-5 w-5" />
            <span className="truncate">{file.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* File Actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownload?.(file)}
            >
              <Download className="h-4 w-4 me-2" />
              {t('files.download')}
            </Button>
            {file.url && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(file.url!, '_blank')}
              >
                <ExternalLink className="h-4 w-4 me-2" />
                {t('files.openInNewTab')}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onShare?.(file)}
            >
              <Share2 className="h-4 w-4 me-2" />
              {t('files.share')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit?.(file)}
            >
              <Edit className="h-4 w-4 me-2" />
              {t('files.edit')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete?.(file)}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 me-2" />
              {t('files.delete')}
            </Button>
          </div>

          <Separator className="mb-4" />

          {/* File Preview */}
          <div className="mb-6">
            {canPreview ? (
              <div className="border rounded-lg overflow-hidden bg-muted/30">
                {isImage && (
                  <div className="flex items-center justify-center p-4 min-h-[300px] max-h-[500px]">
                    <div className="relative w-full h-[500px]">
                      <Image
                        src={file.url!}
                        alt={file.name}
                        fill
                        className="object-contain"
                        onError={() => setImageError(true)}
                        unoptimized={!file.url?.includes('supabase.co')}
                      />
                    </div>
                  </div>
                )}
                {isVideo && (
                  <video
                    controls
                    className="w-full max-h-[500px]"
                    src={file.url!}
                  >
                    {t('files.videoNotSupported')}
                  </video>
                )}
                {isPdf && (
                  <div className="p-4">
                    <iframe
                      src={file.url!}
                      className="w-full h-[600px] border-0"
                      title={file.name}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="border rounded-lg p-12 text-center bg-muted/30">
                <File className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  {t('files.noPreviewAvailable')}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('files.downloadToView')}
                </p>
                <Button onClick={() => onDownload?.(file)}>
                  <Download className="h-4 w-4 me-2" />
                  {t('files.download')}
                </Button>
              </div>
            )}
          </div>

          {/* File Details */}
          <div className="space-y-6">
            {/* Description */}
            {file.description && (
              <div>
                <h3 className="text-sm font-medium mb-2">{t('files.description')}</h3>
                <p className="text-sm text-muted-foreground">
                  {file.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {file.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">{t('files.tags')}</h3>
                <div className="flex flex-wrap gap-2">
                  {file.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Visibility */}
            <div>
              <h3 className="text-sm font-medium mb-2">{t('files.visibility')}</h3>
              <Badge>
                {file.visibility.charAt(0).toUpperCase() + file.visibility.slice(1)}
              </Badge>
            </div>

            {/* Linked Entities */}
            {file.links && file.links.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">{t('files.linkedTo')}</h3>
                <div className="space-y-2">
                  {file.links.map((link, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 border rounded-lg"
                    >
                      <Badge variant="outline">{link.targetType}</Badge>
                      <span className="text-sm">{link.targetId}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Info */}
            <div>
              <h3 className="text-sm font-medium mb-3">{t('files.fileInfo')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('files.fileSize')}:</span>
                  <span className="font-medium">{formatBytes(file.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('files.fileType')}:</span>
                  <span className="font-medium">{file.mimeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('files.uploaded')}:</span>
                  <span className="font-medium" suppressHydrationWarning>
                    {formatDate(file.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('files.uploadedBy')}:</span>
                  <span className="font-medium">{file.uploadedBy.name}</span>
                </div>
                {file.url && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('files.url')}:</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(file.url!)
                        // Could add a toast notification here
                      }}
                    >
                      {t('common.copy')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
