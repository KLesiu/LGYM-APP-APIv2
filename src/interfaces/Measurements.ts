import { BodyParts } from "../enums/BodyParts";
import { HeightUnits, WeightUnits } from "../enums/Units";

interface MeasurementForm {
  user: string;
  bodyPart: BodyParts;
  unit: WeightUnits | HeightUnits;
  value: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MeasurementsHistoryQuery {
  bodyPart: BodyParts;
}
interface MeasurementsHistory {
  measurements: MeasurementForm[];
}

export { MeasurementForm, MeasurementsHistoryQuery, MeasurementsHistory };
