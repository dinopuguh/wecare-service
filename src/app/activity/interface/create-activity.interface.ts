export interface ICreateActivity {
  name: string;

  photo: string;

  start: string;

  end: string;

  registerDeadline: string;

  description: string;

  volunteerTasks: string;

  volunteerEquipments: string;

  volunteerRequirements: string;

  briefs: string;

  minVolunteers: number;

  donationTarget: number;

  volunteersTotal: number;

  donationsTotal: number;

  area: string;

  maxParticipants: number;

  categoryId: number;

  typeId: number;

  campaignerId: number;
}
