export interface ICreateActivityFindVolunteers {
  name: string;

  start: string;

  end: string;

  registerDeadline: string;

  description: string;

  volunteerTasks: string;

  volunteerEquipments: string;

  volunteerRequirements: string;

  briefs: string;

  minVolunteers?: number;

  donationTarget?: number;

  categoryId: number;

  typeId: number;

  campaignerId: number;
}
