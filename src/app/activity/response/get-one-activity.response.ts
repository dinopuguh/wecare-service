import { Location } from '../../../models/Location';
import { Activity } from '../../../models/Activity';

export class GetOneActivityResponse extends Activity {
  bookmarked: boolean;

  followed: boolean;

  location: Location;
}
