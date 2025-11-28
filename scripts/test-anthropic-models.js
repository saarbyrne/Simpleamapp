/**
 * Test script to verify which Anthropic models are available
 */

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

const modelsToTest = [
    // Haiku models
    'claude-3-5-haiku-20241022',
    'claude-3-haiku-20240307',
    // Sonnet 4.5 (new)
    'claude-sonnet-4-5-20250514',
    'claude-4-5-sonnet-20250514',
    // Older Sonnet 3.5
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-sonnet-20240229',
    // Opus
    'claude-3-opus-20240229',
];

async function testModel(modelId) {
    try {
        const response = await anthropic.messages.create({
            model: modelId,
            max_tokens: 10,
            messages: [{
                role: 'user',
                content: 'Hi'
            }]
        });
        console.log(`✅ ${modelId} - AVAILABLE`);
        return true;
    } catch (error) {
        if (error.status === 404) {
            console.log(`❌ ${modelId} - NOT FOUND`);
        } else {
            console.log(`⚠️  ${modelId} - ERROR: ${error.message}`);
        }
        return false;
    }
}

async function main() {
    console.log('Testing Anthropic models...\n');

    for (const model of modelsToTest) {
        await testModel(model);
    }
}

main().catch(console.error);
