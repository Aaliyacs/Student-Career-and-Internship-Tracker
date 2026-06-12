export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  targetIndustries?: string[];
  preferences?: {
    locationPreference: 'remote' | 'on-site' | 'hybrid' | 'any';
    jobTypePreference: 'internship' | 'co-op' | 'full-time' | 'any';
  };
}

export type ApplicationStatus = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';

export interface InternshipApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  location: string;
  appliedDate: string; // ISO format or YYYY-MM-DD
  status: ApplicationStatus;
  notes: string;
  salary?: string;
  contactEmail?: string;
  interviewDate?: string;
}

export interface LearningGoal {
  id: string;
  courseName: string;
  platform: string;
  progressPercentage: number; // 0 to 100
  completionDate?: string; // YYYY-MM-DD if completed
}

export interface FilterState {
  searchQuery: string;
  status: ApplicationStatus | 'All';
  location: string;
  company: string;
  sortBy: 'appliedDateDesc' | 'appliedDateAsc' | 'companyName' | 'status';
}
