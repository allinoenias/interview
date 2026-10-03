import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { CandidateForm } from './components/CandidateForm';
import { InterviewSession } from './components/InterviewSession';
import { OverallEvaluation } from './components/OverallEvaluation';
import { CandidateRecords } from './components/CandidateRecords';
import { InterviewReport } from './components/InterviewReport';
import { Candidate, Interview } from './types';

function MainApp() {
  const { currentUser, loading } = useAuth();
  
  type TabType = 'dashboard' | 'new-interview' | 'interview-session' | 'overall-evaluation' | 'records' | 'report';
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [activeInterview, setActiveInterview] = useState<Interview | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-white font-bold text-base tracking-tight">ALL IN ONE ACADEMY</div>
        <div className="text-slate-400 text-xs mt-1">Connecting to Firebase Evaluation System...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  // Handle start new interview from form
  const handleStartInterview = (candidate: Candidate) => {
    setActiveCandidate(candidate);
    setActiveInterview(null);
    setCurrentTab('interview-session');
  };

  // Handle proceed to overall review after question 9
  const handleProceedToOverall = (interviewData: Interview) => {
    setActiveInterview(interviewData);
    setCurrentTab('overall-evaluation');
  };

  // Handle viewing full report
  const handleOpenReport = (interviewId: string) => {
    setSelectedReportId(interviewId);
    setCurrentTab('report');
  };

  // Handle resuming an active or draft interview
  const handleResumeInterview = (candidate: Candidate, interview: Interview) => {
    setActiveCandidate(candidate);
    setActiveInterview(interview);
    setCurrentTab('interview-session');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        currentTab={
          currentTab === 'interview-session'
            ? 'interview-session'
            : currentTab === 'overall-evaluation'
            ? 'interview-session'
            : currentTab === 'report'
            ? 'report'
            : (currentTab as any)
        }
        onNavigate={(tab) => {
          if (tab === 'new-interview') {
            setActiveCandidate(null);
            setActiveInterview(null);
          }
          setCurrentTab(tab);
        }}
      />

      <main className="flex-1">
        {currentTab === 'dashboard' && (
          <Dashboard
            onNewInterview={() => {
              setActiveCandidate(null);
              setActiveInterview(null);
              setCurrentTab('new-interview');
            }}
            onViewRecords={(filter) => {
              setCurrentTab('records');
            }}
            onOpenReport={handleOpenReport}
            onResumeInterview={handleResumeInterview}
          />
        )}

        {currentTab === 'new-interview' && (
          <CandidateForm
            onStartInterview={handleStartInterview}
            onCancel={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'interview-session' && activeCandidate && (
          <InterviewSession
            candidate={activeCandidate}
            existingInterview={activeInterview}
            onProceedToOverall={handleProceedToOverall}
            onCancel={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'overall-evaluation' && activeCandidate && activeInterview && (
          <OverallEvaluation
            candidate={activeCandidate}
            interview={activeInterview}
            onBackToQuestions={() => setCurrentTab('interview-session')}
            onViewReport={handleOpenReport}
            onNewInterview={() => {
              setActiveCandidate(null);
              setActiveInterview(null);
              setCurrentTab('new-interview');
            }}
            onViewRecords={() => setCurrentTab('records')}
          />
        )}

        {currentTab === 'records' && (
          <CandidateRecords
            onOpenReport={handleOpenReport}
            onResumeInterview={handleResumeInterview}
            onNewInterview={() => {
              setActiveCandidate(null);
              setActiveInterview(null);
              setCurrentTab('new-interview');
            }}
          />
        )}

        {currentTab === 'report' && selectedReportId && (
          <InterviewReport
            interviewId={selectedReportId}
            onBack={() => setCurrentTab('records')}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
