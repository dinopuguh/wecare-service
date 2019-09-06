export interface ICreateActivityFindLocation {
  name: string;

  start: string;

  end: string;

  registerDeadline: string;

  description: string;

  area: string;

  maxParticipants?: number;

  volunteersTotal: number;

  preparedByFacilitator?: string;

  activityPlan?: string;

  locationRequirement?: string;

  additionalInformation?: string;

  categoryId: number;

  typeId: number;

  campaignerId: number;
}
