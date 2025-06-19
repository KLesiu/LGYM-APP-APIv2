import ExerciseScores, { ExerciseScoresEntity } from "../models/ExerciseScores";
import Training from "../models/Training";

const findExerciseScore = async (
  gymId: string,
  userId: string,
  exerciseId: string,
  seriesNumber: number
): Promise<ExerciseScoresEntity | null> => {
  try {
    const trainings = await Training.find({
      user: userId,
      gym: gymId,
    }).select("_id");

    const trainingIds = trainings.map((t) => t._id);

    const exerciseScore = await ExerciseScores.findOne({
      user: userId,
      exercise: exerciseId,
      series: seriesNumber,
      training: { $in: trainingIds },
    })
      .sort({ createdAt: -1 })
      .exec();

    return exerciseScore || null;
  } catch (error) {
    console.error("Error in findExerciseScore:", error);
    return null;
  }
};

export { findExerciseScore };
