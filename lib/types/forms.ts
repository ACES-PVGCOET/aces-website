export type QuestionType = 'textual' | 'multiple_choice' | 'file';

export interface TextualPolicy {
  max_len: number;
}

export interface MultipleChoicePolicy {
  type: 'Single' | 'Multiple';
  options: string[];
}

export interface FilePolicy {
  supported_types: string[];
  max_size_mb: number;
}

export interface FormQuestion {
  question_id?: string;
  question_serial: number;
  question_statement: string;
  question_type: QuestionType;
  is_required: boolean;
  image_url?: string;
  textual_policy?: TextualPolicy;
  multiple_choice_policy?: MultipleChoicePolicy;
  file_policy?: FilePolicy;
}

export interface FormDetail {
  form_id: string;
  title: string;
  description?: string;
  is_active: boolean;
  questions: FormQuestion[];
  created_at?: string;
  updated_at?: string;
}

export interface FormListItem {
  form_id: string;
  title: string;
  description?: string;
  is_active: boolean;
  question_count: number;
  response_count?: number;
  created_at?: string;
}

export interface FormSubmitPayload {
  email: string;
  answers: Record<string, string[]>;
}
