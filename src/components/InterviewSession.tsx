import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Candidate, Interview, InterviewAnswer, QuestionPreset } from '../types';
import { INTERVIEW_QUESTIONS, SCORE_DESCRIPTIONS } from '../data/interviewQuestions';
import { createOrUpdateInterviewDraft, calculateScoreSummary } from '../services/interviewService';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { playTimerBeep } from '../utils/audioAlert';
import { 
  Clock, 
  Play, 
  Pause, 
  CheckCircle2, 
  Mic, 
  MicOff, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  User, 
  Briefcase, 
  AlertTriangle, 
  Sparkles, 
  Timer, 
  MessageSquare, 
  CheckCheck,
  ChevronRight,
  RefreshCw,
  HelpCircle,
  Award,
  Zap,
  MousePointerClick,
  Check,
  Plus,
  Users,
  FastForward,
  SkipForward,
  Slash
} from 'lucide-react';

interface InterviewSessionProps {
  candidate: Candidate;
  existingInterview?: Interview | null;
  onProceedToOverall: (interviewData: Interview) => void;
  onCancel: () => void;
}

export const InterviewSession: React.FC<InterviewSessionProps> = ({
  candidate,
  existingInterview,
  onProceedToOverall,
  onCancel,
}) => {
  const interviewer1 = candidate.interviewer1Name || existingInterview?.interviewer1Name || 'Supriya';
  const interviewer2 = candidate.interviewer2Name || existingInterview?.interviewer2Name || 'Amit';

  // Current question index: 0 to 8 (9 questions)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    existingInterview?.currentQuestionIndex ?? 0
  );

  // Timer State (Default 10:00 = 600s)
  const [timeRemaining, setTimeRemaining] = useState<number>(
    existingInterview?.timeRemainingSeconds ?? 600
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [rolePlaySeconds, setRolePlaySeconds] = useState<number>(60);
  const [isRolePlayTimerRunning, setIsRolePlayTimerRunning] = useState<boolean>(false);

  // Answers Map with individual interviewer marks
  const [answers, setAnswers] = useState<Record<number, InterviewAnswer>>(() => {
    if (existingInterview?.answers && Object.keys(existingInterview.answers).length > 0) {
      return existingInterview.answers;
    }
    // Initialize default blank answers for all 9 questions
    const initialAnswers: Record<number, InterviewAnswer> = {};
    INTERVIEW_QUESTIONS.forEach(q => {
      initialAnswers[q.id] = {
        answerId: `ans_${candidate.id}_${q.id}`,
        interviewId: existingInterview?.id || `int_${candidate.id}`,
        candidateId: candidate.id,
        interviewerId: candidate.interviewerId,
        questionId: q.id,
        category: q.category,
        question: q.question,
        candidateAnswer: '',
        interviewerNotes: '',
        interviewer1Score: 0,
        interviewer2Score: 0,
        interviewer1Notes: '',
        interviewer2Notes: '',
        score: 0,
        maxScore: q.maxScore,
        timestamp: new Date().toISOString()
      };
    });
    return initialAnswers;
  });

  // Track skipped questions
  const [skippedQuestions, setSkippedQuestions] = useState<Record<number, boolean>>({});

  // Saving states
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const autoSaveTimeoutRef = useRef<any>(null);

  // Speech-to-Text
  const { isListening, isSupported, toggleListening, stopListening, errorMessage: speechError } = useSpeechToText();

  // Current Question Object
  const currentQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id] || {
    answerId: `ans_${candidate.id}_${currentQuestion.id}`,
    interviewId: existingInterview?.id || `int_${candidate.id}`,
    candidateId: candidate.id,
    interviewerId: candidate.interviewerId,
    questionId: currentQuestion.id,
    category: currentQuestion.category,
    question: currentQuestion.question,
    candidateAnswer: '',
    interviewerNotes: '',
    interviewer1Score: 0,
    interviewer2Score: 0,
    interviewer1Notes: '',
    interviewer2Notes: '',
    score: 0,
    maxScore: currentQuestion.maxScore,
    timestamp: new Date().toISOString()
  };

  // 10-Minute Main Timer Interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            playTimerBeep('completed');
            return 0;
          }
          if (prev === 121) {
            playTimerBeep('warning');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeRemaining]);

  // 60-second Role Play Timer Interval
  useEffect(() => {
    let rpInterval: any = null;
    if (isRolePlayTimerRunning && rolePlaySeconds > 0) {
      rpInterval = setInterval(() => {
        setRolePlaySeconds(prev => {
          if (prev <= 1) {
            setIsRolePlayTimerRunning(false);
            playTimerBeep('completed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (rpInterval) clearInterval(rpInterval);
    };
  }, [isRolePlayTimerRunning, rolePlaySeconds]);

  // Format Time Helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Build Interview Snapshot
  const buildCurrentInterviewState = useCallback((targetAnswers = answers, targetIndex = currentQuestionIndex): Interview => {
    const interviewId = existingInterview?.id || `int_${candidate.id}`;
    const scoreData = calculateScoreSummary(targetAnswers, interviewer1, interviewer2);

    return {
      id: interviewId,
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      candidateEmail: candidate.email,
      candidatePhone: candidate.phone,
      position: candidate.position,
      interviewDate: candidate.interviewDate,
      interviewerId: candidate.interviewerId,
      interviewerName: `${interviewer1} & ${interviewer2}`,
      interviewer1Name: interviewer1,
      interviewer2Name: interviewer2,
      isDualPanel: true,
      startTime: existingInterview?.startTime || new Date().toISOString(),
      endTime: existingInterview?.endTime,
      durationSeconds: 600 - timeRemaining,
      timeRemainingSeconds: timeRemaining,
      currentQuestionIndex: targetIndex,
      status: 'draft',
      answers: targetAnswers,
      scoresSummary: scoreData.summary,
      dualPanelSummary: scoreData.dualPanelSummary,
      totalScore: scoreData.totalScore,
      interviewer1TotalScore: scoreData.interviewer1Total,
      interviewer2TotalScore: scoreData.interviewer2Total,
      maxScore: scoreData.maxScore,
      percentage: scoreData.percentage,
      strengths: existingInterview?.strengths || '',
      weaknesses: existingInterview?.weaknesses || '',
      redFlags: existingInterview?.redFlags || '',
      additionalComments: existingInterview?.additionalComments || '',
      interviewer1Recommendation: existingInterview?.interviewer1Recommendation || '',
      interviewer2Recommendation: existingInterview?.interviewer2Recommendation || '',
      recommendation: existingInterview?.recommendation || '',
      recommendedPosition: existingInterview?.recommendedPosition || candidate.position,
      createdAt: existingInterview?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }, [answers, candidate, currentQuestionIndex, existingInterview, interviewer1, interviewer2, timeRemaining]);

  // Auto-save logic
  const triggerAutoSave = useCallback(async (updatedAnswers = answers, nextIndex = currentQuestionIndex) => {
    setSaveStatus('saving');
    try {
      const interviewState = buildCurrentInterviewState(updatedAnswers, nextIndex);
      await createOrUpdateInterviewDraft(interviewState);
      setSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.warn('Auto-save warning:', e);
      setSaveStatus('saved');
    }
  }, [answers, buildCurrentInterviewState, currentQuestionIndex]);

  // Handle Individual Score Updates for Supriya (1) or Amit (2)
  const handleIndividualScore = (interviewerNum: 1 | 2, scoreVal: number) => {
    const s1 = interviewerNum === 1 ? scoreVal : (currentAnswer.interviewer1Score || 0);
    const s2 = interviewerNum === 2 ? scoreVal : (currentAnswer.interviewer2Score || 0);
    
    let avg = 0;
    if (s1 > 0 && s2 > 0) {
      avg = Math.round(((s1 + s2) / 2) * 10) / 10;
    } else {
      avg = s1 > 0 ? s1 : s2;
    }

    // Unmark skipped if score selected
    setSkippedQuestions(prev => ({ ...prev, [currentQuestion.id]: false }));

    const updated: InterviewAnswer = {
      ...currentAnswer,
      interviewer1Score: s1,
      interviewer2Score: s2,
      score: avg,
      timestamp: new Date().toISOString()
    };

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: updated
    };

    setAnswers(newAnswers);
    triggerAutoSave(newAnswers, currentQuestionIndex);
  };

  // Skip Current Question Action
  const handleSkipQuestion = () => {
    if (isListening) stopListening();
    setSkippedQuestions(prev => ({ ...prev, [currentQuestion.id]: true }));

    // Advance to next question or review
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < INTERVIEW_QUESTIONS.length) {
      setCurrentQuestionIndex(nextIdx);
      triggerAutoSave(answers, nextIdx);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      triggerAutoSave(answers, currentQuestionIndex);
      const finalInterview = buildCurrentInterviewState(answers, currentQuestionIndex);
      onProceedToOverall(finalInterview);
    }
  };

  // Toggle Skipped / N/A Status
  const handleToggleSkipStatus = () => {
    const isNowSkipped = !skippedQuestions[currentQuestion.id];
    setSkippedQuestions(prev => ({ ...prev, [currentQuestion.id]: isNowSkipped }));
    if (isNowSkipped) {
      handleAnswerChange('interviewerNotes', (currentAnswer.interviewerNotes ? currentAnswer.interviewerNotes + ' ' : '') + '[Skipped by Panel]');
    }
  };

  // Handle Text Changes
  const handleAnswerChange = (field: 'candidateAnswer' | 'interviewerNotes' | 'interviewer1Notes' | 'interviewer2Notes', value: string) => {
    const updated: InterviewAnswer = {
      ...currentAnswer,
      [field]: value,
      timestamp: new Date().toISOString()
    };

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: updated
    };

    setAnswers(newAnswers);

    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    setSaveStatus('saving');
    autoSaveTimeoutRef.current = setTimeout(() => {
      triggerAutoSave(newAnswers, currentQuestionIndex);
    }, 800);
  };

  // 1-Click Preset
  const handleApplyPreset = (preset: QuestionPreset) => {
    setSkippedQuestions(prev => ({ ...prev, [currentQuestion.id]: false }));
    const updated: InterviewAnswer = {
      ...currentAnswer,
      candidateAnswer: preset.answerSummary,
      interviewerNotes: preset.interviewerNote,
      interviewer1Score: preset.score,
      interviewer2Score: preset.score,
      score: preset.score,
      timestamp: new Date().toISOString()
    };

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: updated
    };

    setAnswers(newAnswers);
    triggerAutoSave(newAnswers, currentQuestionIndex);
  };

  const handleToggleAnswerOption = (option: string) => {
    setSkippedQuestions(prev => ({ ...prev, [currentQuestion.id]: false }));
    const currentText = currentAnswer.candidateAnswer || '';
    let newText = '';
    
    if (currentText.includes(option)) {
      newText = currentText
        .split('\n')
        .filter(line => !line.includes(option))
        .join('\n')
        .trim();
    } else {
      newText = currentText 
        ? `${currentText}\n• ${option}`
        : `• ${option}`;
    }

    handleAnswerChange('candidateAnswer', newText);
  };

  const handleToggleNoteOption = (note: string) => {
    const currentText = currentAnswer.interviewerNotes || '';
    let newText = '';
    
    if (currentText.includes(note)) {
      newText = currentText
        .split('\n')
        .filter(line => !line.includes(note))
        .join('\n')
        .trim();
    } else {
      newText = currentText 
        ? `${currentText}\n• ${note}`
        : `• ${note}`;
    }

    handleAnswerChange('interviewerNotes', newText);
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      toggleListening((spokenText) => {
        handleAnswerChange('candidateAnswer', (currentAnswer.candidateAnswer ? currentAnswer.candidateAnswer + ' ' : '') + spokenText);
      });
    }
  };

  const handleNext = () => {
    if (isListening) stopListening();
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < INTERVIEW_QUESTIONS.length) {
      setCurrentQuestionIndex(nextIdx);
      triggerAutoSave(answers, nextIdx);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      triggerAutoSave(answers, currentQuestionIndex);
      const finalInterview = buildCurrentInterviewState(answers, currentQuestionIndex);
      onProceedToOverall(finalInterview);
    }
  };

  const handlePrevious = () => {
    if (isListening) stopListening();
    if (currentQuestionIndex > 0) {
      const prevIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIdx);
      triggerAutoSave(answers, prevIdx);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinishEarly = () => {
    if (isListening) stopListening();
    triggerAutoSave(answers, currentQuestionIndex);
    const finalInterview = buildCurrentInterviewState(answers, currentQuestionIndex);
    onProceedToOverall(finalInterview);
  };

  const liveScoreData = calculateScoreSummary(answers, interviewer1, interviewer2);
  const isCurrentSkipped = skippedQuestions[currentQuestion.id];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Top Candidate & Session Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Candidate Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-base flex-shrink-0">
              {candidate.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {candidate.fullName}
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {candidate.position}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  Panel: {interviewer1} &amp; {interviewer2}
                </span>
                <span>•</span>
                <span>Exp: <strong className="text-slate-700">{candidate.experience || 'N/A'}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Side: 10-Minute Countdown Timer & Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            {/* Timer Display */}
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2.5 transition-colors ${
              timeRemaining === 0
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : timeRemaining <= 120
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-slate-900 border-slate-800 text-white'
            }`}>
              <Clock className={`w-5 h-5 ${
                timeRemaining === 0 ? 'text-rose-600' : timeRemaining <= 120 ? 'text-amber-600' : 'text-blue-400'
              }`} />
              <div>
                <div className="font-mono font-bold text-lg sm:text-xl tracking-tight leading-none">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                  {timeRemaining === 0
                    ? 'TIME COMPLETED'
                    : timeRemaining <= 120
                    ? '02:00 Remaining'
                    : '10-Min Timer'}
                </div>
              </div>
            </div>

            {/* Timer Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current text-emerald-600" />}
              </button>

              <button
                type="button"
                onClick={handleFinishEarly}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer"
              >
                Go to Review →
              </button>
            </div>
          </div>
        </div>

        {/* Dual Interviewer Score Tally Pill */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-slate-700">
              Q{currentQuestionIndex + 1} of {INTERVIEW_QUESTIONS.length}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">✓ Saved</span>
                </>
              )}
            </span>
          </div>

          {/* Individual Marks Badges for Supriya & Amit */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-bold">
              {interviewer1}: {liveScoreData.interviewer1Total}/45
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold">
              {interviewer2}: {liveScoreData.interviewer2Total}/45
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-extrabold">
              Panel Avg: {liveScoreData.totalScore}/45 ({liveScoreData.percentage}%)
            </span>
          </div>
        </div>

        {/* Question Progress Dots (Showing Answered / Skipped / Current) */}
        <div className="grid grid-cols-9 gap-1 h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 mt-3">
          {INTERVIEW_QUESTIONS.map((q, idx) => {
            const isAnswered = (answers[q.id]?.interviewer1Score > 0) || (answers[q.id]?.interviewer2Score > 0) || (answers[q.id]?.score > 0);
            const isSkipped = skippedQuestions[q.id];
            const isCurrent = idx === currentQuestionIndex;
            
            return (
              <div
                key={q.id}
                onClick={() => {
                  setCurrentQuestionIndex(idx);
                  triggerAutoSave(answers, idx);
                }}
                title={`Q${q.id}: ${q.category} ${isSkipped ? '(Skipped)' : isAnswered ? '(Scored)' : '(Pending)'}`}
                className={`h-full rounded-full cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-blue-600 ring-2 ring-blue-400'
                    : isSkipped
                    ? 'bg-amber-400'
                    : isAnswered
                    ? 'bg-emerald-500'
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden mb-6">
        {/* Category Header */}
        <div className={`p-4 sm:p-5 border-b ${
          currentQuestion.isRolePlay 
            ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-200' 
            : 'bg-slate-50/80 border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider ${
                currentQuestion.isRolePlay
                  ? 'bg-amber-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                {currentQuestion.category}
              </span>
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                {currentQuestion.categoryTitle}
              </span>
            </div>

            {/* Quick Skip Button in Header */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSkipQuestion}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition-colors shadow-xs cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5 text-amber-600" />
                <span>Skip Question</span>
              </button>

              <div className="text-xs font-bold text-slate-600">
                Max Score: <span className="text-blue-700">/{currentQuestion.maxScore}</span>
              </div>
            </div>
          </div>

          {/* Role Play Special Instruction Box */}
          {currentQuestion.isRolePlay && (
            <div className="mt-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900 text-xs sm:text-sm">
              <div className="font-bold flex items-center gap-1.5 text-amber-800 mb-1">
                <Zap className="w-4 h-4 text-amber-600" />
                Interviewer Role-Play Guideline:
              </div>
              <p className="font-medium mb-2">{currentQuestion.instructions}</p>

              {/* 60-second role-play countdown trigger */}
              <div className="flex items-center gap-3 bg-white/80 p-2.5 rounded-lg border border-amber-200">
                <div className="font-mono font-bold text-base text-amber-800">
                  ⏱️ 60s Test: {rolePlaySeconds}s
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (isRolePlayTimerRunning) {
                      setIsRolePlayTimerRunning(false);
                    } else {
                      if (rolePlaySeconds === 0) setRolePlaySeconds(60);
                      setIsRolePlayTimerRunning(true);
                    }
                  }}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  {isRolePlayTimerRunning ? 'Pause 60s' : 'Start 60s Timer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRolePlayTimerRunning(false);
                    setRolePlaySeconds(60);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Reset 60s
                </button>
              </div>
            </div>
          )}

          {/* Prominent Question Text */}
          <div className="mt-3">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQuestion.question}
            </h3>
            {currentQuestion.followUp && (
              <p className="mt-2 text-sm font-semibold text-blue-700 bg-blue-50/80 p-2 rounded-lg border border-blue-100">
                Follow-up: {currentQuestion.followUp}
              </p>
            )}
          </div>

          {/* 1-TAP RAPID EVALUATION PRESETS */}
          {currentQuestion.quickPresets && currentQuestion.quickPresets.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200/80">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <MousePointerClick className="w-3.5 h-3.5 text-blue-600" />
                <span>1-Tap Evaluation Presets (Scores both {interviewer1} &amp; {interviewer2}):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {currentQuestion.quickPresets.map((preset, pIdx) => {
                  const isCurrentPreset = currentAnswer.score === preset.score && currentAnswer.candidateAnswer === preset.answerSummary;
                  return (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                        isCurrentPreset
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                          : preset.score >= 4
                          ? 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-200 text-emerald-900'
                          : preset.score === 3
                          ? 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-200 text-amber-900'
                          : 'bg-rose-50/80 hover:bg-rose-100/80 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{preset.label}</span>
                        {isCurrentPreset && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <p className={`text-[10px] line-clamp-2 ${isCurrentPreset ? 'text-blue-100' : 'text-slate-600'}`}>
                        {preset.answerSummary}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Input Fields & Dual Scores */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Candidate Answer Section with Click-to-Select Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                Candidate Answer / Key Points (Optional)
              </label>

              {isSupported && (
                <button
                  type="button"
                  onClick={handleMicToggle}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/20'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-blue-600" />}
                  <span>{isListening ? 'Listening...' : 'Dictation'}</span>
                </button>
              )}
            </div>

            {/* Click-to-Select Answer Option Chips */}
            <div className="mb-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                <MousePointerClick className="w-3 h-3 text-blue-600" />
                <span>Click to select answer points (Optional):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentQuestion.suggestedAnswerOptions.map((opt, oIdx) => {
                  const isSelected = currentAnswer.candidateAnswer?.includes(opt);
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleToggleAnswerOption(opt)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-medium'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3 flex-shrink-0" /> : <Plus className="w-3 h-3 flex-shrink-0 text-slate-400" />}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <textarea
              rows={3}
              value={currentAnswer.candidateAnswer}
              onChange={(e) => handleAnswerChange('candidateAnswer', e.target.value)}
              placeholder="Click options above or type/dictate (Optional)..."
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* DUAL INTERVIEWER INDIVIDUAL MARKS SELECTION (SUPRIYA & AMIT) */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Evaluator Marks Selection (Optional)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isCurrentSkipped && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                    Skipped / N/A
                  </span>
                )}
                <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  Question Score: <strong className="text-blue-700 font-extrabold">{currentAnswer.score || 0}/5</strong>
                </span>
              </div>
            </div>

            {/* Row 1: Interviewer 1 (Supriya) Marks */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    {interviewer1}'s Mark:
                  </span>
                  <span className="text-xs font-extrabold text-blue-700">
                    {currentAnswer.interviewer1Score ? `${currentAnswer.interviewer1Score}/5` : 'Optional'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">1=Poor, 5=Excellent</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {SCORE_DESCRIPTIONS.map((s) => {
                  const isSelected = (currentAnswer.interviewer1Score || 0) === s.score;
                  return (
                    <button
                      key={s.score}
                      type="button"
                      onClick={() => handleIndividualScore(1, s.score)}
                      className={`py-2 px-1 rounded-xl font-bold text-center border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
                          : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="text-sm sm:text-base leading-none">{s.score}</span>
                      <span className="text-[9px] sm:text-[10px] font-semibold leading-tight opacity-90">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Interviewer 2 (Amit) Marks */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center">
                    2
                  </span>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    {interviewer2}'s Mark:
                  </span>
                  <span className="text-xs font-extrabold text-indigo-700">
                    {currentAnswer.interviewer2Score ? `${currentAnswer.interviewer2Score}/5` : 'Optional'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">1=Poor, 5=Excellent</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {SCORE_DESCRIPTIONS.map((s) => {
                  const isSelected = (currentAnswer.interviewer2Score || 0) === s.score;
                  return (
                    <button
                      key={s.score}
                      type="button"
                      onClick={() => handleIndividualScore(2, s.score)}
                      className={`py-2 px-1 rounded-xl font-bold text-center border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-102'
                          : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="text-sm sm:text-base leading-none">{s.score}</span>
                      <span className="text-[9px] sm:text-[10px] font-semibold leading-tight opacity-90">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interviewer Notes with Observation Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Panel Observation Notes (Optional)
              </label>
            </div>

            <div className="mb-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                <MousePointerClick className="w-3 h-3 text-blue-600" />
                <span>Click to add Quick Observation Note:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentQuestion.suggestedObservationNotes.map((note, nIdx) => {
                  const isSelected = currentAnswer.interviewerNotes?.includes(note);
                  return (
                    <button
                      key={nIdx}
                      type="button"
                      onClick={() => handleToggleNoteOption(note)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-medium'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3 flex-shrink-0" /> : <Plus className="w-3 h-3 flex-shrink-0 text-slate-400" />}
                      <span>{note}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <textarea
              rows={2}
              value={currentAnswer.interviewerNotes}
              onChange={(e) => handleAnswerChange('interviewerNotes', e.target.value)}
              placeholder="Click chips above or write notes (Optional)..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Footer Navigation Bar with Skip Question Button */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={handlePrevious}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous Question</span>
              <span className="sm:hidden">Prev</span>
            </button>

            {/* Prominent Skip Question Button */}
            <button
              type="button"
              onClick={handleSkipQuestion}
              className="px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <SkipForward className="w-4 h-4 text-amber-700" />
              <span>Skip Question ⏭</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFinishEarly}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Finish &amp; Review →
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>
                {currentQuestionIndex === INTERVIEW_QUESTIONS.length - 1
                  ? 'Review & Overall Evaluation →'
                  : 'Next Question →'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
