/**
 * File utilities for handling file operations, validation, and formatting
 */

// File type categories for filtering
export const FILE_TYPE_CATEGORIES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  videos: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
  ],
  data: ['text/csv', 'application/json', 'application/xml'],
} as const

export type FileCategoryKey = keyof typeof FILE_TYPE_CATEGORIES

// File visibility options
export const FILE_VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public (org-wide)' },
  { value: 'medical', label: 'Medical only' },
  { value: 'coaches', label: 'Coaching staff only' },
  { value: 'private', label: 'Private' },
] as const

// Max file size (100MB)
export const MAX_FILE_SIZE = 100 * 1024 * 1024

// Allowed entity types for linking
export const LINKABLE_ENTITY_TYPES = [
  { value: 'person', label: 'Player' },
  { value: 'event', label: 'Event' },
  { value: 'note', label: 'Note' },
  { value: 'plan', label: 'Plan' },
  { value: 'drawing', label: 'Drawing' },
] as const

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
  // Remove path separators and dangerous characters
  let sanitized = filename.replace(/[\/\\?%*:|"<>]/g, '-')

  // Remove leading/trailing dots and spaces
  sanitized = sanitized.replace(/^[.\s]+|[.\s]+$/g, '')

  // Collapse multiple spaces or dashes
  sanitized = sanitized.replace(/[\s-]+/g, '-')

  // Limit length (preserve extension)
  const parts = sanitized.split('.')
  const ext = parts.length > 1 ? parts.pop() : ''
  let basename = parts.join('.')

  if (basename.length > 200) {
    basename = basename.substring(0, 200)
  }

  return ext ? `${basename}.${ext}` : basename
}

/**
 * Generate a unique storage path for a file
 */
export function generateStoragePath(
  organizationId: string,
  filename: string,
  userId?: string
): string {
  const sanitized = sanitizeFilename(filename)
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)

  // Structure: orgId/year/month/timestamp-random-filename
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${organizationId}/${year}/${month}/${timestamp}-${random}-${sanitized}`
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Get file category from MIME type
 */
export function getFileCategory(mimeType: string): FileCategoryKey | 'other' {
  for (const [category, types] of Object.entries(FILE_TYPE_CATEGORIES)) {
    if ((types as readonly string[]).includes(mimeType)) {
      return category as FileCategoryKey
    }
  }
  return 'other'
}

/**
 * Check if a file type is previewable in browser
 */
export function isPreviewable(mimeType: string): boolean {
  return (
    mimeType.startsWith('image/') ||
    mimeType === 'application/pdf' ||
    mimeType.startsWith('video/') ||
    mimeType.startsWith('audio/') ||
    mimeType === 'text/plain'
  )
}

/**
 * Get icon name for file type (using lucide-react icons)
 */
export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'Image'
  if (mimeType.startsWith('video/')) return 'Video'
  if (mimeType.startsWith('audio/')) return 'Music'
  if (mimeType === 'application/pdf') return 'FileText'
  if (
    mimeType.includes('word') ||
    mimeType.includes('document')
  ) return 'FileText'
  if (
    mimeType.includes('excel') ||
    mimeType.includes('spreadsheet') ||
    mimeType === 'text/csv'
  ) return 'Table'
  if (
    mimeType.includes('powerpoint') ||
    mimeType.includes('presentation')
  ) return 'Presentation'
  if (mimeType === 'application/zip' || mimeType.includes('compressed')) return 'Archive'

  return 'File'
}

/**
 * Validate file size
 */
export function validateFileSize(size: number): { valid: boolean; error?: string } {
  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${formatBytes(MAX_FILE_SIZE)}`,
    }
  }
  return { valid: true }
}

/**
 * Validate file type (you can customize allowed types per organization)
 */
export function validateFileType(
  mimeType: string,
  allowedTypes?: string[]
): { valid: boolean; error?: string } {
  if (!allowedTypes || allowedTypes.length === 0) {
    return { valid: true }
  }

  if (!allowedTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `File type ${mimeType} is not allowed`,
    }
  }

  return { valid: true }
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : ''
}

/**
 * Get MIME type from file extension (basic mapping)
 */
export function getMimeTypeFromExtension(extension: string): string {
  const ext = extension.toLowerCase()
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    // Data
    csv: 'text/csv',
    json: 'application/json',
    xml: 'application/xml',
    // Video
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    webm: 'video/webm',
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
  }

  return mimeTypes[ext] || 'application/octet-stream'
}

/**
 * Check if file is an image
 */
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

/**
 * Check if file is a video
 */
export function isVideo(mimeType: string): boolean {
  return mimeType.startsWith('video/')
}

/**
 * Check if file is a document
 */
export function isDocument(mimeType: string): boolean {
  return FILE_TYPE_CATEGORIES.documents.includes(mimeType as any)
}
