import { MetricKey } from './types';

// Human-readable labels for metrics
export const METRIC_LABELS: Record<MetricKey, string> = {
    rpe: 'Rate of Perceived Exertion',
    wellness_score: 'Wellness Score',
    sleep_quality: 'Sleep Quality',
    mood: 'Mood',
    stress: 'Stress Level',
    load: 'Training Load',
    fatigue: 'Fatigue',
    soreness: 'Muscle Soreness',
    hrv: 'Heart Rate Variability',
    sleep_duration: 'Sleep Duration'
};

// Semantic mappings: user terms → system metrics
export const SEMANTIC_METRIC_MAP: Record<string, MetricKey[]> = {
    'mental': ['rpe', 'mood', 'stress', 'wellness_score'],
    'physical': ['load', 'fatigue', 'soreness', 'hrv'],
    'recovery': ['sleep_quality', 'sleep_duration', 'hrv', 'fatigue'],
    'readiness': ['wellness_score', 'fatigue', 'soreness', 'sleep_quality'],
    'fitness': ['load', 'hrv'],
    'wellbeing': ['wellness_score', 'mood', 'stress']
};

// Role abbreviations for display
export const ROLE_ABBREVIATIONS: Record<string, string> = {
    head_of_performance: 'HOP',
    sports_scientist: 'SS',
    head_coach: 'HC',
    assistant_coach: 'AC',
    fitness_coach: 'FC',
    physio: 'PT',
    doctor: 'MD',
    analyst: 'AN'
};
