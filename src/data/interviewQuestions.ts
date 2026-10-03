import { QuestionDefinition } from '../types';

export const INTERVIEW_QUESTIONS: QuestionDefinition[] = [
  {
    id: 1,
    category: 'MARKETING & GROWTH STRATEGY',
    shortCategory: 'marketing',
    categoryTitle: 'High-ROI Student Acquisition & Lead Generation Blueprint',
    question: '“If All In One Academy launches a new batch and tasks you with securing 100 paid admissions in 30 days with a controlled budget, what exact 3-step growth blueprint (digital ads, institutional outreach, and local catchment) will you execute?”',
    instructions: 'Listen for structured, actionable funnels: hyper-local Meta/Google ads, school diagnostic scholarship tests (SAT), demo masterclasses, and student referral loops.',
    evaluationCriteria: [
      'Structured 3-pillar marketing blueprint (Digital, Institutional, Local)',
      'Digital lead generation & cost-per-lead (CPL) understanding',
      'Institutional outreach (School/College seminars, scholarship aptitude tests)',
      'Referral programs & parent-student word-of-mouth loops',
      'Conversion funnel clarity (Inquiry → Walk-in → Demo → Paid Admission)'
    ],
    suggestedAnswerOptions: [
      'Digital Funnel: Hyper-local Meta/Google ads targeting parents within 5-10 km radius with free mock test hook',
      'School Outreach: Conduct Career Guidance Seminars & All In One Scholarship Aptitude Test (SAT) in schools',
      'Demo Bootcamps: 3-Day Free Concept Masterclasses with parent orientation on day 3 for spot admissions',
      'Referral blitz: "Study Buddy" fee cashback & scholarship rewards for existing student referrals',
      'Local Catchment: Newspaper inserts, hoardings at tuition hubs, and educational kiosk drives',
      'Social Proof Engine: Video testimonials of top rankers, result posters, and parent reviews on YouTube/Instagram'
    ],
    suggestedObservationNotes: [
      'High strategic clarity; understands cost per lead and walk-in conversion ratios',
      'Creative blend of offline school tie-ups and targeted digital campaigns',
      'Showed practical experience handling coaching institute admission drives',
      'Average response; relied only on generic banner and pamphlet distribution',
      'Lacked understanding of how to nurture leads from cold inquiries to walk-ins'
    ],
    quickPresets: [
      {
        label: '⭐ Elite Growth Strategist (5/5)',
        score: 5,
        answerSummary: 'Detailed a complete 3-pillar engine: (1) Targeted hyper-local Google/Meta lead ads offering free diagnostic scorecards, (2) School scholarship tests (SAT) capturing 500+ warm leads, (3) 3-Day Demo Bootcamp with a 40% spot-admission discount offer.',
        interviewerNote: 'Exceptional marketing mindset. Knows how to generate quality inquiries and drive footfalls into the academy.'
      },
      {
        label: '👍 Standard Marketer (3/5)',
        score: 3,
        answerSummary: 'Suggested distributing flyers outside schools, posting results on social media pages, and offering fee concessions to walk-ins.',
        interviewerNote: 'Understands basic marketing tactics; will need guidance on digital tracking and school tie-up partnerships.'
      },
      {
        label: '⚠️ Ineffective Plan (1/5)',
        score: 1,
        answerSummary: 'Gave vague suggestions like "running ads and waiting for word of mouth"; no structured acquisition steps.',
        interviewerNote: 'Lacks coaching admission experience and proactive lead generation capability.'
      }
    ],
    maxScore: 5,
    scoreScaleLabel: '1 = Poor  |  2 = Below Average  |  3 = Average  |  4 = Good  |  5 = Excellent'
  },
  {
    id: 2,
    category: 'COUNSELLING & OBJECTION HANDLING',
    shortCategory: 'counselling',
    categoryTitle: 'Trust Building, Empathy & Premium Fee Justification',
    question: '“A skeptical parent says: ‘Your coaching fees are 30% higher than competitor institutes, and free lectures are on YouTube anyway. Why should I invest here?’ How do you steer the conversation to convert skepticism into conviction?”',
    instructions: 'Evaluate empathy, avoiding defensive arguments, reframing fee as an investment in student rank, and showing the difference between self-study chaos and structured mentoring.',
    evaluationCriteria: [
      'Active listening & deep empathy (no defensive arguing)',
      'Reframing "Expense" into "High-Yield Career Investment & ROI"',
      'Articulating academy value: Curated material, 1-on-1 doubt solving, AI test analytics',
      'Contrasting YouTube clutter vs disciplined, monitored batch environment',
      'Diagnostic invitation: Offering free assessment test & merit scholarship concession'
    ],
    suggestedAnswerOptions: [
      'Empathetic Acknowledgment: "I completely appreciate that education fees are a crucial family investment for your child\'s future"',
      'Value vs Free Videos: "YouTube has unlimited content but zero discipline, doubt resolution, or individual tracking"',
      'Academy Pedagogy: Highlighted daily test series, 1-on-1 faculty doubt clinics, and small 25-student batch focus',
      'Proven Track Record: Cited verified selection percentages and student score improvements from previous batches',
      'Risk-Free Evaluation: Invited child for 2-day classroom trial & diagnostic aptitude test with merit scholarship option',
      'Flexible Payment Support: Explained zero-interest monthly EMI & installment options to ease family cash flow'
    ],
    suggestedObservationNotes: [
      'Calm, highly empathetic, and authoritative parent counsellor presence',
      'Masterfully steered the focus from "fees" to "student score transformation & selections"',
      'Clear, articulate explanation of personalized mentorship and doubt support',
      'Became slightly defensive when competitor institutes were mentioned',
      'Lacked conviction when justifying premium fee structures'
    ],
    quickPresets: [
      {
        label: '⭐ Master Parent Counsellor (5/5)',
        score: 5,
        answerSummary: 'Validated parent budget concern with empathy. Explained that while lectures are free online, top ranks require daily doubt solving, exam test analytics, and personal mentoring. Invited parent for a free Diagnostic Assessment with merit scholarship.',
        interviewerNote: 'Natural parent counsellor. Builds instant trust and effortlessly reframes coaching fees as essential security for student career success.'
      },
      {
        label: '👍 Good Value Articulation (3/5)',
        score: 3,
        answerSummary: 'Emphasized faculty quality and offered flexible installment payment plans to resolve the pricing barrier.',
        interviewerNote: 'Good tone; needs practice on establishing deep pedagogical value before offering fee installment solutions.'
      },
      {
        label: '⚠️ Argumentative / Weak (1/5)',
        score: 1,
        answerSummary: 'Criticized competitor institutes and YouTube, sounding defensive and failing to explain our distinct strengths.',
        interviewerNote: 'High risk of losing price-sensitive parents; lacks consultative counselling finesse.'
      }
    ],
    maxScore: 5,
    scoreScaleLabel: '1 = Poor  |  2 = Below Average  |  3 = Average  |  4 = Good  |  5 = Excellent'
  },
  {
    id: 3,
    category: 'SALES PITCH & DISCOVERY',
    shortCategory: 'sales',
    categoryTitle: '2-Minute Discovery & High-Converting Admission Close',
    question: '“A parent walks in or calls with vague interest: ‘Just inquiring about your courses.’ Deliver a 2-minute consultative pitch: uncover their child’s academic bottleneck, establish authority, and close with a booked offline diagnostic demo slot.”',
    instructions: 'Observe opening discovery questions, 3-point value proposition, vocal confidence, and decisive closing call-to-action.',
    evaluationCriteria: [
      'Sharp discovery questions (Grade, target competitive exam, current weak areas)',
      'Structured 3-point pitch (Faculty pedigree, Test series analysis, Personalized mentoring)',
      'Sales confidence, enthusiasm, and articulate delivery',
      'Sense of urgency creation (Batch seat limits, early-bird scholarship deadline)',
      'Decisive closing call-to-action (Setting specific date & time for diagnostic demo)'
    ],
    suggestedAnswerOptions: [
      'Needs Discovery: "Which grade is your child in, which exam are they targeting, and where are they losing marks currently?"',
      'Core 3-Point Value: (1) Top-tier faculty, (2) Weekly AI test reports sent to parents, (3) Daily doubt clearing desks',
      'Batch Cap Urgency: "We strictly cap batches at 25 students so every student gets personal attention - only 6 seats remain"',
      'Hard Closing Ask: "Let\'s schedule student\'s 45-min Diagnostic Test this Saturday at 11 AM - can I confirm your parent pass?"',
      'Overcame Hesitation: Offered free parent counselling report alongside the student test',
      'Monologue Pitch: Talked endlessly about the institute without understanding the student\'s challenges'
    ],
    suggestedObservationNotes: [
      'Commanding, persuasive, and energetic phone/in-person sales presence',
      'Asked smart discovery questions before pitching; pinpointed parent anxieties',
      'Decisive closing ask with specific slot booking rather than open-ended follow-up',
      'Talked too fast or gave a generic brochure speech',
      'Forgot to close with a concrete next step or appointment'
    ],
    quickPresets: [
      {
        label: '⭐ Top Tier Closer (5/5)',
        score: 5,
        answerSummary: 'Asked 2 targeted discovery questions, delivered a compelling 90-second value pitch addressing the child\'s weak subjects, and firmly closed with an appointment: "Let\'s book your child\'s free Diagnostic Evaluation this Saturday at 11:00 AM."',
        interviewerNote: 'Exceptional sales drive. High conversion energy, consultative discovery, and crisp closing technique.'
      },
      {
        label: '👍 Capable Pitcher (3/5)',
        score: 3,
        answerSummary: 'Explained courses and fee packages thoroughly, but waited for the parent to take initiative rather than locking in a demo slot.',
        interviewerNote: 'Strong communicator; needs training on assertive closing questions and urgency building.'
      },
      {
        label: '⚠️ Low Conversion Ability (1/5)',
        score: 1,
        answerSummary: 'Read out course brochures without engaging the parent; lacked energy and failed to ask for any commitment.',
        interviewerNote: 'Low sales presence; unlikely to meet admission conversion benchmarks without extensive retraining.'
      }
    ],
    maxScore: 5,
    scoreScaleLabel: '1 = Poor  |  2 = Below Average  |  3 = Average  |  4 = Good  |  5 = Excellent'
  },
  {
    id: 4,
    category: 'LEARNING SPEED & ADAPTABILITY',
    shortCategory: 'learning',
    categoryTitle: 'Software Fluency, CRM Mastery & Autonomous Learning',
    question: '“We introduce a new AI-driven CRM, automated WhatsApp drip tool, and LMS platform you have never used before. What is your exact step-by-step methodology to achieve 100% operational fluency within 48 hours?”',
    followUp: '“How do you handle a scenario where the system experiences a technical glitch right during a peak parent admission rush?”',
    instructions: 'Look for self-reliance, documentation reading, trial lead testing, error logging, and calm emergency fallback workflows.',
    evaluationCriteria: [
      'Proactive self-learning methodology (Walkthroughs, sandbox testing, SOP notes)',
      'Fast turnaround commitment (Basic fluency in 24h, fully independent in 48h)',
      'Digital dexterity & CRM lead status tracking hygiene',
      'Crisis composure (Managing manual parent log sheets during software downtime)',
      'Continuous skill improvement and coachability'
    ],
    suggestedAnswerOptions: [
      'Sandbox Exploration: Creates test leads to practice status transitions, follow-up scheduling, and payment logging',
      'SOP Documentation: Takes clear personal notes & checklists on key shortcuts to avoid repeating beginner questions',
      'Batch Clarification: Groups edge-case doubts and resolves them in a single 10-minute session with technical lead',
      '48-Hour Independence: Confident in handling live incoming parent calls & CRM updates from Day 2 onwards',
      'Downtime Composure: Maintains a neat manual spreadsheet/log sheet during server downtime and syncs data once restored',
      'Tech Resistance: Expects dedicated person to sit and guide every single lead click for weeks'
    ],
    suggestedObservationNotes: [
      'High digital dexterity, proactive self-learner who embraces modern AI/CRM tools',
      'Clear, practical emergency contingency plan for software downtime',
      'Takes complete ownership of learning without requiring supervisor handholding',
      'Intimidated by multi-step software and automated dashboards',
      'Indicated they need extended training periods (> 2 weeks) for basic tools'
    ],
    quickPresets: [
      {
        label: '⭐ Agile Tech Self-Starter (5/5)',
        score: 5,
        answerSummary: 'Methodical approach: watches training modules, tests sandbox lead workflows, creates personal SOP checklists, and reaches full autonomy within 48 hours. Uses manual offline lead logs during glitches to ensure zero lost leads.',
        interviewerNote: 'Highly adaptable, tech-fluent, and proactive. Will adopt our LMS, WhatsApp, and CRM tools effortlessly.'
      },
      {
        label: '👍 Standard Learner (3/5)',
        score: 3,
        answerSummary: 'Learns standard CRM workflows with 3-4 days of team shadowing and practice.',
        interviewerNote: 'Good learner with standard onboarding support.'
      },
      {
        label: '⚠️ Tech Hesitant (1/5)',
        score: 1,
        answerSummary: 'Stated they find software confusing and require continuous supervision for several weeks.',
        interviewerNote: 'Low adaptability; will likely lead to delayed parent follow-ups and CRM data bottlenecks.'
      }
    ],
    maxScore: 5,
    scoreScaleLabel: '1 = Poor  |  2 = Below Average  |  3 = Average  |  4 = Good  |  5 = Excellent'
  },
  {
    id: 5,
    category: 'STABILITY & CAREER COMMITMENT',
    shortCategory: 'stability_1',
    categoryTitle: 'Domain Passion, 2-Year Vision & Retention Potential',
    question: '“The coaching industry has seasonal high-pressure cycles (admissions vs exam seasons). What keeps you deeply motivated in this domain, and how does this role align with your personal 2-to-3 year professional milestones?”',
    instructions: 'Evaluate genuine passion for student transformation, long-term commitment, realistic growth expectations, and retention potential.',
    evaluationCriteria: [
      'Genuine passion for education, student mentoring, and academy growth',
      'Long-term career commitment (Not using this as a temporary stopgap)',
      'Clear 2-to-3 year progression goal (e.g. Senior Counsellor, Admissions Lead, Branch Manager)',
      'Understanding of coaching industry season cycles and work demands',
      'Professional maturity, stability, and positive work ethic'
    ],
    suggestedAnswerOptions: [
      'Education Passion: Deeply energized by guiding students towards life-changing competitive exam success',
      '2-Year Roadmap: Aspires to consistently outperform admission targets and lead a branch counselling team in 2 years',
      'Skill Mastery: Wants to master educational sales psychology, student retention, and branch P&L operations',
      'Institutional Alignment: Values All In One Academy\'s reputation and wants to grow alongside the institute',
      'Temporary Stopgap: Treating this job as a short filler while preparing for competitive exams or waiting for visa',
      'Vague Ambitions: Has no clear vision for career growth in the education sector'
    ],
    suggestedObservationNotes: [
      'Clear, ambitious, and realistic 2-to-3 year career trajectory in educational admissions',
      'High passion for student success and high personal work ethic',
      'Looking for a stable home organization to build a long-term career',
      'Unclear about staying in education; high likelihood of quitting after 3-6 months',
      'Signaled that they might leave for government exams or unrelated fields'
    ],
    quickPresets: [
      {
        label: '⭐ High-Stability Pillar (5/5)',
        score: 5,
        answerSummary: 'Committed to building a multi-year career in educational counselling. Aims to master admission conversions, mentor junior staff, and step into an Admissions Team Lead / Assistant Branch Manager role within 2 years.',
        interviewerNote: 'Top-tier stability and institutional loyalty. Aligned with academy culture and excellent long-term retention profile.'
      },
      {
        label: '👍 Dependable Candidate (3/5)',
        score: 3,
        answerSummary: 'Seeking steady employment in a growing coaching academy with fair incentives and good team culture.',
        interviewerNote: 'Dependable and stable; standard 1-2 year retention expectation.'
      },
      {
        label: '⚠️ Flight Risk Stopgap (1/5)',
        score: 1,
        answerSummary: 'Mentioned preparing for multiple government exams or looking to switch industries shortly.',
        interviewerNote: 'Severe retention risk; likely to leave right before peak admission season.'
      }
    ],
    maxScore: 5,
    scoreScaleLabel: '1 = Poor  |  2 = Below Average  |  3 = Average  |  4 = Good  |  5 = Excellent'
  },
  {
    id: 6,
    category: 'INTEGRITY & DECISION MAKING',
    shortCategory: 'stability_2',
    categoryTitle: 'Ethics, Confidentiality & Anti-Poaching Loyalty',
    question: '“Suppose after 4 months at All In One Academy, a rival coaching institute offers you a 20% higher salary and asks you to bring your parent lead database. What principles govern your decision, and how do you respond?”',
    instructions: 'Test strict data confidentiality, integrity, loyalty under poaching, and long-term career perspective over transactional jumping.',
    evaluationCriteria: [
      'Uncompromising data confidentiality & ethical standards (zero client data poaching)',
      'Understanding that jumping in 4 months destroys professional reputation and credibility',
      'Valuing institutional stability, incentive structures, and leadership trust',
      'Open communication with current management rather than sudden exits',
      'Commitment to the student batch lifecycle they initiated'
    ],
    suggestedAnswerOptions: [
      'Ethical Stand: "Student data is confidential intellectual property; sharing or stealing leads is strictly unethical and illegal"',
      'Reputation First: Recognizes that frequent 3-4 month switches brand a candidate as untrustworthy and unreliable',
      'Long-Term Value: Evaluates company culture, performance bonuses, and career growth over quick short-term jumps',
      'Open Dialogue: Discusses performance milestones and career roadmap transparently with academy leadership',
      'Student Accountability: Committed to seeing through the batch and students who enrolled under their trust',
      'Transactional Jumper: Admitted they would switch immediately and take student contact details for extra money'
    ],
    suggestedObservationNotes: [
      'Unshakeable moral compass, respect for data privacy, and strong professional ethics',
      'Understands that long-term career growth requires staying and proving performance',
      'Values institutional brand prestige and team loyalty',
      'Transactional mindset; demonstrated willingness to compromise client privacy',
      'History of jumping jobs for minor salary increments'
    ],
    quickPresets: [
      {
        label: '⭐ High Integrity & Loyalty (5/5)',
        score: 5,
        answerSummary: 'Stated firmly that student data is strictly confidential. Emphasized that 4 months is too brief to prove worth and that frequent jumping destroys industry credibility. Prioritizes learning, culture, and annual growth over lateral poaching.',
        interviewerNote: 'High ethical standards, grounded decision-making, and zero risk of client data compromise or sudden defection.'
      },
      {
        label: '👍 Reasonable Loyalty (3/5)',
        score: 3,
        answerSummary: 'Would decline unethical lead sharing, and would speak openly to academy directors regarding compensation before deciding.',
        interviewerNote: 'Ethical and transparent approach.'
      },
      {
        label: '⚠️ Unethical / Opportunistic (1/5)',
        score: 1,
        answerSummary: 'Showed readiness to jump immediately and lacked awareness regarding lead confidentiality and non-disclosure ethics.',
        interviewerNote: 'Serious risk to academy proprietary student records and operational stability.'
      }
    ],
    maxScore: 5,
    scoreScaleLabel: '1 = Poor  |  2 = Below Average  |  3 = Average  |  4 = Good  |  5 = Excellent'
  },
  {
    id: 7,
    category: 'PRESSURE HANDLING & CRISIS SPRINT',
    shortCategory: 'pressure',
    categoryTitle: '50% Target Deficit with 5 Days Remaining (War Room Sprint)',
    question: '“It is the 25th of the month. Your admission target is 20 students, but you only have 10 admissions confirmed. There are only 5 working days remaining. Walk me through your hour-by-hour 5-day action plan to bridge the 50% gap.”',
    instructions: 'Assess urgency, lead pipeline triage, prioritized follow-ups of hot/warm leads, emergency demo campaigns, and emotional grit under pressure.',
    evaluationCriteria: [
      'Emergency pipeline triage (Focusing 80% effort on warm & demo-attended leads)',
      'Aggressive outreach volume (Doubling daily parent calls & scheduling in-person visits)',
      'Time-sensitive urgency creation (48-hour spot admission scholarship deadline)',
      'Referral blitz (Contacting top performing enrolled students for fast referrals)',
      'Emotional composure, relentless drive, and high grit until the final hour'
    ],
    suggestedAnswerOptions: [
      'Pipeline Triage: Categorize all pending CRM leads into Hot (visited), Warm (attended demo), and Cold; focus on top 40 high-intent parents',
      'Urgency Catalyst: Announce a "Month-End Foundation Scholarship" offering 15% fee waiver for enrollments completed within 48 hours',
      'Outreach Multiplier: 2x calling volume (80-100 quality calls/day) and schedule morning/evening parent office walk-ins',
      'Enrolled Student Blitz: Call satisfied enrolled students/parents offering referral rewards for friends joining the batch',
      'Daily Target Tracking: Break 10 remaining admissions into a strict 2-admissions-per-day closing cadence with daily evening reviews',
      'Panic & Defeatism: Gives up, complains that lead quality is bad, or makes excuses without executing corrective action'
    ],
    suggestedObservationNotes: [
      'Thrives under pressure; immediately formulated an aggressive, structured recovery campaign',
      'Understands lead triage—focusing on bottom-of-funnel warm leads instead of wasting time on cold data',
      'Energetic, resilient, and takes 100% personal responsibility for hitting targets',
      'Becomes anxious and paralyzed under month-end deadlines',
      'Blamed marketing lead quality rather than proposing actionable outreach solutions'
    ],
    quickPresets: [
      {
        label: '⭐ Target Crusher & Closer (5/5)',
        score: 5,
        answerSummary: 'Executed a 5-day war room plan: (1) Re-engaged top 40 demo-attended leads with a 48-hour spot scholarship waiver, (2) Doubled daily parent calling cadence with evening office meetings, (3) Ran a student referral drive to close 2 admissions daily.',
        interviewerNote: 'Outstanding grit. High stress tolerance, strategic lead prioritization, and relentless closer mentality.'
      },
      {
        label: '👍 Hardworking Sprinter (3/5)',
        score: 3,
        answerSummary: 'Would put in extended hours, increase calling volume, and follow up aggressively with all pending inquiries.',
        interviewerNote: 'Good stamina and work ethic; needs slightly more strategic campaign design.'
      },
      {
        label: '⚠️ Buckles Under Pressure (1/5)',
        score: 1,
        answerSummary: 'Expressed panic, stated 10 admissions in 5 days is impossible, and blamed lead generation.',
        interviewerNote: 'Poor emotional stamina; will struggle during peak seasonal admission pressure.'
      }
    ],
    maxScore: 5,
    scoreScaleLabel: '1 = Poor  |  2 = Below Average  |  3 = Average  |  4 = Good  |  5 = Excellent'
  },
  {
    id: 8,
    category: 'ATTITUDE & ACCOUNTABILITY',
    shortCategory: 'attitude',
    categoryTitle: 'Mistake Ownership, Zero Blame-Shifting & Growth Mindset',
    question: '“Tell me about a high-stakes mistake you made at work (e.g. miscommunicated fee terms, lost a key student admission, or missed a critical deadline). How did you take ownership, what was your recovery action, and how did you institutionalize prevention?”',
    instructions: 'Look for genuine honesty without making excuses, immediate ownership, proactive resolution with the affected customer/parent, and systemic workflow prevention.',
    evaluationCriteria: [
      'Honesty & transparency (No evasion or fake "perfection")',
      'Zero blame-shifting (Took full personal accountability without blaming colleagues)',
      'Immediate crisis mitigation & customer satisfaction recovery',
      'Systemic workflow changes (Checklists, calendar triggers, CRM protocols)',
      'Coachability, humility, and emotional intelligence'
    ],
    suggestedAnswerOptions: [
      'Genuine Vulnerability: Shared a real, high-impact workplace error without sugarcoating',
      'Immediate Ownership: Promptly escalated to supervisor with a proposed solution before issues blew up',
      'Parent/Client Recovery: Personally called the parent, apologized sincerely, and resolved the issue (extra demo/material/support)',
      'Systemic Process Fix: Created a pre-admission verification checklist & automated calendar alerts to guarantee zero repeats',
      'Blamed Teammates: Claimed the mistake occurred because reception/colleague gave incorrect information',
      'Evasive / False Perfection: Claimed "I have never made any mistakes in my entire career"'
    ],
    suggestedObservationNotes: [
      'High integrity, humility, and mature self-awareness',
      'Turned a costly operational blunder into an improved team workflow process',
      'Coachable and open to feedback without becoming defensive',
      'Evaded question or gave a superficial fake mistake',
      'Shifted blame onto colleagues, management, or software tools'
    ],
    quickPresets: [
      {
        label: '⭐ High Accountability & Humility (5/5)',
        score: 5,
        answerSummary: 'Recounted a real operational mistake, took immediate personal ownership without shifting blame, resolved it directly with the parent, and instituted a permanent verification checklist to prevent recurrence.',
        interviewerNote: 'High emotional maturity, zero ego, and exceptional coachability. Trustworthy team player.'
      },
      {
        label: '👍 Honest & Teachable (3/5)',
        score: 3,
        answerSummary: 'Acknowledged a previous mistake and corrected it after consultation with their reporting manager.',
        interviewerNote: 'Honest and willing to learn from errors.'
      },
      {
        label: '⚠️ Blame Shifter / Evasive (1/5)',
        score: 1,
        answerSummary: 'Claimed they never make mistakes or blamed former team members for all past workplace issues.',
        interviewerNote: 'Low self-awareness; defensive attitude that will cause friction in team environments.'
      }
    ],
    maxScore: 5,
    scoreScaleLabel: '1 = Poor  |  2 = Below Average  |  3 = Average  |  4 = Good  |  5 = Excellent'
  },
  {
    id: 9,
    category: 'LIVE COUNSELLING & SALES TEST',
    shortCategory: 'roleplay',
    categoryTitle: 'Live 60-Second Parent Conversion Simulation',
    isRolePlay: true,
    instructions: '“The interviewer plays a skeptical parent: ‘My child is in Class 10/11 and I don’t think coaching is necessary. They can just study textbooks at home. Convince me in 60 seconds.’ Start the 60s timer and evaluate live pitch!”',
    question: '“I am a parent. My child is average in studies and I think coaching is a waste of money. They should just study school textbooks at home. You have 60 seconds to change my mind.”',
    evaluationCriteria: [
      'Instant rapport, commanding vocal tone, and respectful authority',
      'Dispelling complacency: Explaining that school textbooks do not cover competitive concept depth & time speed',
      'Sharp value proposition: Highlighting All In One Academy\'s curated test series, faculty mentorship, and board results',
      'High conversational energy, punchy delivery, and flawless time control within 60s',
      'Decisive closing hook (Booking free Diagnostic Test & parent counselling slot)'
    ],
    suggestedAnswerOptions: [
      'Hook & Respect: "Sir/Ma\'am, self-study is essential, but competitive exams test application speed and tricky conceptual shortcuts that textbooks don\'t teach"',
      'Competitive Reality: "In board and entrance exams, lakhs of students study the same book—what gives your child the winning edge is daily doubt resolution and test analytics"',
      'All In One Advantage: "At All In One Academy, our top faculty personally mentors each child in batches of 25 to build confidence and eliminate fear"',
      'Decisive 60s Close: "Don\'t take my word for it—bring your child for our Free 45-min Diagnostic Test this Sunday at 10 AM. If you don\'t see value, zero obligation!"',
      'Parent Invitation: Offered a complimentary personalized study planner prepared by senior faculty',
      'Fumbled / Low Energy: Sounded nervous, talked generically about education, and ran out of time without a closing ask'
    ],
    suggestedObservationNotes: [
      'Flawless 60-second delivery; confident, respectful, persuasive, and authoritative',
      'Masterfully shattered parent complacency without sounding rude or aggressive',
      'Superb closing punch with specific date, time, and free diagnostic hook',
      'Exceeded 60 seconds or spoke in a rushed, panicked tone',
      'Weak closing; lacked confidence to ask for parent commitment'
    ],
    quickPresets: [
      {
        label: '⭐ Master 60s Closer (5/5)',
        score: 5,
        answerSummary: 'Delivered an electrifying 60-second live pitch: Reframed school textbooks vs competitive speed, explained All In One Academy\'s doubt mentorship & test analytics, and locked in a Sunday 10 AM Diagnostic Test slot.',
        interviewerNote: 'Phenomenal live sales & counselling talent. Commanding tone, high emotional rapport, and ready to handle high-value parent admissions immediately.'
      },
      {
        label: '👍 Good Live Pitch (3/5)',
        score: 3,
        answerSummary: 'Made solid points regarding board exam competition, but ran slightly over 60 seconds and had a soft closing ask.',
        interviewerNote: 'Good natural ability; will become a top closer with 1 week of academy pitch drills.'
      },
      {
        label: '⚠️ Fumbled Under Pressure (1/5)',
        score: 1,
        answerSummary: 'Struggled under the 60-second timer, gave a generic speech, and failed to address the parent\'s objection.',
        interviewerNote: 'Lacks live pitch composure; will struggle on live parent walk-in counselling.'
      }
    ],
    maxScore: 5,
    scoreScaleLabel: '1 = Poor  |  2 = Below Average  |  3 = Average  |  4 = Good  |  5 = Excellent'
  }
];

export const POSITIONS_LIST = [
  'Admission Counsellor',
  'Senior Student Counsellor',
  'Sales & Admissions Executive',
  'Marketing & Growth Executive',
  'Digital Marketing Executive',
  'Business Development Executive (BDE)',
  'Academic Coordinator',
  'Branch Operations Manager',
  'Faculty & Academic Mentor',
  'Other'
];

export const SCORE_DESCRIPTIONS = [
  { score: 1, label: 'Poor', color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100', active: 'bg-rose-600 text-white border-rose-600' },
  { score: 2, label: 'Below Avg', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100', active: 'bg-amber-600 text-white border-amber-600' },
  { score: 3, label: 'Average', color: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100', active: 'bg-yellow-500 text-white border-yellow-500' },
  { score: 4, label: 'Good', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100', active: 'bg-blue-600 text-white border-blue-600' },
  { score: 5, label: 'Excellent', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100', active: 'bg-emerald-600 text-white border-emerald-600' },
];

export const OVERALL_REVIEW_PRESETS = {
  strengths: [
    'Outstanding parent empathy & objection handling',
    'High energy, persuasive, and authoritative closing pitch',
    'Sharp, high-ROI marketing & school outreach blueprint',
    'Fast self-learning speed with AI/CRM tools & software',
    'Strong career stability and long-term academy loyalty',
    'Articulate, respectful, and confident communication',
    'High composure and resilience during month-end target sprints',
    'High accountability, humility, and mistake ownership'
  ],
  weaknesses: [
    'Needs coaching on locking in demo appointments within 2-minute calls',
    'Slightly hesitant when justifying premium fee structures over cheap competitors',
    'Requires onboarding training on CRM lead hygiene and automated drip workflows',
    'Could be more structured and aggressive in local school outreach',
    'Needs deeper familiarity with CBSE/ICSE board syllabus patterns',
    'Tends to deliver a monologue without asking enough discovery questions'
  ],
  redFlags: [
    'None observed - High integrity, coachable attitude & excellent composure',
    'Frequent short stints (< 6 months in past roles)',
    'Unrealistic salary increment expectations disconnected from performance',
    'Reluctant to work during peak weekend admission drives',
    'Showed defensive attitude and blamed previous managers/colleagues'
  ],
  additionalComments: [
    'Ready for immediate joining (0 notice period)',
    'Strong recommendation for Admission Counsellor position',
    'Excellent candidate for Senior Student Counsellor / Sales Executive role',
    'Requires 3-day academy product and pedagogy orientation before live parent calls',
    'High potential; fast-track candidate for Team Lead consideration in 6 months'
  ]
};
