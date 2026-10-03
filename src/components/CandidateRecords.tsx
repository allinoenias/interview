import React, { useState, useEffect, useMemo } from 'react';
import { Candidate, Interview } from '../types';
import { getCandidates, getInterviews, deleteCandidateAndInterview } from '../services/interviewService';
import { POSITIONS_LIST } from '../data/interviewQuestions';
import { 
  Search, 
  Filter, 
  FileText, 
  Play, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  User, 
  Briefcase, 
  Calendar, 
  RefreshCw,
  PlusCircle,
  Eye
} from 'lucide-react';

interface CandidateRecordsProps {
  onOpenReport: (interviewId: string) => void;
  onResumeInterview: (candidate: Candidate, interview: Interview) => void;
  onNewInterview: () => void;
}

export const CandidateRecords: React.FC<CandidateRecordsProps> = ({
  onOpenReport,
  onResumeInterview,
  onNewInterview
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('ALL');
  const [selectedRecommendation, setSelectedRecommendation] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedScoreFilter, setSelectedScoreFilter] = useState('ALL');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [candList, intList] = await Promise.all([
        getCandidates(),
        getInterviews()
      ]);
      setCandidates(candList);
      setInterviews(intList);
    } catch (err) {
      console.warn('Fetch records error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map interview by candidateId for fast lookup
  const interviewMap = useMemo(() => {
    const map = new Map<string, Interview>();
    interviews.forEach(i => {
      map.set(i.candidateId, i);
    });
    return map;
  }, [interviews]);

  // Filter and Search logic
  const filteredCandidates = useMemo(() => {
    return candidates.filter(cand => {
      const int = interviewMap.get(cand.id);
      
      // Search query matches name, email, phone, position, interviewer
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesName = cand.fullName.toLowerCase().includes(q);
        const matchesEmail = cand.email.toLowerCase().includes(q);
        const matchesPhone = cand.phone.toLowerCase().includes(q);
        const matchesPosition = cand.position.toLowerCase().includes(q);
        const matchesInterviewer = (cand.interviewerName || '').toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesPosition && !matchesInterviewer) {
          return false;
        }
      }

      // Filter by Position
      if (selectedPosition !== 'ALL' && cand.position !== selectedPosition) {
        return false;
      }

      // Filter by Status
      if (selectedStatus !== 'ALL') {
        const status = int?.status === 'completed' ? 'completed' : 'pending';
        if (status !== selectedStatus) return false;
      }

      // Filter by Recommendation
      if (selectedRecommendation !== 'ALL') {
        if (!int || int.recommendation !== selectedRecommendation) return false;
      }

      // Filter by Score
      if (selectedScoreFilter !== 'ALL' && int) {
        const pct = int.percentage || 0;
        if (selectedScoreFilter === 'high' && pct < 80) return false;
        if (selectedScoreFilter === 'medium' && (pct < 60 || pct >= 80)) return false;
        if (selectedScoreFilter === 'low' && pct >= 60) return false;
      }

      return true;
    });
  }, [candidates, interviewMap, searchQuery, selectedPosition, selectedRecommendation, selectedStatus, selectedScoreFilter]);

  const handleDelete = async (candidateId: string) => {
    const int = interviewMap.get(candidateId);
    try {
      await deleteCandidateAndInterview(candidateId, int?.id);
      setCandidates(prev => prev.filter(c => c.id !== candidateId));
      setDeleteConfirmId(null);
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const exportCSV = () => {
    if (filteredCandidates.length === 0) return;
    const headers = [
      'Candidate Name',
      'Phone',
      'Email',
      'Position',
      'Interview Date',
      'Interviewer',
      'Experience',
      'Previous Company',
      'Expected Salary',
      'Status',
      'Total Score (/45)',
      'Percentage (%)',
      'Recommendation',
      'Recommended Position'
    ];

    const rows = filteredCandidates.map(c => {
      const int = interviewMap.get(c.id);
      return [
        `"${c.fullName}"`,
        `"${c.phone}"`,
        `"${c.email}"`,
        `"${c.position}"`,
        `"${c.interviewDate}"`,
        `"${c.interviewerName}"`,
        `"${c.experience || ''}"`,
        `"${c.previousCompany || ''}"`,
        `"${c.expectedSalary || ''}"`,
        `"${int?.status === 'completed' ? 'Completed' : 'Pending/Draft'}"`,
        int?.totalScore ?? 'N/A',
        int?.percentage ? `${int.percentage}%` : 'N/A',
        `"${int?.recommendation || 'Pending'}"`,
        `"${int?.recommendedPosition || c.position}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AIO_Candidate_Records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportBlueprintJSON = () => {
    const blueprintData = {
      academy: "All In One Academy",
      exportedAt: new Date().toISOString(),
      panel: ["Supriya", "Amit"],
      totalRecords: filteredCandidates.length,
      candidates: filteredCandidates.map(c => ({
        candidate: c,
        interview: interviewMap.get(c.id) || null
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blueprintData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `AllInOne_Evaluation_Blueprint_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Candidate Records & Evaluation Archive
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Search, filter, inspect full interview reports, or export as blueprint data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchData}
            title="Refresh Data"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={exportBlueprintJSON}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs sm:text-sm font-bold transition-colors shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Export Blueprint (JSON)</span>
          </button>

          <button
            onClick={onNewInterview}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ New Interview</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name, phone, email, interviewer..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Position Filter */}
          <div>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">All Positions</option>
              {POSITIONS_LIST.map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          {/* Recommendation Filter */}
          <div>
            <select
              value={selectedRecommendation}
              onChange={(e) => setSelectedRecommendation(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">All Decisions</option>
              <option value="Recommended">🟢 Recommended</option>
              <option value="Second Round / Further Evaluation">🟡 Second Round</option>
              <option value="Not Recommended">🔴 Not Recommended</option>
            </select>
          </div>

          {/* Score Range Filter */}
          <div>
            <select
              value={selectedScoreFilter}
              onChange={(e) => setSelectedScoreFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">All Scores</option>
              <option value="high">High Score (≥ 80%)</option>
              <option value="medium">Average (60% - 79%)</option>
              <option value="low">Below Benchmark (&lt; 60%)</option>
            </select>
          </div>
        </div>

        {/* Results count pill */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing <strong>{filteredCandidates.length}</strong> of <strong>{candidates.length}</strong> candidates</span>
          {(searchQuery || selectedPosition !== 'ALL' || selectedRecommendation !== 'ALL' || selectedScoreFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedPosition('ALL');
                setSelectedRecommendation('ALL');
                setSelectedScoreFilter('ALL');
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Candidate Records Table / List */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs sm:text-sm font-semibold text-slate-600">Loading Candidate Records from Firestore...</p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Candidate Records Found</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedPosition !== 'ALL' 
              ? 'Try clearing the search query or changing your filter criteria.'
              : 'Start your first 10-minute candidate evaluation interview.'}
          </p>
          <button
            onClick={onNewInterview}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Interview</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Position</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Recommendation</th>
                  <th className="py-3.5 px-4">Interviewer</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredCandidates.map((cand) => {
                  const int = interviewMap.get(cand.id);
                  const isCompleted = int?.status === 'completed';

                  return (
                    <tr key={cand.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{cand.fullName}</div>
                        <div className="text-[11px] text-slate-400">{cand.phone} • {cand.email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-700">{cand.position}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {cand.interviewDate}
                      </td>

                      <td className="py-3.5 px-4">
                        {int ? (
                          <div>
                            <span className="font-extrabold text-blue-700 text-sm">
                              {int.totalScore}/45
                            </span>
                            <span className="text-[11px] text-slate-500 ml-1">
                              ({int.percentage}%)
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Pending</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {int?.recommendation ? (
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
                            int.recommendation === 'Recommended'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : int.recommendation === 'Not Recommended'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {int.recommendation === 'Recommended' && '🟢'}
                            {int.recommendation === 'Second Round / Further Evaluation' && '🟡'}
                            {int.recommendation === 'Not Recommended' && '🔴'}
                            {int.recommendation}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                            In Progress
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {cand.interviewerName}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isCompleted && int ? (
                            <button
                              onClick={() => onOpenReport(int.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg border border-blue-200 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Report</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onResumeInterview(cand, int || {
                                id: `int_${cand.id}`,
                                candidateId: cand.id,
                                candidateName: cand.fullName,
                                candidateEmail: cand.email,
                                candidatePhone: cand.phone,
                                position: cand.position,
                                interviewDate: cand.interviewDate,
                                interviewerId: cand.interviewerId,
                                interviewerName: cand.interviewerName,
                                interviewer1Name: cand.interviewer1Name || 'Supriya',
                                interviewer2Name: cand.interviewer2Name || 'Amit',
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
                                recommendedPosition: cand.position,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                              })}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Conduct Interview</span>
                            </button>
                          )}

                          <button
                            onClick={() => setDeleteConfirmId(cand.id)}
                            title="Delete Record"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredCandidates.map((cand) => {
              const int = interviewMap.get(cand.id);
              const isCompleted = int?.status === 'completed';

              return (
                <div key={cand.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{cand.fullName}</h3>
                      <p className="text-xs font-semibold text-blue-700">{cand.position}</p>
                    </div>
                    {int?.recommendation ? (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        int.recommendation === 'Recommended'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : int.recommendation === 'Not Recommended'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {int.recommendation === 'Recommended' && '🟢 '}
                        {int.recommendation === 'Second Round / Further Evaluation' && '🟡 '}
                        {int.recommendation === 'Not Recommended' && '🔴 '}
                        {int.recommendation}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        In Progress
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold">Interview Date</span>
                      <span className="font-medium text-slate-800">{cand.interviewDate}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold">Total Score</span>
                      <span className="font-extrabold text-blue-700">
                        {int ? `${int.totalScore}/45 (${int.percentage}%)` : 'Pending'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold">Interviewer</span>
                      <span className="font-medium text-slate-800">{cand.interviewerName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold">Phone</span>
                      <span className="font-medium text-slate-800">{cand.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    {isCompleted && int ? (
                      <button
                        onClick={() => onOpenReport(int.id)}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Report</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onResumeInterview(cand, int || {
                          id: `int_${cand.id}`,
                          candidateId: cand.id,
                          candidateName: cand.fullName,
                          candidateEmail: cand.email,
                          candidatePhone: cand.phone,
                          position: cand.position,
                          interviewDate: cand.interviewDate,
                          interviewerId: cand.interviewerId,
                          interviewerName: cand.interviewerName,
                          interviewer1Name: cand.interviewer1Name || 'Supriya',
                          interviewer2Name: cand.interviewer2Name || 'Amit',
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
                          recommendedPosition: cand.position,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString()
                        })}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Conduct Interview</span>
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteConfirmId(cand.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Delete Candidate Record?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              This will permanently remove the candidate's personal information and recorded answers from Firestore.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
