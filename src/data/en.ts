/**
 * Terjemahan English untuk data awal, dikunci per id. Terjemahan ini dibuat dengan bantuan AI dan
 * perlu ditinjau oleh kurator atau penutur bahasa Inggris sebelum dipublikasikan.
 */
import { AchievementBadge, CurriculumModule, HeritageRecord, Quest } from '../types/jejakNira';

type RecEn = Partial<Pick<HeritageRecord, 'title' | 'shortDescription' | 'culturalExplanation' | 'contributorRole' | 'audioTranscript' | 'revisionNotes' | 'localTerm'>>;

export const REC_EN: Record<string, RecEn> = {
  'REC-CLG-001': {
    title: 'The Pongkor and the Ethic of Keeping Morning Sap Fresh',
    shortDescription: 'The bamboo container that catches the dripping coconut sap, carefully cleaned and smoked before it is fitted to the flower stalk.',
    culturalExplanation:
      'In the tappers’ tradition in Cilongok, the cleanliness of the sap container determines the quality of the coconut sugar. Before use, the container is cleaned with hot water and natural smoking so the sap does not turn sour quickly.',
    contributorRole: 'Senior Tapper & Community Mentor (32 Years of Experience)',
    audioTranscript:
      '"Nek nira pingin apik lan wangi gulane, wadahe kudu resik tenan. Ora mung dibilas banyu, nanging dirumat kaya ngrumat panguripan keluarga..." (Verified translation: If you want the sap to stay good and the sugar fragrant, the container must be truly clean. Not just rinsed with water, but cared for like looking after a family’s livelihood.)',
  },
  'REC-CLG-002': {
    title: 'Reading Caramel Ripeness over a Wood-Fired Stove',
    localTerm: 'Kawah & Stirring the Sap',
    shortDescription: 'How to recognise changes in foam, aroma, and thickness as the sap is slowly cooked in the processing kitchen.',
    culturalExplanation:
      'Turning sap into molded or ant sugar happens entirely on the ground, in the production kitchen. Processors read the boiling bubbles and the caramel colour without a digital thermometer, relying on senses passed down across generations.',
    contributorRole: 'Coconut Sugar Processor & Traditional Kitchen Mentor',
    audioTranscript:
      '"Yen umobe wis alus lan ambune wangi legi, geni kudu dijaga aja kebanteren. Yen kasep sedhela wae, rasane bisa malih..." (Verified translation: When the boil is gentle and the aroma sweet and fragrant, the fire must be kept from getting too strong. Even a little late, and the taste can change.)',
  },
  'REC-CLG-003': {
    title: 'Morning Prayer and the Philosophy of Caring for the Coconut Tree',
    localTerm: 'Ngopeni Glugu (caring for the coconut tree)',
    shortDescription: 'An oral account of the reciprocal bond between tappers, nature, and the coconut trees that sustain the village.',
    culturalExplanation:
      'For the tapper community on the southern slope of Mount Slamet, the coconut tree is more than an economic commodity. It is a living partner, tended with respect and care.',
    contributorRole: 'Senior Tapper & Community Mentor (32 Years of Experience)',
    audioTranscript:
      '"Wit klapa kuwi yen disayang, diopeni resike, dheweke uga aweh nira sing bening. Awake dhewe mung njaga titipane alam kanggo anak putu." (Verified translation: If a coconut tree is loved and kept clean, it also gives clear sap. We are only keeping nature’s trust for our children and grandchildren.)',
  },
  'REC-CLG-004': {
    title: 'Checking Protective Gear and the Ground-Level Kitchen Environment',
    localTerm: 'Basic Risk Mitigation',
    shortDescription: 'An introduction to work hazards in the ground-level processing area and safety awareness for young people.',
    culturalExplanation:
      'This documentation stresses recognising the risks of a hot stove, the steam of boiling sap, sharp cleaning tools, and the weather before production begins. In the NIRA KITA pilot, all learning is done 100% on the ground.',
    contributorRole: 'Work Safety Coordinator & Community Mentor',
    audioTranscript:
      '"Safety is the first condition for the tradition to last. Young people first learn to recognise tools and stay safe in the ground-level processing kitchen."',
  },
  'REC-CLG-005': {
    title: 'Measuring Terms and the Quality of Organic Ant Sugar',
    localTerm: 'Gandhu & Crystallisation',
    shortDescription: 'Local vocabulary for judging the texture, moisture, and colour of coconut sugar for the village cooperative.',
    culturalExplanation:
      'Understanding traditional quality terms helps young people bridge senior artisans’ knowledge with fair, modern market quality standards.',
    contributorRole: 'Coconut Sugar Processor & Traditional Kitchen Mentor',
    audioTranscript:
      '"Gula sing tua lan garing kuwi suwe simpane. Bocah enom saiki bisa nggawa crita iki supaya regane gula penderes luwih diajeni." (Translation: Sugar that is mature and dry keeps for a long time. Young people today can carry this story so the tappers’ sugar is valued more.)',
    revisionNotes: 'Please complete the Banyumasan dialect pronunciation at 01:20 and reconfirm the attribution preference with Ibu Warsini.',
  },
};

type ModEn = Partial<Pick<CurriculumModule, 'title' | 'subtitle' | 'description' | 'objectives' | 'safetyNotice' | 'duration'>> & { lessons?: Record<string, string> };

export const MOD_EN: Record<string, ModEn> = {
  'MOD-01': {
    title: 'Cultural Identity & Local Heritage',
    subtitle: 'History, local language, traditional tools, and the oral history of Cilongok’s tappers.',
    description:
      'Explore the cultural roots of coconut sugar tappers in Cilongok, understand the ecological value of smallholder coconut groves, and listen to oral-history recordings approved by the community.',
    duration: '45 min',
    objectives: [
      'Understand the social and ecological history of the coconut sugar tradition in Cilongok, Banyumas.',
      'Recognise local vocabulary and terms that the community has validated.',
      'Identify the function of traditional tools with respect for their cultural context.',
    ],
    lessons: {
      'L-101': 'The Coconut Groves of Mount Slamet’s Southern Slope',
      'L-102': 'Artisans’ Voices: Morning Prayer and the Ethic of Caring for Nature',
      'L-103': 'Traditional Tools and Their Functions on the Ground',
      'L-104': 'Reflecting on the Meaning of Living Heritage Across Generations',
    },
  },
  'MOD-02': {
    title: 'Traditional Craftsmanship & Knowledge Transfer',
    subtitle: 'Demonstrations of the process, ground-level production stages, and insights from senior artisans.',
    description:
      'Learn the order in which sap becomes molded and ant sugar through annotated diagrams, mentor demonstration recordings, and guided observation in the processing kitchen.',
    duration: '60 min',
    objectives: [
      'Explain the sequence from filtering the sap to molding the coconut sugar.',
      'Understand the visual and aroma cues while sap is cooked on the stove.',
      'Connect mentors’ oral knowledge with accurate documentation practice.',
    ],
    lessons: {
      'L-201': 'Filtering Fresh Sap and Early Quality Checks',
      'L-202': 'Reading the Boil and Caramelisation with Ibu Warsini',
      'L-203': 'Stirring, Molding, and Natural Cooling',
    },
  },
  'MOD-03': {
    title: 'Occupational Safety & Risk Management',
    subtitle: 'Hazard identification, ground-based safety scenarios, and safe-work principles.',
    description:
      'Build thorough safety awareness. Every activity in this module is designed as simulation and observation on the ground, with no tree climbing.',
    duration: '50 min',
    safetyNotice:
      'PROGRAMME SAFETY LIMIT: During the pilot, participants do NOT climb coconut trees and do NOT harvest sap at height. All learning takes place on the ground with a mentor’s supervision.',
    objectives: [
      'Identify physical and weather risk factors in the coconut sugar work ecosystem.',
      'Apply safe-work procedures in the ground-level processing kitchen.',
      'Understand emergency readiness and basic protective equipment.',
    ],
    lessons: {
      'L-301': 'Risk Map of the Grove Environment and Rainy Weather',
      'L-302': 'Stove Safety, High Temperatures, and Kitchen Ergonomics',
      'L-303': 'Village Community Emergency Procedures',
    },
  },
  'MOD-04': {
    title: 'Livelihood Sustainability & Cultural Entrepreneurship',
    subtitle: 'The coconut sugar value chain, collective economy, and ethical cultural storytelling.',
    description:
      'Develop community-based economic innovation through cultural storytelling, packaging with a QR Heritage Passport, and a youth–tapper cooperative.',
    duration: '55 min',
    objectives: [
      'Map the coconut sugar value chain from smallholder groves to culturally aware consumers.',
      'Compose product stories based on artisans’ consent through the QR Heritage Passport.',
      'Design intergenerational collaboration that increases the added value for tapper families.',
    ],
    lessons: {
      'L-401': 'Anatomy of the Coconut Sugar Value Chain and Economy in Cilongok',
      'L-402': 'The Ethics of Cultural Storytelling and Ownership of Community Stories',
      'L-403': 'Designing Product QR Batches with the Village Cooperative',
    },
  },
};

type QuestEn = Partial<Pick<Quest, 'indonesianSubtitle' | 'description' | 'objectives' | 'duration'>> & { steps?: Record<string, { title: string; description: string }> };

export const QUEST_EN: Record<string, QuestEn> = {
  'QUEST-01': {
    indonesianSubtitle: 'Voices and Heritage Tools of Cilongok',
    description:
      'Discover the stories behind the coconut sugar tradition through practitioners’ experiences, learn local terms reviewed by the community, and reflect on their meaning.',
    duration: '15 min',
    objectives: [
      'Listen to practitioners’ original recordings approved by the curator.',
      'Understand local terms along with their cultural context.',
      'Identify the function of traditional tools in ground-based activities.',
      'Write a learning reflection for a mentor to review.',
    ],
    steps: {
      'STEP-1': { title: 'Listen to the Practitioner Recording', description: 'Hear Pak Parmadi talk about caring for the sap container.' },
      'STEP-2': { title: 'Learn the Local Terms', description: 'Review the glossary entry for Pongkor and the ethic of keeping tools clean.' },
      'STEP-3': { title: 'Identify Traditional Tools', description: 'Choose the tool function that matches the community documentation.' },
      'STEP-4': { title: 'Submit a Learning Reflection', description: 'Write what you understood for a community mentor to validate.' },
    },
  },
  'QUEST-02': {
    indonesianSubtitle: 'Reading the Stages of the Sugar Kitchen',
    description: 'Learn how fresh sap is filtered and slowly cooked into quality caramelised coconut sugar in the ground-level processing kitchen.',
    duration: '20 min',
    objectives: ['Put the sap-processing stages in order in the ground-level production kitchen.', 'Recognise the signs of changing foam and caramel aroma in the sap.'],
    steps: {
      'STEP-2-1': { title: 'Listen to Ibu Warsini’s Kitchen Recording', description: 'Hear how to recognise when the sap is ripe over the stove.' },
      'STEP-2-2': { title: 'Reflect on the Production Stages', description: 'Explain the order from filtering to molding.' },
    },
  },
  'QUEST-03': {
    indonesianSubtitle: 'Recognising Hazards and Working Safely from the Ground',
    description:
      'Recognise hazards in the processing kitchen and the grove environment from the ground: hot stoves, slippery floors, and protective gear. Learners are never asked to climb trees.',
    duration: '15 min',
    objectives: ['Recognise common hazards in the processing kitchen from the ground.', 'Understand the function of protective gear and safe-work habits.'],
    steps: {
      'STEP-3-1': { title: 'Read the Hazard Guide', description: 'Review the recording on checking protective gear and the kitchen environment.' },
      'STEP-3-2': { title: 'Spot Hazard Signs on the Ground', description: 'Choose the hazard sign that fits the kitchen and yard scenario.' },
      'STEP-3-3': { title: 'Reflect on Safe Work', description: 'Write one safe habit you will remember.' },
    },
  },
  'QUEST-04': {
    indonesianSubtitle: 'Telling Heritage Stories with the Artisan’s Consent',
    description:
      'Learn why artisans’ stories may only be used with permission, how attribution is written, and what appears on the Heritage Passport on the packaging.',
    duration: '15 min',
    objectives: ['Understand consent and attribution in cultural documentation.', 'Explain what is on the Heritage Passport of a coconut sugar package.'],
    steps: {
      'STEP-4-1': { title: 'Learn the Principle of Consent', description: 'Read how public, learner, and private permissions differ.' },
      'STEP-4-2': { title: 'Reflect on Ethical Storytelling', description: 'Explain why an artisan’s name appears only according to their preference.' },
    },
  },
};

type BadgeEn = Partial<Pick<AchievementBadge, 'indonesianTitle' | 'description'>>;

export const BADGE_EN: Record<string, BadgeEn> = {
  'BADGE-01': { indonesianTitle: 'First Steps in Cilongok', description: 'Completed the NIRA KITA orientation and understood the commitment to ground-based learning safety.' },
  'BADGE-02': { indonesianTitle: 'Listener of Artisans’ Voices', description: 'Completed the Forgotten Stories quest: listened to real practitioner recordings, studied the local glossary, and identified the function of traditional tools.' },
  'BADGE-03': { indonesianTitle: 'Ground-Level Tools & Process Competency', description: 'Validated directly by a community mentor for understanding traditional tool functions, the processing sequence, and work-safety principles on the ground.' },
  'BADGE-04': { indonesianTitle: 'Ethical Heritage Storyteller', description: 'Understands the principle of community consent and artisan attribution in cultural documentation.' },
};

export const LEVEL_EN: Record<number, { name: string; description: string }> = {
  1: { name: 'Trail Explorer', description: 'Opening your eyes and ears to the cultural landscape of Cilongok’s coconut sugar.' },
  2: { name: 'Heritage Listener', description: 'Listening to oral history, local terms, and artisans’ philosophy with respect.' },
  3: { name: 'Knowledge Keeper', description: 'Documenting the ground-level process sequence and safety principles with mentors.' },
  4: { name: 'Cultural Apprentice (Ground)', description: 'Taking an active part in observing the processing kitchen and guided collaboration.' },
  5: { name: 'Meaning Bearer', description: 'Connecting the artisans’ heritage with the sustainable future of the community.' },
};
