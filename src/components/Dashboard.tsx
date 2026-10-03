import React, { useEffect, useState } from 'react';
import { Candidate, Interview, DashboardStats } from '../types';
import { getCandidates, getInterviews, computeDashboardStats } from '../services/interviewService';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ThumbsUp, 
  ThumbsDown, 
  PlusCircle, 
  FileText, 
  History, 
  ArrowRight, 
  Play, 
  Eye, 
  Sparkles,
  ShieldCheck,
  Award,
  Zap
} from 'lucide-react';

interface DashboardProps {
  onNewInterview: () => void;
  onViewRecords: (filter?: string) => void;
  onOpenReport: (interviewId: string) => void;
  onResumeInterview: (candidate: Candidate, interview: Interview) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNewInterview,
  onViewRecords,
  onOpenReport,
  onResumeInterview
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cList, iList] = await Promise.all([
          getCandidates(),
          getInterviews()
        ]);
        setCandidates(cList);
        setInterviews(iList);
      } catch (err) {
        console.warn('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = computeDashboardStats(candidates, interviews);

  // Map interview by candidateId
  const interviewMap = new Map<string, Interview>();
  interviews.forEach(i => interviewMap.set(i.candidateId, i));

  const recentCandidates = candidates.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Academy Banner Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Structured 10-Minute Assessment Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            All In One Academy
          </h1>
          <p className="text-sm sm:text-lg font-medium text-blue-200 mt-1">
            Candidate Interview Evaluation System
          </p>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Conduct rapid 10-minute evaluations covering Marketing, Parent Counselling, Sales Pitch, Learning Speed, Stability, and Live 60-second role-plays with real-time scoring.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={onNewInterview}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-sm shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ New Interview</span>
            </button>

            <button
              onClick={() => onViewRecords()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-sm transition-all"
            >
              <FileText className="w-4 h-4 text-slate-300" />
              <span>Candidate Records</span>
            </button>

            <button
              onClick={() => onViewRecords('completed')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all"
            >
              <History className="w-4 h-4 text-slate-300" />
              <span>Interview History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Statistics Grid */}
      <div className="mb-8">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-blue-600" />
          Real-Time Evaluation Metrics
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Total Candidates */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">Total Candidates</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5 block">
              {stats.totalCandidates}
            </span>
          </div>

          {/* Completed */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">Completed</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight mt-0.5 block">
              {stats.completedInterviews}
            </span>
          </div>

          {/* Pending */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">Pending</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight mt-0.5 block">
              {stats.pendingInterviews}
            </span>
          </div>

          {/* Average Score */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">Average Score</span>
            <span className="text-2xl sm:text-3xl font-black text-indigo-700 tracking-tight mt-0.5 block">
              {stats.averageScore}%
            </span>
          </div>

          {/* Recommended */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">Recommended</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight mt-0.5 block">
              {stats.recommendedCount}
            </span>
          </div>

          {/* Not Recommended */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <ThumbsDown className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">Not Recommended</span>
            <span className="text-2xl sm:text-3xl font-black text-rose-700 tracking-tight mt-0.5 block">
              {stats.notRecommendedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Evaluations & Candidates Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Recent Candidate Evaluations
            </h3>
            <p className="text-xs text-slate-500">
              Latest candidate profiles registered in the system.
            </p>
          </div>

          <button
            onClick={() => onViewRecords()}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading candidates...
          </div>
        ) : recentCandidates.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            <p className="text-sm font-semibold">No interviews started yet.</p>
            <p className="text-xs mt-1">Click "+ New Interview" to register your first candidate.</p>
            <button
              onClick={onNewInterview}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              + New Interview
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 mt-2">
            {recentCandidates.map((c) => {
              const int = interviewMap.get(c.id);
              const isCompleted = int?.status === 'completed';

              return (
                <div key={c.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-100 flex-shrink-0">
                      {c.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{c.fullName}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {c.position}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {c.interviewDate} • Interviewer: {c.interviewerName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    {/* Score / Status */}
                    {int ? (
                      <div className="text-right">
                        <div className="font-extrabold text-blue-700 text-sm">
                          {int.totalScore}/45 ({int.percentage}%)
                        </div>
                        <div className="text-[10px] font-bold">
                          {int.recommendation === 'Recommended' && <span className="text-emerald-600">🟢 Recommended</span>}
                          {int.recommendation === 'Second Round / Further Evaluation' && <span className="text-amber-600">🟡 Second Round</span>}
                          {int.recommendation === 'Not Recommended' && <span className="text-rose-600">🔴 Not Recommended</span>}
                          {!int.recommendation && <span className="text-slate-500">Draft In-Progress</span>}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Pending Session</span>
                    )}

                    {/* Action button */}
                    {isCompleted && int ? (
                      <button
                        onClick={() => onOpenReport(int.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg border border-blue-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Report</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onResumeInterview(c, int || {
                          id: `int_${c.id}`,
                          candidateId: c.id,
                          candidateName: c.fullName,
                          candidateEmail: c.email,
                          candidatePhone: c.phone,
                          position: c.position,
                          interviewDate: c.interviewDate,
                          interviewerId: c.interviewerId,
                          interviewerName: c.interviewerName,
                          interviewer1Name: c.interviewer1Name || 'Supriya',
                          interviewer2Name: c.interviewer2Name || 'Amit',
                          isDualPanel: true,
                          startTime: new Date().toISOString(),
                          durationSeconds: 0,
                          timeRemainingSeconds: 600,
                          currentQuestionIndex: 0,
                          status: 'draft',
                          answers: {},
                          totalScore: 0,
                          maxScore: 45,
                          percentage: 0,
                          strengths: '',
                          weaknesses: '',
                          redFlags: '',
                          additionalComments: '',
                          recommendation: '',
                          recommendedPosition: c.position,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString()
                        })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Conduct</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
