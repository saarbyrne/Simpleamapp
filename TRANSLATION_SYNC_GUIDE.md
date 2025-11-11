# Translation Sync System

This document explains the automated translation sync system that ensures all supported languages stay in sync.

## Overview

The translation sync system automatically:
- ✅ Detects missing translation keys across all language files
- ✅ Adds missing keys with placeholder values
- ✅ Keeps all language files synchronized with the English source
- ✅ Validates translations in CI/CD pipelines

## Supported Languages

The system supports **8 languages**:
- 🇬🇧 English (`en`) - Source language
- 🇪🇸 Spanish (`es`)
- 🇫🇷 French (`fr`)
- 🇩🇪 German (`de`)
- 🇵🇹 Portuguese (`pt`)
- 🇮🇹 Italian (`it`)
- 🇯🇵 Japanese (`ja`)
- 🇸🇦 Arabic (`ar`) - RTL support

## Usage

### Sync Missing Translations

Add missing keys to all language files (with placeholder values):

```bash
npm run i18n:sync
```

This will:
1. Read `messages/en.json` as the source
2. Compare all other language files
3. Add missing keys with `[TODO: Translate]` placeholders
4. Sort keys alphabetically for consistency

### Cleanup TODOs

If you have `[TODO: Translate]` placeholders in your translation files, clean them up:

```bash
npm run i18n:cleanup
```

This replaces all TODO placeholders with English text as a fallback, ensuring the app works properly even if translations aren't complete.

**Note:** The sync script now uses English as fallback by default (no more TODOs), but this cleanup command is useful if you have existing TODOs.

Check if any translations are missing (useful for CI/CD):

```bash
npm run i18n:sync:check
```

This will:
- Exit with code 0 if all translations are in sync
- Exit with code 1 if missing translations are found
- Display a list of missing keys per language

### Workflow

**When adding new translations:**

1. **Add keys to English (`messages/en.json`)**:
   ```json
   {
     "newFeature": {
       "title": "New Feature",
       "description": "This is a new feature"
     }
   }
   ```

2. **Run sync script**:
   ```bash
   npm run i18n:sync
   ```

3. **Translate placeholders**:
   - Open each language file (`messages/es.json`, `messages/fr.json`, etc.)
   - Find `[TODO: Translate]` placeholders
   - Replace with proper translations

4. **Verify**:
   ```bash
   npm run i18n:sync:check
   ```

## CI/CD Integration

The system includes a GitHub Actions workflow (`.github/workflows/translation-sync.yml`) that:
- ✅ Runs on every pull request
- ✅ Checks if translations are missing
- ✅ Fails the build if translations are out of sync
- ✅ Provides helpful error messages

## How It Works

### Key Detection

The sync script:
1. Recursively traverses the English translation object
2. Compares each key with other language files
3. Identifies missing keys at any nesting level
4. Adds missing keys with placeholder values

### Placeholder Format

Missing keys are added with this format:
```json
{
  "newKey": "[TODO: Translate] Original English text"
}
```

This makes it easy to:
- Find untranslated keys
- See the original English text
- Replace with proper translations

### Key Sorting

All keys are sorted alphabetically for:
- Consistency across files
- Easier navigation
- Reduced merge conflicts

## Best Practices

### 1. Always Add to English First

English (`en.json`) is the source of truth. Always add new keys there first.

### 2. Run Sync After Adding Keys

After adding new keys to English, run:
```bash
npm run i18n:sync
```

### 3. Translate Promptly

Don't leave `[TODO: Translate]` placeholders in production. Translate them before merging.

### 4. Use Descriptive Keys

Use clear, hierarchical keys:
```json
{
  "profile": {
    "settings": {
      "title": "Profile Settings"
    }
  }
}
```

### 5. Keep Keys Consistent

Use the same key structure across features:
- `title` for titles
- `description` for descriptions
- `save` for save buttons
- etc.

## Troubleshooting

### Missing Keys Not Detected

If keys aren't being detected:
1. Ensure English file has the keys
2. Check file encoding (should be UTF-8)
3. Verify JSON syntax is valid

### Sync Script Fails

If sync fails:
1. Check JSON syntax in all files
2. Ensure all language files exist
3. Verify file permissions

### CI Check Fails

If CI check fails:
1. Run `npm run i18n:sync` locally
2. Commit the updated files
3. Push changes

## Future Enhancements

Potential improvements:
- 🔄 Auto-translation using AI/ML services
- 📊 Translation completeness dashboard
- 🔔 Slack/email notifications for missing translations
- 🌐 Integration with translation management tools (Crowdin, Lokalise, etc.)

## Related Scripts

- `npm run i18n:audit` - Find hardcoded English text in code
- `npm run i18n:sync` - Sync missing translation keys
- `npm run i18n:sync:check` - Check if translations are in sync

