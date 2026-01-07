'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Upload, X, File, Image as ImageIcon, Video, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { uploadFile } from '@/app/actions/files'
import { MAX_FILE_SIZE, formatBytes, FILE_VISIBILITY_OPTIONS, getFileIcon } from '@/lib/files'
import { cn } from '@/components/ui/utils'

interface FileUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultLinkedEntity?: {
    type: string
    id: string
    name?: string
  }
  onSuccess?: () => void
}

interface UploadingFile {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export function FileUploadDialog({
  open,
  onOpenChange,
  defaultLinkedEntity,
  onSuccess,
}: FileUploadDialogProps) {
  const t = useTranslations()
  const [files, setFiles] = useState<UploadingFile[]>([])
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [visibility, setVisibility] = useState('public')
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        const errors = rejection.errors.map((e) => e.message).join(', ')
        toast.error(`${rejection.file.name}: ${errors}`)
      })
    },
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file')
      return
    }

    setIsUploading(true)

    try {
      let successCount = 0
      // Upload files one by one
      for (let i = 0; i < files.length; i++) {
        const fileItem = files[i]

        // Update status to uploading
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: 'uploading', progress: 0 } : f
          )
        )

        const formData = new FormData()
        formData.append('file', fileItem.file)
        formData.append('description', description)
        formData.append('tags', JSON.stringify(tags))
        formData.append('visibility', visibility)

        if (defaultLinkedEntity) {
          formData.append(
            'linkedEntities',
            JSON.stringify([{ type: defaultLinkedEntity.type, id: defaultLinkedEntity.id }])
          )
        }

        // Simulate progress (real progress tracking would require more complex setup)
        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i && f.progress < 90
                ? { ...f, progress: f.progress + 10 }
                : f
            )
          )
        }, 200)

        const result = await uploadFile(formData)

        clearInterval(progressInterval)

        if (result.error) {
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i
                ? { ...f, status: 'error', progress: 0, error: result.error }
                : f
            )
          )
          toast.error(`Failed to upload ${fileItem.file.name}: ${result.error}`)
        } else {
          successCount += 1
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i ? { ...f, status: 'success', progress: 100 } : f
            )
          )
        }
      }

      // Check if all successful
      if (successCount === files.length) {
        toast.success(`Successfully uploaded ${files.length} file(s)`)
        onSuccess?.()
        onOpenChange(false)
        // Reset form
        setFiles([])
        setDescription('')
        setTags([])
        setVisibility('public')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIconComponent = (file: File) => {
    const iconName = getFileIcon(file.type)
    switch (iconName) {
      case 'Image':
        return <ImageIcon className="h-8 w-8 text-blue-500" />
      case 'Video':
        return <Video className="h-8 w-8 text-purple-500" />
      case 'FileText':
        return <FileText className="h-8 w-8 text-orange-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('files.uploadFiles')}</DialogTitle>
          <DialogDescription>
            {t('files.uploadFilesDescription', {
              maxSize: formatBytes(MAX_FILE_SIZE),
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">{t('files.dropFiles')}</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">{t('files.dragDropFiles')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('files.orClickToBrowse')}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {t('files.maxFileSize', { size: formatBytes(MAX_FILE_SIZE) })}
                </p>
              </>
            )}
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>{t('files.selectedFiles')}</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    {getFileIconComponent(item.file)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatBytes(item.file.size)}
                      </p>
                      {item.status === 'uploading' && (
                        <Progress value={item.progress} className="mt-2 h-2" />
                      )}
                      {item.status === 'error' && (
                        <p className="text-sm text-destructive mt-1">{item.error}</p>
                      )}
                      {item.status === 'success' && (
                        <p className="text-sm text-green-600 mt-1">✓ {t('files.uploaded')}</p>
                      )}
                    </div>
                    {item.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">{t('files.description')}</Label>
              <Textarea
                id="description"
                placeholder={t('files.descriptionPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">{t('files.tags')}</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder={t('files.addTags')}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  {t('common.add')}
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">{t('files.visibility')}</Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger id="visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILE_VISIBILITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {defaultLinkedEntity && (
              <div className="p-3 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  {t('files.linkedTo')}:{' '}
                  <span className="font-medium text-foreground">
                    {defaultLinkedEntity.name || defaultLinkedEntity.id}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
          >
            {isUploading ? t('files.uploading') : t('files.upload')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
