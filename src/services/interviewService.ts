import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  Candidate, 
  Interview, 
  InterviewAnswer, 
  CategoryScoreSummary,
  DualPanelSummary,
  DashboardStats,
  RecommendationType
} from '../types';

export function calculateScoreSummary(
  answers: Record<number, InterviewAnswer>,
  interviewer1Name = 'Supriya',
  interviewer2Name = 'Amit'
): {
  summary: CategoryScoreSummary;
  int1Summary: CategoryScoreSummary;
  int2Summary: CategoryScoreSummary;
  dualPanelSummary: DualPanelSummary;
  totalScore: number; // Combined average
  interviewer1Total: number;
  interviewer2Total: number;
  maxScore: number;
  percentage: number;
} {
  // Compute Question 1 to 9 scores for Interviewer 1 (Supriya), Interviewer 2 (Amit), and Combined
  const getQScore = (qId: number) => {
    const ans = answers[qId];
    if (!ans) return { int1: 0, int2: 0, avg: 0 };
    
    // If individual scores were explicitly set
    const s1 = ans.interviewer1Score !== undefined ? ans.interviewer1Score : ans.score || 0;
    const s2 = ans.interviewer2Score !== undefined ? ans.interviewer2Score : ans.score || 0;
    
    // If one is 0 and the other is > 0, or both are set
    let avg = 0;
    if (s1 > 0 && s2 > 0) {
      avg = Math.round(((s1 + s2) / 2) * 10) / 10;
    } else if (s1 > 0) {
      avg = s1;
    } else if (s2 > 0) {
      avg = s2;
    } else {
      avg = ans.score || 0;
    }

    return { int1: s1, int2: s2, avg };
  };

  const q1 = getQScore(1);
  const q2 = getQScore(2);
  const q3 = getQScore(3);
  const q4 = getQScore(4);
  const q5 = getQScore(5);
  const q6 = getQScore(6);
  const q7 = getQScore(7);
  const q8 = getQScore(8);
  const q9 = getQScore(9);

  // Combined Category Summary
  const summary: CategoryScoreSummary = {
    marketing: q1.avg,
    counselling: q2.avg,
    sales: q3.avg,
    learning: q4.avg,
    stability: Math.round((q5.avg + q6.avg) * 10) / 10,
    pressure: q7.avg,
    attitude: q8.avg,
    roleplay: q9.avg,
    total: Math.round((q1.avg + q2.avg + q3.avg + q4.avg + q5.avg + q6.avg + q7.avg + q8.avg + q9.avg) * 10) / 10,
    percentage: 0
  };
  summary.percentage = Math.round((summary.total / 45) * 1000) / 10;

  // Interviewer 1 (Supriya) Summary
  const int1Summary: CategoryScoreSummary = {
    marketing: q1.int1,
    counselling: q2.int1,
    sales: q3.int1,
    learning: q4.int1,
    stability: q5.int1 + q6.int1,
    pressure: q7.int1,
    attitude: q8.int1,
    roleplay: q9.int1,
    total: q1.int1 + q2.int1 + q3.int1 + q4.int1 + q5.int1 + q6.int1 + q7.int1 + q8.int1 + q9.int1,
    percentage: 0
  };
  int1Summary.percentage = Math.round((int1Summary.total / 45) * 1000) / 10;

  // Interviewer 2 (Amit) Summary
  const int2Summary: CategoryScoreSummary = {
    marketing: q2.int2,
    counselling: q2.int2,
    sales: q3.int2,
    learning: q4.int2,
    stability: q5.int2 + q6.int2,
    pressure: q7.int2,
    attitude: q8.int2,
    roleplay: q9.int2,
    total: q1.int2 + q2.int2 + q3.int2 + q4.int2 + q5.int2 + q6.int2 + q7.int2 + q8.int2 + q9.int2,
    percentage: 0
  };
  int2Summary.percentage = Math.round((int2Summary.total / 45) * 1000) / 10;

  const dualPanelSummary: DualPanelSummary = {
    interviewer1Name,
    interviewer1TotalScore: int1Summary.total,
    interviewer1Percentage: int1Summary.percentage,
    interviewer2Name,
    interviewer2TotalScore: int2Summary.total,
    interviewer2Percentage: int2Summary.percentage,
    combinedTotalScore: summary.total,
    combinedPercentage: summary.percentage
  };

  return {
    summary,
    int1Summary,
    int2Summary,
    dualPanelSummary,
    totalScore: summary.total,
    interviewer1Total: int1Summary.total,
    interviewer2Total: int2Summary.total,
    maxScore: 45,
    percentage: summary.percentage
  };
}

// Candidates Services
export async function createCandidate(candidateData: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate> {
  const candidateId = 'cand_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();
  
  const candidate: Candidate = {
    ...candidateData,
    id: candidateId,
    interviewer1Name: candidateData.interviewer1Name || 'Supriya',
    interviewer2Name: candidateData.interviewer2Name || 'Amit',
    isDualPanel: true,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  const path = `candidates/${candidateId}`;
  try {
    await setDoc(doc(db, 'candidates', candidateId), {
      candidateId,
      fullName: candidate.fullName,
      phone: candidate.phone,
      email: candidate.email,
      position: candidate.position,
      interviewDate: candidate.interviewDate,
      interviewerId: candidate.interviewerId,
      interviewerName: candidate.interviewerName,
      interviewer1Name: candidate.interviewer1Name,
      interviewer2Name: candidate.interviewer2Name,
      isDualPanel: true,
      experience: candidate.experience || '',
      previousCompany: candidate.previousCompany || '',
      expectedSalary: candidate.expectedSalary || '',
      noticePeriod: candidate.noticePeriod || '',
      resumeUrl: candidate.resumeUrl || '',
      photoUrl: candidate.photoUrl || '',
      status: candidate.status,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt
    });
    return candidate;
  } catch (error) {
    return handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getCandidates(): Promise<Candidate[]> {
  const path = 'candidates';
  try {
    const q = query(collection(db, 'candidates'));
    const snapshot = await getDocs(q);
    const candidates: Candidate[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      candidates.push({
        id: docSnap.id,
        fullName: data.fullName || '',
        phone: data.phone || '',
        email: data.email || '',
        position: data.position || '',
        interviewDate: data.interviewDate || '',
        interviewerId: data.interviewerId || '',
        interviewerName: data.interviewerName || (data.interviewer1Name && data.interviewer2Name ? `${data.interviewer1Name} & ${data.interviewer2Name}` : 'Supriya & Amit'),
        interviewer1Name: data.interviewer1Name || 'Supriya',
        interviewer2Name: data.interviewer2Name || 'Amit',
        isDualPanel: data.isDualPanel ?? true,
        experience: data.experience || '',
        previousCompany: data.previousCompany || '',
        expectedSalary: data.expectedSalary || '',
        noticePeriod: data.noticePeriod || '',
        resumeUrl: data.resumeUrl || '',
        photoUrl: data.photoUrl || '',
        status: data.status || 'pending',
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
      });
    });
    return candidates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteCandidateAndInterview(candidateId: string, interviewId?: string): Promise<void> {
  const candidatePath = `candidates/${candidateId}`;
  try {
    await deleteDoc(doc(db, 'candidates', candidateId));
    if (interviewId) {
      await deleteDoc(doc(db, 'interviews', interviewId));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, candidatePath);
  }
}

// Interviews Services
export async function createOrUpdateInterviewDraft(interview: Interview): Promise<void> {
  const interviewPath = `interviews/${interview.id}`;
  const now = new Date().toISOString();
  
  try {
    await setDoc(doc(db, 'interviews', interview.id), {
      interviewId: interview.id,
      candidateId: interview.candidateId,
      candidateName: interview.candidateName,
      candidateEmail: interview.candidateEmail,
      candidatePhone: interview.candidatePhone,
      position: interview.position,
      interviewDate: interview.interviewDate,
      interviewerId: interview.interviewerId,
      interviewerName: interview.interviewerName,
      interviewer1Name: interview.interviewer1Name || 'Supriya',
      interviewer2Name: interview.interviewer2Name || 'Amit',
      isDualPanel: true,
      startTime: interview.startTime,
      endTime: interview.endTime || '',
      durationSeconds: interview.durationSeconds,
      timeRemainingSeconds: interview.timeRemainingSeconds,
      currentQuestionIndex: interview.currentQuestionIndex,
      status: interview.status,
      totalScore: interview.totalScore,
      interviewer1TotalScore: interview.interviewer1TotalScore ?? interview.totalScore,
      interviewer2TotalScore: interview.interviewer2TotalScore ?? interview.totalScore,
      maxScore: interview.maxScore,
      percentage: interview.percentage,
      interviewer1Recommendation: interview.interviewer1Recommendation || '',
      interviewer2Recommendation: interview.interviewer2Recommendation || '',
      recommendation: interview.recommendation,
      recommendedPosition: interview.recommendedPosition,
      strengths: interview.strengths,
      weaknesses: interview.weaknesses,
      redFlags: interview.redFlags,
      additionalComments: interview.additionalComments,
      createdAt: interview.createdAt,
      updatedAt: now,
      answersData: interview.answers
    });

    // Update candidate status
    await updateDoc(doc(db, 'candidates', interview.candidateId), {
      status: interview.status === 'completed' ? 'completed' : 'in_progress',
      updatedAt: now
    });

    // Save each individual answer
    for (const qId of Object.keys(interview.answers)) {
      const ans = interview.answers[Number(qId)];
      if (ans) {
        const answerDocId = `ans_${interview.id}_${ans.questionId}`;
        await setDoc(doc(db, 'interview_answers', answerDocId), {
          answerId: answerDocId,
          interviewId: interview.id,
          candidateId: interview.candidateId,
          interviewerId: interview.interviewerId,
          questionId: ans.questionId,
          category: ans.category,
          question: ans.question,
          candidateAnswer: ans.candidateAnswer || '',
          interviewerNotes: ans.interviewerNotes || '',
          interviewer1Score: ans.interviewer1Score ?? ans.score ?? 0,
          interviewer2Score: ans.interviewer2Score ?? ans.score ?? 0,
          interviewer1Notes: ans.interviewer1Notes || '',
          interviewer2Notes: ans.interviewer2Notes || '',
          score: ans.score || 0,
          maxScore: ans.maxScore || 5,
          timestamp: ans.timestamp || now
        });
      }
    }

    // Cache locally
    localStorage.setItem(`aio_active_interview_${interview.candidateId}`, JSON.stringify(interview));
  } catch (error) {
    localStorage.setItem(`aio_active_interview_${interview.candidateId}`, JSON.stringify(interview));
    handleFirestoreError(error, OperationType.WRITE, interviewPath);
  }
}

export async function getInterviewById(interviewId: string): Promise<Interview | null> {
  const path = `interviews/${interviewId}`;
  try {
    const docSnap = await getDoc(doc(db, 'interviews', interviewId));
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    
    let answers: Record<number, InterviewAnswer> = data.answersData || {};
    
    return {
      id: docSnap.id,
      candidateId: data.candidateId || '',
      candidateName: data.candidateName || '',
      candidateEmail: data.candidateEmail || '',
      candidatePhone: data.candidatePhone || '',
      position: data.position || '',
      interviewDate: data.interviewDate || '',
      interviewerId: data.interviewerId || '',
      interviewerName: data.interviewerName || `${data.interviewer1Name || 'Supriya'} & ${data.interviewer2Name || 'Amit'}`,
      interviewer1Name: data.interviewer1Name || 'Supriya',
      interviewer2Name: data.interviewer2Name || 'Amit',
      isDualPanel: data.isDualPanel ?? true,
      startTime: data.startTime || '',
      endTime: data.endTime || '',
      durationSeconds: data.durationSeconds || 0,
      timeRemainingSeconds: data.timeRemainingSeconds ?? 600,
      currentQuestionIndex: data.currentQuestionIndex || 0,
      status: data.status || 'draft',
      answers,
      scoresSummary: data.scoresSummary,
      dualPanelSummary: data.dualPanelSummary,
      totalScore: data.totalScore || 0,
      interviewer1TotalScore: data.interviewer1TotalScore,
      interviewer2TotalScore: data.interviewer2TotalScore,
      maxScore: data.maxScore || 45,
      percentage: data.percentage || 0,
      interviewer1Recommendation: data.interviewer1Recommendation || '',
      interviewer2Recommendation: data.interviewer2Recommendation || '',
      recommendation: data.recommendation || '',
      recommendedPosition: data.recommendedPosition || '',
      strengths: data.strengths || '',
      weaknesses: data.weaknesses || '',
      redFlags: data.redFlags || '',
      additionalComments: data.additionalComments || '',
      createdAt: data.createdAt || '',
      updatedAt: data.updatedAt || '',
    };
  } catch (error) {
    return handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function getInterviews(): Promise<Interview[]> {
  const path = 'interviews';
  try {
    const snapshot = await getDocs(collection(db, 'interviews'));
    const interviews: Interview[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      interviews.push({
        id: docSnap.id,
        candidateId: data.candidateId || '',
        candidateName: data.candidateName || '',
        candidateEmail: data.candidateEmail || '',
        candidatePhone: data.candidatePhone || '',
        position: data.position || '',
        interviewDate: data.interviewDate || '',
        interviewerId: data.interviewerId || '',
        interviewerName: data.interviewerName || `${data.interviewer1Name || 'Supriya'} & ${data.interviewer2Name || 'Amit'}`,
        interviewer1Name: data.interviewer1Name || 'Supriya',
        interviewer2Name: data.interviewer2Name || 'Amit',
        isDualPanel: data.isDualPanel ?? true,
        startTime: data.startTime || '',
        endTime: data.endTime || '',
        durationSeconds: data.durationSeconds || 0,
        timeRemainingSeconds: data.timeRemainingSeconds ?? 600,
        currentQuestionIndex: data.currentQuestionIndex || 0,
        status: data.status || 'draft',
        answers: data.answersData || {},
        scoresSummary: data.scoresSummary,
        dualPanelSummary: data.dualPanelSummary,
        totalScore: data.totalScore || 0,
        interviewer1TotalScore: data.interviewer1TotalScore,
        interviewer2TotalScore: data.interviewer2TotalScore,
        maxScore: data.maxScore || 45,
        percentage: data.percentage || 0,
        interviewer1Recommendation: data.interviewer1Recommendation || '',
        interviewer2Recommendation: data.interviewer2Recommendation || '',
        recommendation: data.recommendation || '',
        recommendedPosition: data.recommendedPosition || '',
        strengths: data.strengths || '',
        weaknesses: data.weaknesses || '',
        redFlags: data.redFlags || '',
        additionalComments: data.additionalComments || '',
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
      });
    });
    return interviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function computeDashboardStats(candidates: Candidate[], interviews: Interview[]): DashboardStats {
  const totalCandidates = candidates.length;
  const completedInterviews = interviews.filter(i => i.status === 'completed').length;
  const pendingInterviews = candidates.filter(c => c.status !== 'completed').length;
  
  const completedList = interviews.filter(i => i.status === 'completed');
  const avgScore = completedList.length > 0 
    ? Math.round((completedList.reduce((acc, i) => acc + (i.percentage || 0), 0) / completedList.length) * 10) / 10 
    : 0;

  const recommendedCount = completedList.filter(i => i.recommendation === 'Recommended').length;
  const notRecommendedCount = completedList.filter(i => i.recommendation === 'Not Recommended').length;
  const secondRoundCount = completedList.filter(i => i.recommendation === 'Second Round / Further Evaluation').length;

  return {
    totalCandidates,
    completedInterviews,
    pendingInterviews,
    averageScore: avgScore,
    recommendedCount,
    notRecommendedCount,
    secondRoundCount
  };
}
