export type RecommendationType = 
  | 'Recommended'
  | 'Second Round / Further Evaluation'
  | 'Not Recommended'
  | '';

export type CandidateStatus = 'pending' | 'in_progress' | 'completed';

export interface InterviewerUser {
  uid: string;
  name: string;
  email: string;
  role?: string;
}

export interface Candidate {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  position: string;
  interviewDate: string;
  interviewerId: string;
  interviewerName: string;
  interviewer1Name?: string; // Default: Supriya
  interviewer2Name?: string; // Default: Amit
  isDualPanel?: boolean;
  experience: string;
  previousCompany: string;
  expectedSalary: string;
  noticePeriod: string;
  resumeUrl?: string;
  photoUrl?: string;
  status: CandidateStatus;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionPreset {
  label: string;
  score: number;
  answerSummary: string;
  interviewerNote: string;
}

export interface QuestionDefinition {
  id: number;
  category: string;
  shortCategory: 'marketing' | 'counselling' | 'sales' | 'learning' | 'stability_1' | 'stability_2' | 'pressure' | 'attitude' | 'roleplay';
  categoryTitle: string;
  question: string;
  followUp?: string;
  instructions?: string;
  isRolePlay?: boolean;
  evaluationCriteria: string[];
  suggestedAnswerOptions: string[];
  suggestedObservationNotes: string[];
  quickPresets?: QuestionPreset[];
  maxScore: number;
  scoreScaleLabel: string;
}

export interface InterviewAnswer {
  answerId: string;
  interviewId: string;
  candidateId: string;
  interviewerId: string;
  questionId: number;
  category: string;
  question: string;
  candidateAnswer: string;
  interviewerNotes: string;
  
  // Individual marks for each interviewer
  interviewer1Score: number; // Supriya's mark (1-5)
  interviewer2Score: number; // Amit's mark (1-5)
  score: number; // Average or consensus score (1-5)
  
  interviewer1Notes?: string; // Supriya's specific notes
  interviewer2Notes?: string; // Amit's specific notes
  
  maxScore: number;
  timestamp: string;
}

export interface CategoryScoreSummary {
  marketing: number; // /5
  counselling: number; // /5
  sales: number; // /5
  learning: number; // /5
  stability: number; // /10 (sum of Q5 + Q6)
  pressure: number; // /5
  attitude: number; // /5
  roleplay: number; // /5
  total: number; // /45
  percentage: number; // %
}

export interface DualPanelSummary {
  interviewer1Name: string; // Supriya
  interviewer1TotalScore: number; // /45
  interviewer1Percentage: number;
  interviewer1Recommendation?: RecommendationType;

  interviewer2Name: string; // Amit
  interviewer2TotalScore: number; // /45
  interviewer2Percentage: number;
  interviewer2Recommendation?: RecommendationType;

  combinedTotalScore: number; // /45 (average)
  combinedPercentage: number;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  position: string;
  interviewDate: string;
  interviewerId: string;
  interviewerName: string;
  
  // Panel Interviewers
  interviewer1Name: string; // e.g. "Supriya"
  interviewer2Name: string; // e.g. "Amit"
  isDualPanel?: boolean;
  
  // Timing
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  timeRemainingSeconds: number;
  
  // State
  currentQuestionIndex: number; // 0 to 8 (9 questions total)
  status: 'draft' | 'completed';
  
  // Scoring
  answers: Record<number, InterviewAnswer>; // key is questionId (1-9)
  scoresSummary?: CategoryScoreSummary;
  dualPanelSummary?: DualPanelSummary;
  
  totalScore: number; // /45 (combined average)
  interviewer1TotalScore?: number; // Supriya's total /45
  interviewer2TotalScore?: number; // Amit's total /45
  maxScore: number; // 45
  percentage: number;
  
  // Individual & Overall Recommendations
  interviewer1Recommendation?: RecommendationType;
  interviewer2Recommendation?: RecommendationType;
  recommendation: RecommendationType; // Consensus
  recommendedPosition: string;
  
  // Overall Evaluation Notes
  strengths: string;
  weaknesses: string;
  redFlags: string;
  additionalComments: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalCandidates: number;
  completedInterviews: number;
  pendingInterviews: number;
  averageScore: number;
  recommendedCount: number;
  notRecommendedCount: number;
  secondRoundCount: number;
}
