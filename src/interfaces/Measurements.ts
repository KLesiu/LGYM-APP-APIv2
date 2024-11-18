import { BodyParts } from "../enums/BodyParts";
import { WeightUnits } from "../enums/Units";

interface MeasurementForm {
  user: string;
  bodyPart: BodyParts;
  unit: WeightUnits;
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
