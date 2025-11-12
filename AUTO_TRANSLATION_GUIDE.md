# Automated Translation Guide

This guide explains how to use the automated translation script to translate all missing keys in your translation files.

## Overview

Instead of manually translating hundreds of keys, you can use translation APIs to automatically translate all missing keys. The script supports multiple providers:

- **OpenAI** (recommended) - Fast, accurate, uses GPT-4o-mini
- **DeepL** - High-quality translations, free tier available
- **Google Translate** - Reliable, requires API key

## Setup

### Option 1: OpenAI (Recommended)

1. Get an OpenAI API key from https://platform.openai.com/api-keys
2. Set the environment variable:
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```

### Option 2: DeepL

1. Get a DeepL API key from https://www.deepl.com/pro-api
2. Set the environment variable:
   ```bash
   export DEEPL_API_KEY="your-api-key-here"
   ```

### Option 3: Google Translate

1. Get a Google Cloud API key with Translation API enabled
2. Set the environment variable:
   ```bash
   export GOOGLE_TRANSLATE_API_KEY="your-api-key-here"
   ```

## Usage

### Translate a single language

```bash
# Using OpenAI
npm run i18n:translate -- --locale=fr --provider=openai

# Using DeepL
npm run i18n:translate -- --locale=fr --provider=deepl

# Using Google Translate
npm run i18n:translate -- --locale=fr --provider=google
```

### Translate all languages

```bash
# Translate all missing keys in all languages
npm run i18n:translate -- --all --provider=openai
```

## How It Works

1. Reads `messages/en.json` as the source of truth
2. Compares with target language file (e.g., `messages/fr.json`)
3. Identifies missing or untranslated keys
4. Uses translation API to translate each missing key
5. Preserves placeholders like `{name}`, `{count}`, etc.
6. Saves translated keys back to the file
7. Includes rate limiting to respect API limits

## Cost Considerations

- **OpenAI GPT-4o-mini**: ~$0.15 per 1M tokens. For ~500 keys, expect ~$0.01-0.05 per language
- **DeepL Free**: 500,000 characters/month free, then paid
- **Google Translate**: $20 per 1M characters

## Example Output

```
🌐 Translating FR using OPENAI...

  ✓ calendar.addDescription
  ✓ calendar.addDescriptionHint
  ✓ calendar.afterOccurrences
  ...

✅ Translated 499 key(s)
⏭️  Skipped 170 already translated key(s)
```

## Notes

- The script preserves placeholders (`{name}`, `{count}`, etc.)
- Already translated keys are skipped
- Errors are logged but don't stop the process
- Rate limiting is built-in to respect API limits
- Translations should be reviewed by native speakers for accuracy

## Review After Translation

After running automated translation, it's recommended to:

1. Review translations for accuracy
2. Check for cultural appropriateness
3. Verify technical terms are correct
4. Test the UI in the target language

## Troubleshooting

### API Key Not Found
Make sure you've set the environment variable:
```bash
export OPENAI_API_KEY="your-key"
```

### Rate Limiting Errors
The script includes delays, but if you hit rate limits:
- Use a different provider
- Run translations in smaller batches
- Wait and retry

### Translation Quality Issues
- Review and manually correct important strings
- Consider using DeepL for better quality
- Use OpenAI GPT-4 (not mini) for better accuracy (modify script)

