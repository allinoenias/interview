import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Candidate } from '../types';
import { POSITIONS_LIST } from '../data/interviewQuestions';
import { createCandidate } from '../services/interviewService';
import { 
  UserPlus, 
  User, 
  Phone, 
  Mail, 
  Briefcase, 
  Calendar, 
  Building, 
  IndianRupee, 
  Clock, 
  Link as LinkIcon, 
  Play, 
  Sparkles, 
  ArrowLeft, 
  AlertCircle, 
  Users,
  FastForward
} from 'lucide-react';

interface CandidateFormProps {
  onStartInterview: (candidate: Candidate) => void;
  onCancel: () => void;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({ onStartInterview, onCancel }) => {
  const { currentUser } = useAuth();
  
  const today = new Date().toISOString().split('T')[0];
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState(POSITIONS_LIST[0]);
  const [customPosition, setCustomPosition] = useState('');
  const [interviewDate, setInterviewDate] = useState(today);
  
  // Dual Interviewer Panel defaults: Supriya & Amit
  const [interviewer1Name, setInterviewer1Name] = useState('Supriya');
  const [interviewer2Name, setInterviewer2Name] = useState('Amit');
  
  const [experience, setExperience] = useState('');
  const [previousCompany, setPreviousCompany] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('Immediate (0-15 days)');
  const [resumeUrl, setResumeUrl] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick fill sample candidate for rapid testing
  const handleQuickFill = () => {
    const sampleNames = ['Aman Verma', 'Pooja Sharma', 'Vikram Rathore', 'Sneha Patel', 'Ananya Roy'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    setFullName(randomName);
    setPhone('+91 98765 ' + Math.floor(10000 + Math.random() * 90000));
    setEmail(randomName.toLowerCase().replace(' ', '.') + '@example.com');
    setPosition('Admission Counsellor');
    setExperience('2.5 Years in Education Sales');
    setPreviousCompany('Pathfinder Learning Institute');
    setExpectedSalary('₹4.5 - ₹5.5 LPA');
    setNoticePeriod('15 Days');
    setResumeUrl('https://linkedin.com/in/' + randomName.toLowerCase().replace(' ', ''));
    setInterviewer1Name('Supriya');
    setInterviewer2Name('Amit');
  };

  // Quick instant start without filling fields
  const handleInstantStart = async () => {
    const candidateName = fullName.trim() || 'Candidate ' + Math.floor(100 + Math.random() * 900);
    const candidatePhone = phone.trim() || 'N/A';
    const candidateEmail = email.trim() || (candidateName.toLowerCase().replace(/\s+/g, '.') + '@candidate.local');
    const finalPosition = position === 'Other' && customPosition.trim() ? customPosition.trim() : position;
    const combinedPanelName = `${interviewer1Name.trim() || 'Supriya'} & ${interviewer2Name.trim() || 'Amit'}`;

    setLoading(true);
    try {
      const newCandidate = await createCandidate({
        fullName: candidateName,
        phone: candidatePhone,
        email: candidateEmail,
        position: finalPosition,
        interviewDate: interviewDate,
        interviewerId: currentUser?.uid || 'interviewer_uid',
        interviewerName: combinedPanelName,
        interviewer1Name: interviewer1Name.trim() || 'Supriya',
        interviewer2Name: interviewer2Name.trim() || 'Amit',
        isDualPanel: true,
        experience: experience.trim(),
        previousCompany: previousCompany.trim(),
        expectedSalary: expectedSalary.trim(),
        noticePeriod: noticePeriod.trim(),
        resumeUrl: resumeUrl.trim(),
        photoUrl: photoUrl.trim(),
        status: 'pending'
      });

      onStartInterview(newCandidate);
    } catch (err: any) {
      console.error('Candidate creation error:', err);
      // Fallback local start
      onStartInterview({
        id: 'cand_' + Date.now(),
        fullName: candidateName,
        phone: candidatePhone,
        email: candidateEmail,
        position: finalPosition,
        interviewDate: interviewDate,
        interviewerId: currentUser?.uid || 'interviewer_uid',
        interviewerName: combinedPanelName,
        interviewer1Name: interviewer1Name.trim() || 'Supriya',
        interviewer2Name: interviewer2Name.trim() || 'Amit',
        isDualPanel: true,
        experience: experience.trim(),
        previousCompany: previousCompany.trim(),
        expectedSalary: expectedSalary.trim(),
        noticePeriod: noticePeriod.trim(),
        resumeUrl: resumeUrl.trim(),
        photoUrl: photoUrl.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleInstantStart();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickFill}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Auto-Fill Sample</span>
          </button>

          <button
            type="button"
            onClick={handleInstantStart}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Start Interview</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {/* Form Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Candidate Setup (All Fields Optional)
              </h2>
              <p className="text-xs sm:text-sm text-blue-200 mt-0.5">
                Panel: <strong>Supriya</strong> &amp; <strong>Amit</strong> • Fill as much or as little as you want, nothing is compulsory!
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Section 1: Candidate Core Contact Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                1. Candidate Information (Optional)
              </span>
              <span className="text-[10px] text-slate-400 normal-case font-normal">
                Can be updated later
              </span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Candidate Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar (Optional)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210 (Optional)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ramesh.kumar@gmail.com (Optional)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Position Applied For
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  >
                    {POSITIONS_LIST.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
              </div>

              {position === 'Other' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Specify Custom Position Title
                  </label>
                  <input
                    type="text"
                    value={customPosition}
                    onChange={(e) => setCustomPosition(e.target.value)}
                    placeholder="Enter customized role title"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Dual Panel Interviewers (Supriya & Amit) */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                2. Dual Interviewer Panel
              </span>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                Supriya &amp; Amit
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Interviewer 1
                </label>
                <input
                  type="text"
                  value={interviewer1Name}
                  onChange={(e) => setInterviewer1Name(e.target.value)}
                  placeholder="Supriya"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Interviewer 2
                </label>
                <input
                  type="text"
                  value={interviewer2Name}
                  onChange={(e) => setInterviewer2Name(e.target.value)}
                  placeholder="Amit"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Interview Date
                </label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Professional Background & Compensation (Optional) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              3. Experience & Compensation Details (Optional)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Previous Experience
                </label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 3 Years (Optional)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Previous Company
                </label>
                <input
                  type="text"
                  value={previousCompany}
                  onChange={(e) => setPreviousCompany(e.target.value)}
                  placeholder="e.g. EduCorp Pvt Ltd (Optional)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Expected Salary
                </label>
                <input
                  type="text"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  placeholder="e.g. ₹35,000 / month (Optional)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Notice Period
                </label>
                <input
                  type="text"
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                  placeholder="e.g. Immediate, 15 Days (Optional)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Button: START 10-MINUTE INTERVIEW */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              <p className="font-semibold text-slate-700">Zero Mandatory Blocks</p>
              <p>You can skip any question or field anytime.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>START 10-MINUTE INTERVIEW</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
