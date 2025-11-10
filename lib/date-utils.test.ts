import { describe, it, expect } from "vitest";
import { formatDate, formatTime, formatDateTime, formatDateRange, type UserPreferences } from "../lib/date-utils";

describe("Date Formatting Utilities", () => {
  const testDate = new Date("2024-12-25T15:30:00Z"); // Christmas 2024, 3:30 PM UTC

  describe("formatDate", () => {
    it("should format date in DD/MM/YYYY format by default", () => {
      const result = formatDate(testDate);
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it("should format date according to user preference - DD/MM/YYYY", () => {
      const preferences: UserPreferences = { dateFormat: "DD/MM/YYYY" };
      const result = formatDate(testDate, preferences);
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it("should format date according to user preference - MM/DD/YYYY", () => {
      const preferences: UserPreferences = { dateFormat: "MM/DD/YYYY" };
      const result = formatDate(testDate, preferences);
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      // Verify it's MM/DD format (month should be 12, not 25)
      const parts = result.split("/");
      expect(parts[0]).toBe("12"); // Month
    });

    it("should format date according to user preference - YYYY-MM-DD", () => {
      const preferences: UserPreferences = { dateFormat: "YYYY-MM-DD" };
      const result = formatDate(testDate, preferences);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result).toContain("2024");
    });

    it("should handle timezone conversion", () => {
      const preferences: UserPreferences = { 
        dateFormat: "DD/MM/YYYY",
        timezone: "America/New_York" 
      };
      const result = formatDate(testDate, preferences);
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it("should handle invalid dates", () => {
      const invalidDate = new Date("invalid");
      const result = formatDate(invalidDate);
      expect(result).toBe("Invalid Date");
    });

    it("should handle string dates", () => {
      const result = formatDate("2024-12-25T15:30:00Z");
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });

  describe("formatTime", () => {
    it("should format time in 24-hour format by default", () => {
      const result = formatTime(testDate);
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it("should format time in 12-hour format when specified", () => {
      const preferences: UserPreferences = { timeFormat: "12" };
      const result = formatTime(testDate, preferences);
      expect(result).toMatch(/\d{1,2}:\d{2}\s(AM|PM)/);
    });

    it("should format time in 24-hour format when specified", () => {
      const preferences: UserPreferences = { timeFormat: "24" };
      const result = formatTime(testDate, preferences);
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it("should handle timezone conversion", () => {
      const preferences: UserPreferences = { 
        timeFormat: "24",
        timezone: "America/New_York" 
      };
      const result = formatTime(testDate, preferences);
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it("should handle invalid dates", () => {
      const invalidDate = new Date("invalid");
      const result = formatTime(invalidDate);
      expect(result).toBe("Invalid Time");
    });
  });

  describe("formatDateTime", () => {
    it("should format both date and time", () => {
      const result = formatDateTime(testDate);
      expect(result).toContain("/"); // Date separator
      expect(result).toContain(":"); // Time separator
    });

    it("should respect user preferences", () => {
      const preferences: UserPreferences = { 
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12" 
      };
      const result = formatDateTime(testDate, preferences);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}\s+\d{1,2}:\d{2}\s(AM|PM)/);
    });
  });

  describe("formatDateRange", () => {
    const startDate = new Date("2024-12-25T10:00:00Z");
    const endDate = new Date("2024-12-25T15:00:00Z");

    it("should format date range for same day", () => {
      const result = formatDateRange(startDate, endDate);
      expect(result).toContain(" - "); // Time separator
      // Should show date once, then time range
    });

    it("should format date range for different days", () => {
      const endDateDifferent = new Date("2024-12-26T15:00:00Z");
      const result = formatDateRange(startDate, endDateDifferent);
      expect(result).toContain(" - "); // Should have date and time for both
    });

    it("should respect user preferences", () => {
      const preferences: UserPreferences = { 
        dateFormat: "YYYY-MM-DD",
        timeFormat: "12" 
      };
      const result = formatDateRange(startDate, endDate, preferences);
      expect(result).toContain("2024");
      expect(result).toMatch(/(AM|PM)/);
    });
  });

  describe("Language Support", () => {
    it("should format dates in different languages", () => {
      const spanishPrefs: UserPreferences = { 
        dateFormat: "DD/MM/YYYY",
        language: "es"
      };
      const frenchPrefs: UserPreferences = { 
        dateFormat: "DD/MM/YYYY",
        language: "fr"
      };
      
      const spanishResult = formatDate(testDate, spanishPrefs);
      const frenchResult = formatDate(testDate, frenchPrefs);
      
      // Should still produce valid date format
      expect(spanishResult).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      expect(frenchResult).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it("should format times in different languages", () => {
      const spanishPrefs: UserPreferences = { 
        timeFormat: "12",
        language: "es"
      };
      
      const result = formatTime(testDate, spanishPrefs);
      // Spanish uses "a. m." and "p. m." instead of "AM"/"PM"
      expect(result).toBeTruthy();
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe("Consistency Tests", () => {
    it("should produce consistent results for the same input", () => {
      const preferences: UserPreferences = { 
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24",
        timezone: "UTC"
      };
      
      const result1 = formatDate(testDate, preferences);
      const result2 = formatDate(testDate, preferences);
      
      expect(result1).toBe(result2);
    });

    it("should handle null preferences gracefully", () => {
      const preferences: UserPreferences = {
        dateFormat: null,
        timeFormat: null,
        timezone: null,
        language: null
      };
      
      const dateResult = formatDate(testDate, preferences);
      const timeResult = formatTime(testDate, preferences);
      
      expect(dateResult).toBeTruthy();
      expect(timeResult).toBeTruthy();
    });
  });
});

