
export type ConfidenceLevel = 'high' | 'low' | 'none';

export interface ExtractedField {
  value: string;
  confidence: ConfidenceLevel;
}

export interface ExtractedData {
  fullName: ExtractedField;
  age: ExtractedField;
  nationality: ExtractedField;
  job: ExtractedField;
}

export type ExtractedDataKey = keyof ExtractedData;
