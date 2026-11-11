export type UserRole = 'entry' | 'visitor' | 'learner' | 'mentor' | 'curator' | 'admin';

export type ReviewStatus =
  | 'Draft'
  | 'In Review'
  | 'Revision Requested'
  | 'Approved'
  | 'Rejected'
  | 'Archived';

export type VisibilityScope = 'private' | 'learner' | 'public';

export type KnowledgeCategory =
  | 'Cerita lisan'
  | 'Teknik tradisional'
  | 'Alat produksi'
  | 'Istilah lokal'
  | 'Tahapan proses';

export interface ConsentPermissions {
  internalLearning: boolean;
  publicQrPage: boolean;
  promotionalMaterial: boolean;
}

export interface CuratorChecklist {
  permissionVerified: boolean;
  attributionConfirmed: boolean;
  culturalContextReviewed: boolean;
  terminologyChecked: boolean;
  mediaSuitabilityChecked: boolean;
  intendedAudienceConfirmed: boolean;
}

export interface HeritageRecord {
  id: string;
  title: string;
  localTerm?: string;
  category: KnowledgeCategory;
  exploreCategory:
    | 'Cerita Cilongok'
    | 'Kenali Peralatan'
    | 'Bahasa dan Istilah Lokal'
    | 'Proses Tradisional'
    | 'Kisah Para Perajin';
  shortDescription: string;
  culturalExplanation: string;
  contributorName: string;
  contributorRole: string;
  attributionPreference: 'Tampilkan Nama Lengkap' | 'Tampilkan Inisial Komunitas' | 'Anonim';
  language: string;
  location: string;
  duration: string;
  imageUrl: string;
  audioTranscript: string;
  audioDurationSec: number;
  consent: ConsentPermissions;
  reviewStatus: ReviewStatus;
  visibility: VisibilityScope;
  submittedDate: string;
  publishedDate?: string;
  reviewerName?: string;
  revisionNotes?: string;
  relatedModuleSlug: string;
  isIllustrativePlaceholder: boolean;
  bookmarked?: boolean;
  checklist?: CuratorChecklist;
}

export interface CurriculumModule {
  id: string;
  number: string;
  slug: string;
  title: string;
  englishTitle: string;
  subtitle: string;
  description: string;
  visualDirection: string;
  duration: string;
  completionPercent: number;
  unlocked: boolean;
  safetyNotice?: string;
  imageUrl: string;
  objectives: string[];
  lessons: {
    id: string;
    title: string;
    duration: string;
    type: 'Dokumentasi Audio' | 'Artikel Visual' | 'Diagram Proses' | 'Skenario Darat';
    completed: boolean;
  }[];
  associatedQuestId: string;
}

export interface QuestStep {
  id: string;
  title: string;
  description: string;
  type: 'audio' | 'terminology' | 'tool_challenge' | 'reflection';
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  indonesianSubtitle: string;
  moduleTitle: string;
  moduleSlug: string;
  description: string;
  duration: string;
  xpReward: number;
  badgeReward: string;
  imageUrl: string;
  completed: boolean;
  objectives: string[];
  steps: QuestStep[];
}

export interface CompetencyChecklist {
  identifiesTools: boolean;
  explainsFunctions: boolean;
  understandsSequence: boolean;
  identifiesGroundHazards: boolean;
  understandsSafetyPrinciples: boolean;
}

export interface LearnerSubmission {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  questId: string;
  questTitle: string;
  moduleTitle: string;
  submittedDate: string;
  selectedToolAnswer: string;
  reflectionText: string;
  status: 'Menunggu Validasi' | 'Tervalidasi Mentor' | 'Perlu Revisi';
  mentorName: string;
  mentorFeedback?: string;
  validatedDate?: string;
  competencyChecklist: CompetencyChecklist;
}

export interface AchievementBadge {
  id: string;
  name: string;
  indonesianTitle: string;
  description: string;
  moduleTitle: string;
  dateAchieved?: string;
  validationType: 'Penyelesaian Digital' | 'Tervalidasi Mentor (Dasar Darat)';
  unlocked: boolean;
  levelNumber: number;
}

export interface ProductBatch {
  batchCode: string;
  productName: string;
  packagingType: string;
  productionPeriod: string;
  communityOrigin: string;
  practitionerName: string;
  practitionerRole: string;
  practitionerYears: number;
  practitionerPortrait: string;
  practitionerBio: string;
  practitionerQuote: string;
  practitionerConsented: boolean;
  productImageUrl: string;
  linkedRecordIds: string[];
  status: 'Published' | 'Draft';
  qrScans: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  visibilityNote: string;
}
