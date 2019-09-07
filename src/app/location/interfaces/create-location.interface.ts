import { BooleanLiteral } from '@babel/types';

export interface ICreateLocation {
  city: string;

  address: string;

  latitude?: number;

  longitude?: number;

  start?: string;

  end?: string;

  description?: string;

  capacity?: number;

  licensePhoto?: string;

  locationPhoto?: string;

  isApproved?: boolean;

  userId: number;

  activityId: number;
}
