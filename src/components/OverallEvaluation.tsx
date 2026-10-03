import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Candidate, Interview, RecommendationType } from '../types';
import { POSITIONS_LIST, OVERALL_REVIEW_PRESETS } from '../data/interviewQuestions';
import { createOrUpdateInterviewDraft, calculateScoreSummary } from '../services/interviewService';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowLeft, 
  Send, 
  FileText, 
  PlusCircle, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle,
  Briefcase,
  Layers,
  ArrowRight,
  MousePointerClick,
  Check,
  Plus,
  Users
} from 'lucide-react';

interface OverallEvaluationProps {
  candidate: Candidate;
  interview: Interview;
  onBackToQuestions: () => void;
  onViewReport: (interviewId: string) => void;
  onNewInterview: () => void;
  onViewRecords: () => void;
}

export const OverallEvaluation: React.FC<OverallEvaluationProps> = ({
  candidate,
  interview,
  onBackToQuestions,
  onViewReport,
  onNewInterview,
  onViewRecords
}) => {
  const interviewer1 = candidate.interviewer1Name || interview.interviewer1Name || 'Supriya';
  const interviewer2 = candidate.interviewer2Name || interview.interviewer2Name || 'Amit';

  const scoreData = calculateScoreSummary(interview.answers, interviewer1, interviewer2);
  
  const [strengths, setStrengths] = useState(interview.strengths || '');
  const [weaknesses, setWeaknesses] = useState(interview.weaknesses || '');
  const [redFlags, setRedFlags] = useState(interview.redFlags || '');
  const [additionalComments, setAdditionalComments] = useState(interview.additionalComments || '');
  
  // Individual & Combined Recommendations
  const [int1Rec, setInt1Rec] = useState<RecommendationType>(
    interview.interviewer1Recommendation || (scoreData.interviewer1Total >= 34 ? 'Recommended' : scoreData.interviewer1Total >= 27 ? 'Second Round / Further Evaluation' : 'Not Recommended')
  );
  const [int2Rec, setInt2Rec] = useState<RecommendationType>(
    interview.interviewer2Recommendation || (scoreData.interviewer2Total >= 34 ? 'Recommended' : scoreData.interviewer2Total >= 27 ? 'Second Round / Further Evaluation' : 'Not Recommended')
  );
  const [consensusRec, setConsensusRec] = useState<RecommendationType>(
    interview.recommendation || (scoreData.percentage >= 75 ? 'Recommended' : scoreData.percentage >= 60 ? 'Second Round / Further Evaluation' : 'Not Recommended')
  );
  
  const [recommendedPosition, setRecommendedPosition] = useState(
    interview.recommendedPosition || candidate.position
  );

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(interview.status === 'completed');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleOptionInField = (
    currentText: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    optionText: string
  ) => {
    if (currentText.includes(optionText)) {
      const filtered = currentText
        .split('\n')
        .filter(line => !line.includes(optionText))
        .join('\n')
        .trim();
      setter(filtered);
    } else {
      setter(currentText ? `${currentText}\n• ${optionText}` : `• ${optionText}`);
    }
  };

  const handleOpenConfirm = () => {
    if (!consensusRec) {
      setConsensusRec('Recommended');
    }
    setError(null);
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);
    const finalRec = consensusRec || 'Recommended';

    const completedInterview: Interview = {
      ...interview,
      interviewer1Name: interviewer1,
      interviewer2Name: interviewer2,
      endTime: new Date().toISOString(),
      status: 'completed',
      scoresSummary: scoreData.summary,
      dualPanelSummary: scoreData.dualPanelSummary,
      totalScore: scoreData.totalScore,
      interviewer1TotalScore: scoreData.interviewer1Total,
      interviewer2TotalScore: scoreData.interviewer2Total,
      maxScore: scoreData.maxScore,
      percentage: scoreData.percentage,
      strengths: strengths.trim(),
      weaknesses: weaknesses.trim(),
      redFlags: redFlags.trim(),
      additionalComments: additionalComments.trim(),
      interviewer1Recommendation: int1Rec || 'Recommended',
      interviewer2Recommendation: int2Rec || 'Recommended',
      recommendation: finalRec,
      recommendedPosition: recommendedPosition || candidate.position || 'Admission Counsellor',
      updatedAt: new Date().toISOString()
    };

    try {
      await createOrUpdateInterviewDraft(completedInterview);
      setIsSubmitted(true);
      setShowConfirmModal(false);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } catch (err: any) {
      console.error('Final submit error:', err);
      setError(err.message || 'Failed to submit evaluation to Firebase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Completion View
  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-center shadow-lg">
          <div className="w-20 h-20 bg-emerald-100 border-4 border-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            PANEL EVALUATION ARCHIVED TO FIREBASE
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Interview Successfully Saved
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Candidate evaluation with individual scores from <strong>{interviewer1}</strong> &amp; <strong>{interviewer2}</strong> has been secured.
          </p>

          {/* Candidate Summary Card with Dual Evaluator Scores */}
          <div className="my-6 bg-slate-50 border border-slate-200/90 rounded-2xl p-5 text-left max-w-lg mx-auto space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-bold">Candidate</span>
                <span className="font-bold text-slate-900">{candidate.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-bold">Position</span>
                <span className="font-semibold text-slate-800">{recommendedPosition}</span>
              </div>
            </div>

            {/* Individual Marks Tally */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase block">{interviewer1}'s Mark</span>
                <span className="font-black text-slate-900 text-base">{scoreData.interviewer1Total}/45</span>
                <span className="text-[10px] text-slate-500 block">({scoreData.dualPanelSummary.interviewer1Percentage}%)</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase block">{interviewer2}'s Mark</span>
                <span className="font-black text-slate-900 text-base">{scoreData.interviewer2Total}/45</span>
                <span className="text-[10px] text-slate-500 block">({scoreData.dualPanelSummary.interviewer2Percentage}%)</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Combined Score</span>
                <span className="font-black text-emerald-700 text-base">{scoreData.totalScore}/45</span>
                <span className="text-[10px] text-emerald-600 block">({scoreData.percentage}%)</span>
              </div>
            </div>

            <div className="pt-2 text-xs">
              <span className="text-slate-400 block text-[11px] uppercase font-bold">Final Consensus Recommendation</span>
              <span className="font-bold text-slate-900 text-sm">{consensusRec}</span>
            </div>
            
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400 font-mono">
              Record ID: {interview.id}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onViewReport(interview.id)}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View Full Dual Report</span>
            </button>

            <button
              onClick={onNewInterview}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Interview</span>
            </button>

            <button
              onClick={onViewRecords}
              className="w-full sm:w-auto px-5 py-3 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Candidate Records</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBackToQuestions}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Questions</span>
        </button>

        <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
          Panel: {interviewer1} &amp; {interviewer2} • {candidate.fullName}
        </span>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
          <div>
            <p className="font-semibold">Attention Required</p>
            <p className="text-xs text-rose-600">{error}</p>
          </div>
        </div>
      )}

      {/* 1. Score Summary Breakdown with Supriya vs Amit Individual Marks */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
              DUAL EVALUATOR PANEL SUMMARY
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              Score Summary: {interviewer1} vs {interviewer2}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Supriya Card */}
            <div className="bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block">{interviewer1}</span>
              <span className="text-xl font-black text-slate-900 font-mono">{scoreData.interviewer1Total}/45</span>
              <span className="text-[10px] text-blue-600 font-bold block">{scoreData.dualPanelSummary.interviewer1Percentage}%</span>
            </div>

            {/* Amit Card */}
            <div className="bg-indigo-50 border border-indigo-200 px-4 py-2.5 rounded-xl text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 block">{interviewer2}</span>
              <span className="text-xl font-black text-slate-900 font-mono">{scoreData.interviewer2Total}/45</span>
              <span className="text-[10px] text-indigo-600 font-bold block">{scoreData.dualPanelSummary.interviewer2Percentage}%</span>
            </div>

            {/* Combined Card */}
            <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-center shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">Combined</span>
              <span className="text-xl font-black font-mono">{scoreData.totalScore}/45</span>
              <span className="text-[10px] text-emerald-400 font-bold block">{scoreData.percentage}%</span>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">Marketing</span>
            <div className="text-base font-bold text-slate-900 mt-1">
              {scoreData.summary.marketing} <span className="text-xs font-normal text-slate-500">/5</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {interviewer1}: {scoreData.int1Summary.marketing} • {interviewer2}: {scoreData.int2Summary.marketing}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">Counselling</span>
            <div className="text-base font-bold text-slate-900 mt-1">
              {scoreData.summary.counselling} <span className="text-xs font-normal text-slate-500">/5</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {interviewer1}: {scoreData.int1Summary.counselling} • {interviewer2}: {scoreData.int2Summary.counselling}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">Sales Pitch</span>
            <div className="text-base font-bold text-slate-900 mt-1">
              {scoreData.summary.sales} <span className="text-xs font-normal text-slate-500">/5</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {interviewer1}: {scoreData.int1Summary.sales} • {interviewer2}: {scoreData.int2Summary.sales}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">Learning Speed</span>
            <div className="text-base font-bold text-slate-900 mt-1">
              {scoreData.summary.learning} <span className="text-xs font-normal text-slate-500">/5</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {interviewer1}: {scoreData.int1Summary.learning} • {interviewer2}: {scoreData.int2Summary.learning}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">Stability & Trust</span>
            <div className="text-base font-bold text-slate-900 mt-1">
              {scoreData.summary.stability} <span className="text-xs font-normal text-slate-500">/10</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {interviewer1}: {scoreData.int1Summary.stability} • {interviewer2}: {scoreData.int2Summary.stability}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">Pressure Sprint</span>
            <div className="text-base font-bold text-slate-900 mt-1">
              {scoreData.summary.pressure} <span className="text-xs font-normal text-slate-500">/5</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {interviewer1}: {scoreData.int1Summary.pressure} • {interviewer2}: {scoreData.int2Summary.pressure}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">Attitude & Acct.</span>
            <div className="text-base font-bold text-slate-900 mt-1">
              {scoreData.summary.attitude} <span className="text-xs font-normal text-slate-500">/5</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {interviewer1}: {scoreData.int1Summary.attitude} • {interviewer2}: {scoreData.int2Summary.attitude}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
            <span className="text-[11px] font-bold text-amber-800 uppercase block truncate">Live 60s Role-Play</span>
            <div className="text-base font-bold text-amber-900 mt-1">
              {scoreData.summary.roleplay} <span className="text-xs font-normal text-amber-700">/5</span>
            </div>
            <div className="text-[10px] text-amber-700 mt-0.5">
              {interviewer1}: {scoreData.int1Summary.roleplay} • {interviewer2}: {scoreData.int2Summary.roleplay}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Qualitative Observations with Click-to-Select Chips */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Panel Qualitative Review
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any option chip below to instantly add observations from {interviewer1} &amp; {interviewer2}.
          </p>
        </div>

        {/* Strengths */}
        <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
            <ThumbsUp className="w-4 h-4 text-emerald-600" />
            Candidate Strengths
          </label>
          
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {OVERALL_REVIEW_PRESETS.strengths.map((st, sIdx) => {
              const isSelected = strengths.includes(st);
              return (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => toggleOptionInField(strengths, setStrengths, st)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-medium'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                  }`}
                >
                  {isSelected ? <Check className="w-3 h-3 flex-shrink-0" /> : <Plus className="w-3 h-3 flex-shrink-0 text-slate-400" />}
                  <span>{st}</span>
                </button>
              );
            })}
          </div>

          <textarea
            rows={2}
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            placeholder="Click chips above or write strengths..."
            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Weaknesses */}
        <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
            <ThumbsDown className="w-4 h-4 text-amber-600" />
            Candidate Weaknesses
          </label>

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {OVERALL_REVIEW_PRESETS.weaknesses.map((wk, wIdx) => {
              const isSelected = weaknesses.includes(wk);
              return (
                <button
                  key={wIdx}
                  type="button"
                  onClick={() => toggleOptionInField(weaknesses, setWeaknesses, wk)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs font-medium'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                  }`}
                >
                  {isSelected ? <Check className="w-3 h-3 flex-shrink-0" /> : <Plus className="w-3 h-3 flex-shrink-0 text-slate-400" />}
                  <span>{wk}</span>
                </button>
              );
            })}
          </div>

          <textarea
            rows={2}
            value={weaknesses}
            onChange={(e) => setWeaknesses(e.target.value)}
            placeholder="Click chips above or write weaknesses..."
            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>

        {/* Red Flags */}
        <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-rose-800 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Red Flags
          </label>

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {OVERALL_REVIEW_PRESETS.redFlags.map((rf, rIdx) => {
              const isSelected = redFlags.includes(rf);
              return (
                <button
                  key={rIdx}
                  type="button"
                  onClick={() => toggleOptionInField(redFlags, setRedFlags, rf)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs font-medium'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50 hover:border-rose-300'
                  }`}
                >
                  {isSelected ? <Check className="w-3 h-3 flex-shrink-0" /> : <Plus className="w-3 h-3 flex-shrink-0 text-slate-400" />}
                  <span>{rf}</span>
                </button>
              );
            })}
          </div>

          <textarea
            rows={2}
            value={redFlags}
            onChange={(e) => setRedFlags(e.target.value)}
            placeholder="Click chips above or write red flags..."
            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
          />
        </div>

        {/* Additional Comments */}
        <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Additional Comments
          </label>

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {OVERALL_REVIEW_PRESETS.additionalComments.map((cm, cIdx) => {
              const isSelected = additionalComments.includes(cm);
              return (
                <button
                  key={cIdx}
                  type="button"
                  onClick={() => toggleOptionInField(additionalComments, setAdditionalComments, cm)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-medium'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  {isSelected ? <Check className="w-3 h-3 flex-shrink-0" /> : <Plus className="w-3 h-3 flex-shrink-0 text-slate-400" />}
                  <span>{cm}</span>
                </button>
              );
            })}
          </div>

          <textarea
            rows={2}
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            placeholder="Click chips above or add comments..."
            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* 3. Dual Evaluator Individual Decisions & Final Consensus */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Evaluator Recommendations &amp; Consensus
            </h3>
            <p className="text-xs text-slate-500">
              Select recommendations for both {interviewer1} &amp; {interviewer2}, then confirm final consensus.
            </p>
          </div>
        </div>

        {/* Individual Decisions Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Supriya's Decision */}
          <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200">
            <span className="text-xs font-extrabold uppercase tracking-wide text-blue-800 block mb-2">
              {interviewer1}'s Decision:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Recommended', 'Second Round / Further Evaluation', 'Not Recommended'] as RecommendationType[]).map((rec) => (
                <button
                  key={rec}
                  type="button"
                  onClick={() => setInt1Rec(rec)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    int1Rec === rec
                      ? rec === 'Recommended' ? 'bg-emerald-600 text-white border-emerald-600' : rec === 'Not Recommended' ? 'bg-rose-600 text-white border-rose-600' : 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {rec === 'Recommended' ? '🟢 Pass' : rec === 'Not Recommended' ? '🔴 Reject' : '🟡 2nd Round'}
                </button>
              ))}
            </div>
          </div>

          {/* Amit's Decision */}
          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200">
            <span className="text-xs font-extrabold uppercase tracking-wide text-indigo-800 block mb-2">
              {interviewer2}'s Decision:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Recommended', 'Second Round / Further Evaluation', 'Not Recommended'] as RecommendationType[]).map((rec) => (
                <button
                  key={rec}
                  type="button"
                  onClick={() => setInt2Rec(rec)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    int2Rec === rec
                      ? rec === 'Recommended' ? 'bg-emerald-600 text-white border-emerald-600' : rec === 'Not Recommended' ? 'bg-rose-600 text-white border-rose-600' : 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {rec === 'Recommended' ? '🟢 Pass' : rec === 'Not Recommended' ? '🔴 Reject' : '🟡 2nd Round'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Final Consensus Recommendation Cards */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
            Final Panel Consensus Decision <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setConsensusRec('Recommended')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                consensusRec === 'Recommended'
                  ? 'bg-emerald-50/90 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🟢</span>
                {consensusRec === 'Recommended' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </div>
              <div className="font-extrabold text-emerald-900 text-sm">Recommended</div>
            </button>

            <button
              type="button"
              onClick={() => setConsensusRec('Second Round / Further Evaluation')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                consensusRec === 'Second Round / Further Evaluation'
                  ? 'bg-amber-50/90 border-amber-600 shadow-md ring-2 ring-amber-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🟡</span>
                {consensusRec === 'Second Round / Further Evaluation' && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
              </div>
              <div className="font-extrabold text-amber-900 text-sm">Second Round / Further Evaluation</div>
            </button>

            <button
              type="button"
              onClick={() => setConsensusRec('Not Recommended')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                consensusRec === 'Not Recommended'
                  ? 'bg-rose-50/90 border-rose-600 shadow-md ring-2 ring-rose-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🔴</span>
                {consensusRec === 'Not Recommended' && <XCircle className="w-5 h-5 text-rose-600" />}
              </div>
              <div className="font-extrabold text-rose-900 text-sm">Not Recommended</div>
            </button>
          </div>
        </div>

        {/* Recommended Position Selection */}
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-blue-600" />
            Recommended Position
          </label>
          <select
            value={recommendedPosition}
            onChange={(e) => setRecommendedPosition(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {POSITIONS_LIST.map((pos) => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Final Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-2xl shadow-md">
        <div>
          <span className="text-xs text-slate-400 block">
            {interviewer1}: {scoreData.interviewer1Total}/45 • {interviewer2}: {scoreData.interviewer2Total}/45
          </span>
          <span className="text-lg font-bold text-white">
            Panel Score: {scoreData.totalScore}/45 ({scoreData.percentage}%) • {consensusRec || 'Consensus Pending'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleOpenConfirm}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Send className="w-5 h-5" />
          <span>Submit Evaluation</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              Submit Dual Panel Evaluation?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Confirm individual marks from <strong>{interviewer1}</strong> &amp; <strong>{interviewer2}</strong> before archiving to Firebase.
            </p>

            <div className="my-5 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate:</span>
                <span className="font-bold text-slate-900">{candidate.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{interviewer1}'s Mark:</span>
                <span className="font-bold text-blue-700">{scoreData.interviewer1Total}/45 ({scoreData.dualPanelSummary.interviewer1Percentage}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{interviewer2}'s Mark:</span>
                <span className="font-bold text-indigo-700">{scoreData.interviewer2Total}/45 ({scoreData.dualPanelSummary.interviewer2Percentage}%)</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-700 font-bold">Panel Average:</span>
                <span className="font-extrabold text-slate-900">{scoreData.totalScore}/45 ({scoreData.percentage}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Consensus:</span>
                <span className="font-bold text-emerald-700">{consensusRec}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ← Go Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleFinalSubmit}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>Submit Evaluation</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
