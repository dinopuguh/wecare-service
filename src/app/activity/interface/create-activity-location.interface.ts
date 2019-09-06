export interface ICreateActivityFindLocation {
  name: string;

  start: string;

  end: string;

  registerDeadline: string;

  description: string;

  categoryId: number;

  typeId: number;

  campaignerId: number;

  area: string;

  maxParticipants?: number;
}
