import { Timestamp } from 'firebase/firestore';

export interface ReadingHistory {
  id: string;
  storyId: string;
  storyTitle: string;
  profileId: string;
  profileName: string;
  completedAt: Timestamp;
  duration: number;
  completed: boolean;
  missionCompleted: boolean;
  language: string;
  ageGroup: '2-4' | '5-7' | '8-10';
}
