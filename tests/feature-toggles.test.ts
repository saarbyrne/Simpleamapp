/**
 * Feature Toggles Tests
 * 
 * Tests for the organization feature toggles system.
 */

import { describe, it, expect } from 'vitest'
import { 
  getAllFeatures, 
  getFeatureMetadata, 
  getFeaturesWithSubFeatures,
  getFeatureKeyFromPath,
  FEATURE_METADATA 
} from '@/lib/permissions/feature-metadata'

describe('Feature Metadata', () => {
  it('should return all 14 main features', () => {
    const features = getAllFeatures()
    expect(features).toHaveLength(14)
  })

  it('should have correct feature keys', () => {
    const expectedKeys = [
      'aiWorkspace', 'ai', 'players', 'forms', 'reports', 'calendar',
      'messages', 'notes', 'spreadsheets', 'canvas',
      'files', 'planner', 'templates', 'dataManagement'
    ]
    
    const features = getAllFeatures()
    const keys = features.map(f => f.key)
    
    expectedKeys.forEach(key => {
      expect(keys).toContain(key)
    })
  })

  it('should get feature metadata by key', () => {
    const reports = getFeatureMetadata('reports')
    expect(reports).toBeDefined()
    expect(reports?.label).toBe('Reports')
    expect(reports?.fieldName).toBe('reportsEnabled')
  })

  it('should return features with sub-features', () => {
    const featuresWithSubs = getFeaturesWithSubFeatures()
    
    // Should have at least reports, calendar, forms, and players
    expect(featuresWithSubs.length).toBeGreaterThanOrEqual(4)
    
    // Check reports has sub-features
    const reports = featuresWithSubs.find(f => f.key === 'reports')
    expect(reports?.subFeatures.length).toBeGreaterThan(0)
  })

  it('should map paths to feature keys correctly', () => {
    expect(getFeatureKeyFromPath('/dashboard/reports')).toBe('reports')
    expect(getFeatureKeyFromPath('/dashboard/reports/builder')).toBe('reports')
    expect(getFeatureKeyFromPath('/dashboard/players')).toBe('players')
    expect(getFeatureKeyFromPath('/dashboard/calendar/events/123')).toBe('calendar')
    expect(getFeatureKeyFromPath('/dashboard')).toBeNull()
  })

  it('should have valid navigation paths', () => {
    const features = getAllFeatures()
    
    features.forEach(feature => {
      expect(feature.navPath).toMatch(/^\/dashboard\//)
      expect(feature.navPath).not.toContain(' ')
    })
  })

  it('should have all required metadata fields', () => {
    const features = getAllFeatures()
    
    features.forEach(feature => {
      expect(feature.key).toBeDefined()
      expect(feature.label).toBeDefined()
      expect(feature.description).toBeDefined()
      expect(feature.icon).toBeDefined()
      expect(feature.fieldName).toBeDefined()
      expect(feature.navPath).toBeDefined()
      expect(Array.isArray(feature.subFeatures)).toBe(true)
    })
  })

  it('should have valid sub-feature metadata', () => {
    const reports = getFeatureMetadata('reports')
    
    reports?.subFeatures.forEach(subFeature => {
      expect(subFeature.key).toBeDefined()
      expect(subFeature.label).toBeDefined()
      expect(subFeature.description).toBeDefined()
      expect(subFeature.fieldName).toBeDefined()
      expect(subFeature.fieldName).toMatch(/Enabled$/)
    })
  })

  it('should have unique feature keys', () => {
    const features = getAllFeatures()
    const keys = features.map(f => f.key)
    const uniqueKeys = new Set(keys)
    
    expect(keys.length).toBe(uniqueKeys.size)
  })

  it('should have unique field names', () => {
    const features = getAllFeatures()
    const fieldNames = features.map(f => f.fieldName)
    const uniqueFieldNames = new Set(fieldNames)
    
    expect(fieldNames.length).toBe(uniqueFieldNames.size)
  })

  it('should have reports with all expected sub-features', () => {
    const reports = getFeatureMetadata('reports')
    
    expect(reports?.subFeatures).toHaveLength(5)
    
    const subFeatureKeys = reports?.subFeatures.map(sf => sf.key) || []
    expect(subFeatureKeys).toContain('reportsBuilder')
    expect(subFeatureKeys).toContain('reportsTemplates')
    expect(subFeatureKeys).toContain('reportsScheduling')
    expect(subFeatureKeys).toContain('reportsAiInsights')
    expect(subFeatureKeys).toContain('reportsSharing')
  })

  it('should have calendar with all expected sub-features', () => {
    const calendar = getFeatureMetadata('calendar')
    
    expect(calendar?.subFeatures).toHaveLength(6)
    
    const subFeatureKeys = calendar?.subFeatures.map(sf => sf.key) || []
    expect(subFeatureKeys).toContain('calendarAttendance')
    expect(subFeatureKeys).toContain('calendarForms')
    expect(subFeatureKeys).toContain('calendarDrawings')
    expect(subFeatureKeys).toContain('calendarSpreadsheets')
    expect(subFeatureKeys).toContain('calendarNotes')
    expect(subFeatureKeys).toContain('calendarFiles')
  })

  it('should have forms with all expected sub-features', () => {
    const forms = getFeatureMetadata('forms')
    
    expect(forms?.subFeatures).toHaveLength(3)
    
    const subFeatureKeys = forms?.subFeatures.map(sf => sf.key) || []
    expect(subFeatureKeys).toContain('formsBuilder')
    expect(subFeatureKeys).toContain('formsResponses')
    expect(subFeatureKeys).toContain('formsScheduling')
  })

  it('should have players with all expected sub-features', () => {
    const players = getFeatureMetadata('players')
    
    expect(players?.subFeatures).toHaveLength(3)
    
    const subFeatureKeys = players?.subFeatures.map(sf => sf.key) || []
    expect(subFeatureKeys).toContain('playersNotes')
    expect(subFeatureKeys).toContain('playersFiles')
    expect(subFeatureKeys).toContain('playersMedicalData')
  })
})

describe('Feature Hierarchy', () => {
  it('should return proper hierarchy structure', () => {
    const features = getAllFeatures()
    
    features.forEach(feature => {
      if (feature.subFeatures.length > 0) {
        feature.subFeatures.forEach(subFeature => {
          // Sub-feature field name should start with parent feature key
          expect(subFeature.fieldName.toLowerCase()).toContain(feature.key.toLowerCase())
        })
      }
    })
  })
})

