import React, { useEffect, useState } from 'react';
import { Interview, Candidate } from '../types';
import { INTERVIEW_QUESTIONS } from '../data/interviewQuestions';
import { getInterviewById, calculateScoreSummary } from '../services/interviewService';
import { 
  Printer, 
  ArrowLeft, 
  GraduationCap, 
  Calendar, 
  User, 
  Briefcase, 
  Mail, 
  Phone, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Building,
  ShieldCheck,
  FileCheck,
  Users
} from 'lucide-react';

interface InterviewReportProps {
  interviewId: string;
  onBack: () => void;
}

export const InterviewReport: React.FC<InterviewReportProps> = ({ interviewId, onBack }) => {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchReport() {
      try {
        setLoading(true);
        const data = await getInterviewById(interviewId);
        if (isMounted) {
          setInterview(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load candidate interview report.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchReport();
    return () => { isMounted = false; };
  }, [interviewId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Generating Official Candidate Evaluation Report...</p>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800">
          <p className="font-bold text-lg">Report Not Found</p>
          <p className="text-xs text-rose-600 mt-1">{error || 'Unable to retrieve the requested interview record.'}</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            ← Back to Records
          </button>
        </div>
      </div>
    );
  }

  const int1 = interview.interviewer1Name || 'Supriya';
  const int2 = interview.interviewer2Name || 'Amit';
  const scoreData = calculateScoreSummary(interview.answers || {}, int1, int2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 print:p-0 print:m-0 print:max-w-full">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Records</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Official Report Document */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-10 print:border-none print:shadow-none print:p-0">
        {/* Header Letterhead */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  ALL IN ONE ACADEMY
                </h1>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-700">
                  Dual Evaluator Candidate Interview Report
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500">
              <div className="font-mono font-semibold text-slate-800">Doc ID: {interview.id}</div>
              <div>Date Generated: {new Date().toLocaleDateString()}</div>
              <div className="text-emerald-700 font-bold flex items-center sm:justify-end gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Panel Record
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Metadata Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-bold">Candidate</span>
              <span className="font-bold text-slate-900 text-base">{interview.candidateName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-bold">Position Applied</span>
              <span className="font-semibold text-slate-800">{interview.position}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-bold">Interview Date</span>
              <span className="font-semibold text-slate-800">{interview.interviewDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-bold">Panel Evaluators</span>
              <span className="font-bold text-blue-700">{int1} &amp; {int2}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Email</span>
              <span className="font-medium text-slate-800">{interview.candidateEmail}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
              <span className="font-medium text-slate-800">{interview.candidatePhone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
              <span className="font-medium text-slate-800">{Math.round(interview.durationSeconds / 60)} minutes</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Role</span>
              <span className="font-medium text-blue-700 font-bold">{interview.recommendedPosition || interview.position}</span>
            </div>
          </div>
        </div>

        {/* DUAL EVALUATOR SCORE SUMMARY CARD */}
        <div className="mb-8">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Score Summary Breakdown ({int1} &amp; {int2})
            </span>
            <span className="text-blue-700 font-bold">
              Panel Combined: {scoreData.totalScore}/45 ({scoreData.percentage}%)
            </span>
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-center">
              <span className="text-[11px] font-bold text-blue-700 uppercase block">{int1}'s Total Score</span>
              <span className="text-xl font-black text-slate-900">{scoreData.interviewer1Total}/45</span>
              <span className="text-xs font-semibold text-blue-600 block">{scoreData.dualPanelSummary.interviewer1Percentage}%</span>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl text-center">
              <span className="text-[11px] font-bold text-indigo-700 uppercase block">{int2}'s Total Score</span>
              <span className="text-xl font-black text-slate-900">{scoreData.interviewer2Total}/45</span>
              <span className="text-xs font-semibold text-indigo-600 block">{scoreData.dualPanelSummary.interviewer2Percentage}%</span>
            </div>

            <div className="bg-slate-900 text-white p-3 rounded-xl text-center">
              <span className="text-[11px] font-bold text-blue-300 uppercase block">Combined Panel Average</span>
              <span className="text-xl font-black">{scoreData.totalScore}/45</span>
              <span className="text-xs font-bold text-emerald-400 block">{scoreData.percentage}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Marketing</span>
              <span className="font-extrabold text-slate-900 text-sm">{scoreData.summary.marketing}/5</span>
              <span className="text-[10px] text-slate-400 block">{int1}: {scoreData.int1Summary.marketing} • {int2}: {scoreData.int2Summary.marketing}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Counselling</span>
              <span className="font-extrabold text-slate-900 text-sm">{scoreData.summary.counselling}/5</span>
              <span className="text-[10px] text-slate-400 block">{int1}: {scoreData.int1Summary.counselling} • {int2}: {scoreData.int2Summary.counselling}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Sales Pitch</span>
              <span className="font-extrabold text-slate-900 text-sm">{scoreData.summary.sales}/5</span>
              <span className="text-[10px] text-slate-400 block">{int1}: {scoreData.int1Summary.sales} • {int2}: {scoreData.int2Summary.sales}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Learning Speed</span>
              <span className="font-extrabold text-slate-900 text-sm">{scoreData.summary.learning}/5</span>
              <span className="text-[10px] text-slate-400 block">{int1}: {scoreData.int1Summary.learning} • {int2}: {scoreData.int2Summary.learning}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Stability & Trust</span>
              <span className="font-extrabold text-slate-900 text-sm">{scoreData.summary.stability}/10</span>
              <span className="text-[10px] text-slate-400 block">{int1}: {scoreData.int1Summary.stability} • {int2}: {scoreData.int2Summary.stability}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Pressure Sprint</span>
              <span className="font-extrabold text-slate-900 text-sm">{scoreData.summary.pressure}/5</span>
              <span className="text-[10px] text-slate-400 block">{int1}: {scoreData.int1Summary.pressure} • {int2}: {scoreData.int2Summary.pressure}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Attitude & Acct.</span>
              <span className="font-extrabold text-slate-900 text-sm">{scoreData.summary.attitude}/5</span>
              <span className="text-[10px] text-slate-400 block">{int1}: {scoreData.int1Summary.attitude} • {int2}: {scoreData.int2Summary.attitude}</span>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Live 60s Role-Play</span>
              <span className="font-extrabold text-amber-900 text-sm">{scoreData.summary.roleplay}/5</span>
              <span className="text-[10px] text-amber-700 block">{int1}: {scoreData.int1Summary.roleplay} • {int2}: {scoreData.int2Summary.roleplay}</span>
            </div>
          </div>
        </div>

        {/* Complete Questions Transcript with Supriya & Amit Individual Marks */}
        <div className="mb-8 space-y-5">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-600" />
            Detailed Question Responses & Panel Marks
          </h2>

          {INTERVIEW_QUESTIONS.map((q) => {
            const ans = interview.answers?.[q.id];
            const s1 = ans?.interviewer1Score ?? ans?.score ?? 0;
            const s2 = ans?.interviewer2Score ?? ans?.score ?? 0;
            const avg = ans?.score ?? ((s1 + s2) / 2 || 0);

            return (
              <div 
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 text-xs sm:text-sm space-y-3 break-inside-avoid"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                        Q{q.id}: {q.category}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900">{q.question}</p>
                    {q.followUp && (
                      <p className="text-xs text-blue-700 mt-1 font-medium">Follow-up: {q.followUp}</p>
                    )}
                  </div>

                  {/* Individual Marks Badges */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                        {int1}: {s1}/5
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                        {int2}: {s2}/5
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      Avg: {avg}/{q.maxScore}
                    </span>
                  </div>
                </div>

                {/* Candidate Answer */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Candidate's Recorded Answer
                  </span>
                  <p className="text-slate-800 whitespace-pre-wrap">
                    {ans?.candidateAnswer ? ans.candidateAnswer : <span className="italic text-slate-400">No answer recorded</span>}
                  </p>
                </div>

                {/* Notes */}
                {ans?.interviewerNotes && (
                  <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block mb-0.5">
                      Panel Observation Note
                    </span>
                    <p className="text-slate-700 text-xs">{ans.interviewerNotes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Qualitative Observations & Recommendation */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6 space-y-4 break-inside-avoid">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200">
            Qualitative Observations & Final Panel Decision
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-emerald-800 font-bold block mb-1">Candidate Strengths:</span>
              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200 whitespace-pre-wrap">
                {interview.strengths || 'None specified'}
              </p>
            </div>

            <div>
              <span className="text-amber-800 font-bold block mb-1">Candidate Weaknesses:</span>
              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200 whitespace-pre-wrap">
                {interview.weaknesses || 'None specified'}
              </p>
            </div>

            <div>
              <span className="text-rose-800 font-bold block mb-1">Red Flags:</span>
              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200 whitespace-pre-wrap">
                {interview.redFlags || 'None observed'}
              </p>
            </div>

            <div>
              <span className="text-slate-700 font-bold block mb-1">Additional Comments:</span>
              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200 whitespace-pre-wrap">
                {interview.additionalComments || 'None'}
              </p>
            </div>
          </div>

          {/* Final Recommendation Banner with Dual Signatures */}
          <div className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 ${
            interview.recommendation === 'Recommended'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
              : interview.recommendation === 'Not Recommended'
              ? 'bg-rose-50 border-rose-500 text-rose-900'
              : 'bg-amber-50 border-amber-500 text-amber-900'
          }`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-80 block">
                Official Consensus Recommendation
              </span>
              <div className="text-xl sm:text-2xl font-black mt-0.5">
                {interview.recommendation === 'Recommended' && '🟢 '}
                {interview.recommendation === 'Second Round / Further Evaluation' && '🟡 '}
                {interview.recommendation === 'Not Recommended' && '🔴 '}
                {interview.recommendation}
              </div>
              <p className="text-xs font-medium opacity-90 mt-1">
                Recommended Role: <strong>{interview.recommendedPosition || interview.position}</strong>
              </p>
            </div>

            {/* Dual Signatures */}
            <div className="flex items-center gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-current/20">
              <div className="text-left sm:text-right">
                <div className="text-[10px] font-bold uppercase opacity-80">Interviewer 1</div>
                <div className="font-bold text-sm mt-0.5">{int1}</div>
                <div className="text-[10px] opacity-75">{interview.interviewer1Recommendation || 'Passed'}</div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-[10px] font-bold uppercase opacity-80">Interviewer 2</div>
                <div className="font-bold text-sm mt-0.5">{int2}</div>
                <div className="text-[10px] opacity-75">{interview.interviewer2Recommendation || 'Passed'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-200">
          All In One Academy – Candidate Interview Evaluation System • Confidential & Proprietary
        </div>
      </div>
    </div>
  );
};
