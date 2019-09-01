export interface IUpdateActivity {
  name?: string;

  photo?: any;

  start?: string;

  end?: string;

  registerDeadline?: string;

  description?: string;

  volunteerTasks?: string;

  volunteerEquipments?: string;

  volunteerRequirements?: string;

  briefs?: string;

  minVolunteers?: number;

  donationTarget?: number;

  area?: string;

  maxParticipants?: number;

  categoryId?: number;

  typeId?: number;

  campaignerId?: number;
}
