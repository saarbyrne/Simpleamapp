export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  priority: "low" | "medium" | "high";
  voiceNote?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  starred?: boolean;
}

export interface Insight {
  id: string;
  type: "trend" | "suggestion" | "alert" | "achievement";
  title: string;
  description: string;
  actionItems?: string[];
  priority: "low" | "medium" | "high";
  category: string;
  createdAt: Date;
}