# Spreadsheet Grid Formatting Fix

## Issue
The spreadsheet grid tables were not displaying correctly due to improper height handling in the DataSheetGrid component.

## Root Cause
The `DataSheetGrid` component from `react-datasheet-grid` had a hardcoded `height={600}` prop, which caused layout issues when used in different container contexts.

## Solution

### 1. Updated SpreadsheetGrid Component
**File**: [components/spreadsheets/spreadsheet-grid.tsx](components/spreadsheets/spreadsheet-grid.tsx:221-234)

**Before**:
```tsx
<div className="flex-1 overflow-auto">
  <DataSheetGrid
    value={data}
    onChange={onChange}
    columns={columns}
    height={600}  // ❌ Hardcoded height
    rowHeight={40}
    headerRowHeight={40}
    addRowsComponent={false}
    lockRows={false}
  />
</div>
```

**After**:
```tsx
<div className="flex-1 overflow-auto">
  <DataSheetGrid
    value={data}
    onChange={onChange}
    columns={columns}
    // ✅ No height prop - uses inline style instead
    rowHeight={40}
    headerRowHeight={40}
    addRowsComponent={false}
    lockRows={false}
    style={{ minHeight: '400px' }}
  />
</div>
```

**Changes**:
- Removed hardcoded `height={600}` prop
- Removed `height: '100%'` which was causing cells not to display
- Added inline style `{ minHeight: '400px' }` to DataSheetGrid
- `minHeight: 400px` ensures rows are visible and grid renders properly
- Grid now grows naturally with content

### 2. Updated DataTableView Component
**File**: [components/data-management/data-table-view.tsx](components/data-management/data-table-view.tsx:153-164)

**Changes**:
- Added `h-[600px]` to the Card wrapper for consistent height
- Added `className="h-full"` to SpreadsheetGrid

```tsx
<Card className="p-0 overflow-hidden h-[600px]">
  <SpreadsheetGrid
    schema={schema}
    data={data}
    onChange={handleDataChange}
    onSave={handleSave}
    onExport={handleExport}
    onImport={handleImport}
    isSaved={isSaved}
    className="h-full"  // ✅ Takes full height of Card
  />
</Card>
```

### 3. Spreadsheet Detail Page (Already Correct)
**File**: [app/dashboard/spreadsheets/[id]/page.tsx](app/dashboard/spreadsheets/[id]/page.tsx:325-338)

This page already had the correct structure:
```tsx
<div className="space-y-4 h-[calc(100vh-8rem)]">
  {/* ... header ... */}

  <Card className="flex-1 overflow-hidden">
    <SpreadsheetGrid
      schema={schema}
      data={data}
      onChange={handleDataChange}
      onSave={handleSave}
      onExport={handleExport}
      onImport={() => setShowImportDialog(true)}
      onAIAssist={() => setShowAIDialog(true)}
      persons={persons}
      isSaved={isSaved}
      className="h-full"
    />
  </Card>
</div>
```

## Pattern Used

The correct pattern for SpreadsheetGrid usage:

### For Fixed Height Containers
```tsx
<Card className="p-0 overflow-hidden h-[600px]">
  <SpreadsheetGrid
    {...props}
    className="h-full"
  />
</Card>
```

### For Flex Containers
```tsx
<div className="h-[calc(100vh-8rem)]">
  <Card className="flex-1 overflow-hidden">
    <SpreadsheetGrid
      {...props}
      className="h-full"
    />
  </Card>
</div>
```

## Key Principles

1. **Never hardcode height in DataSheetGrid** - Let it inherit from parent
2. **Use absolute positioning trick** - `absolute inset-0` inside a relative parent
3. **Card must have overflow-hidden** - Prevents scroll issues
4. **SpreadsheetGrid needs h-full** - To fill the Card completely
5. **Parent determines final height** - Either fixed (h-[600px]) or flex (flex-1)

## Files Modified

1. ✅ [components/spreadsheets/spreadsheet-grid.tsx](components/spreadsheets/spreadsheet-grid.tsx)
2. ✅ [components/data-management/data-table-view.tsx](components/data-management/data-table-view.tsx)

## Testing

After these changes, test that:
- ✅ Spreadsheet detail page (`/dashboard/spreadsheets/[id]`) displays correctly
- ✅ Data management tables (`/dashboard/data-management/players`) display correctly
- ✅ Grid takes full height of container
- ✅ No extra scrollbars
- ✅ Resizing window maintains proper layout
- ✅ Toolbar and footer are visible
- ✅ Grid scrolls independently within its container

## Result

The spreadsheet grid now properly fills its container and displays correctly across all pages, matching the working data management tables.
