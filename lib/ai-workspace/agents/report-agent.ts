import { BaseAgent, AgentStep, AgentResult, StreamCallback } from './base-agent'

const REPORT_STEPS: AgentStep[] = [
  {
    name: 'Planning',
    description: 'Analyze requirements and plan the report structure',
    systemPrompt: `You are a sports analytics expert planning a data report.

Your task is to:
1. Understand what metrics and insights the user wants
2. Plan which visualizations will best show the data
3. Determine the appropriate time period and scope
4. Decide on KPI cards to highlight key findings

Think through:
- What story does the data need to tell?
- Which chart types best suit each metric?
- What KPIs matter most?
- How should the layout flow?

You do NOT need to provide JSON yet. Just think and plan.`,
  },
  {
    name: 'Configuration',
    description: 'Generate the report configuration',
    systemPrompt: `You are a sports analytics expert creating a report configuration.

Based on the planning from the previous step, generate a complete JSON configuration.

CRITICAL REQUIREMENTS - YOU MUST FOLLOW THESE EXACTLY:

1. **KPIs**: Include EXACTLY 3-5 meaningful KPIs that directly relate to the data requested
2. **Charts**: Create EXACTLY 1-3 visualizations (NEVER more than 3)
3. **Chart Variety**: Use DIFFERENT chart types - NEVER use the same type for all charts
4. **Chart Purpose**: Each visualization must have a distinct purpose and tell part of the story

Chart Type Guidelines:
- Line charts → Use for trends over time
- Bar charts → Use for comparisons between categories
- Area charts → Use for cumulative data over time
- Pie charts → Use for proportions/distributions (percentages)
- Table charts → Use for detailed data listings with multiple columns

Chart Type Examples:
GOOD EXAMPLE (varied types):
- Chart 1: Line chart for "Wellness Trend Over Time"
- Chart 2: Bar chart for "Player Comparison by Average Training Load"

BAD EXAMPLE (all same type):
- Chart 1: Line chart for wellness
- Chart 2: Line chart for training load  ❌ WRONG - use bar or area instead

Time Period Requirements:
- Use: "last7Days", "last30Days", or "last90Days"
- NEVER use custom dates unless explicitly requested

Provide your response ending with:
\`\`\`json
{
  "reportConfig": {
    "title": "Clear, specific title",
    "timePeriod": "last7Days|last30Days|last90Days",
    "players": ["all"] or ["player-id-1", "player-id-2"],
    "metrics": ["wellness", "trainingLoad", "recovery", "performance"],
    "visualizationType": "line|bar|area|pie",
    "charts": [
      {
        "type": "line",
        "title": "Wellness Trend Over Time",
        "xAxis": "date",
        "yAxis": "score",
        "series": ["wellness", "fatigue"]
      },
      {
        "type": "bar",
        "title": "Player Training Load Comparison",
        "xAxis": "player",
        "yAxis": "load",
        "series": ["trainingLoad"]
      }
    ],
    "kpis": [
      {
        "label": "Average Wellness Score",
        "value": "N/A (connect to data)",
        "format": "number",
        "trend": "up",
        "description": "Team average wellness for period"
      },
      {
        "label": "Total Training Sessions",
        "value": "N/A (connect to data)",
        "format": "number",
        "trend": "neutral",
        "description": "Number of training sessions completed"
      },
      {
        "label": "Injury Risk Level",
        "value": "N/A (connect to data)",
        "format": "percentage",
        "trend": "down",
        "description": "Percentage of players in high-risk category"
      }
    ]
  }
}
\`\`\``,
  },
]

const VALIDATION_RULES = [
  'Report must have a clear, descriptive title',
  'Time period must be one of: last7Days, last30Days, last90Days, custom',
  'Charts array should have 1-3 visualizations (not empty, not excessive)',
  'Each chart must have: type, title, series',
  'Chart types must be: line, bar, area, pie, or table',
  'Each KPI must have: label, value, format',
  'KPI labels must be descriptive and specific',
  'No duplicate chart titles',
  'If multiple charts exist, they should use different chart types (avoid all line, all bar, etc)',
]

export class ReportAgent extends BaseAgent {
  async generateReport(
    userPrompt: string,
    structuredInputs: any,
    currentConfig: any | null,
    callbacks?: StreamCallback
  ): Promise<AgentResult> {
    // Execute multi-step generation
    const result = await this.execute(
      REPORT_STEPS,
      userPrompt,
      structuredInputs,
      currentConfig,
      callbacks
    )

    // If generation succeeded, validate the config
    if (result.success && result.config) {
      const validation = await this.validate(result.config, VALIDATION_RULES, callbacks)

      if (!validation.valid) {
        return {
          ...result,
          success: false,
          errors: [...(result.errors || []), ...validation.issues],
        }
      }
    }

    return result
  }
}
