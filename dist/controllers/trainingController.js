"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainingDates = exports.getTrainingByDate = exports.getLastTraining = exports.addTraining = void 0;
require("dotenv").config();
const Training_1 = __importDefault(require("../models/Training"));
const User_1 = __importDefault(require("./../models/User"));
const Message_1 = require("../enums/Message");
const exercisesScoresController_1 = require("./exercisesScoresController");
const ExerciseScores_1 = __importDefault(require("../models/ExerciseScores"));
const Exercise_1 = __importDefault(require("../models/Exercise"));
const userController_1 = require("./userController");
const EloRegistry_1 = __importDefault(require("../models/EloRegistry"));
const Gym_1 = __importDefault(require("../models/Gym"));
const mongoose_1 = __importDefault(require("mongoose"));
const addTraining = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { type, createdAt, gym: gymId, exercises: currentExercises, } = req.body;
        const user = yield User_1.default.findById(userId);
        if (!user)
            return res.status(404).send({ msg: Message_1.Message.DidntFind });
        const gym = yield Gym_1.default.findById(gymId);
        if (!gym)
            return res.status(404).send({ msg: Message_1.Message.DidntFind });
        const trainingRecord = yield Training_1.default.create({
            user: userId,
            type,
            createdAt,
            gym: gymId,
        });
        if (!trainingRecord)
            return res.status(404).send({ msg: Message_1.Message.TryAgain });
        const uniqueExerciseIds = [
            ...new Set(currentExercises.map((e) => e.exercise)),
        ];
        const [exerciseDetailsMap, previousScoresMap] = yield Promise.all([
            fetchExerciseDetails(uniqueExerciseIds),
            fetchPreviousScores(userId, gymId, uniqueExerciseIds),
        ]);
        const exercisesToSave = currentExercises.map((e) => (Object.assign(Object.assign({}, e), { training: trainingRecord._id, user: userId, date: createdAt })));
        const { totalElo, savedScoreIds } = yield processAndSaveScores(exercisesToSave, previousScoresMap);
        yield trainingRecord.updateOne({ exercises: savedScoreIds });
        const { rankStatus, oldElo } = yield updateUserRankAndElo(userId, user, totalElo, trainingRecord._id);
        const comparison = buildComparisonReport(currentExercises, previousScoresMap, exerciseDetailsMap);
        //// TODO DELETE After ios relase 4.0.7  <start>
        const exercisesNames = [];
        for (const exercise of req.body.exercises) {
            if (exercisesNames.find((ele) => ele.exerciseId === exercise.exercise))
                continue;
            const exerciseDetails = yield Exercise_1.default.findById(exercise.exercise);
            if (!exerciseDetails) {
                return res.status(404).send({ msg: Message_1.Message.DidntFind });
            }
            exercisesNames.push({
                exerciseName: exerciseDetails.name,
                exerciseId: exerciseDetails._id.toString(),
            });
        }
        const findExerciseScore = (gymId, userId, exerciseId, seriesNumber) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const trainings = yield Training_1.default.find({
                    user: userId,
                    gym: gymId,
                }).select("_id");
                const trainingIds = trainings.map((t) => t._id);
                const exerciseScore = yield ExerciseScores_1.default.findOne({
                    user: userId,
                    exercise: exerciseId,
                    series: seriesNumber,
                    training: { $in: trainingIds },
                })
                    .sort({ createdAt: -1 })
                    .exec();
                return exerciseScore || null;
            }
            catch (error) {
                console.error("Error in findExerciseScore:", error);
                return null;
            }
        });
        const exercises = req.body.exercises.map((ele) => {
            return Object.assign(Object.assign({}, ele), { training: trainingRecord._id, user: userId, date: createdAt });
        });
        const findLastExercisesScoresArray = [];
        // Tworzymy tablicę na wyniki ćwiczeń wraz z obliczonym ELO
        const result = yield Promise.all(exercises.map((ele) => __awaiter(void 0, void 0, void 0, function* () {
            const findLastExerciseSeriesScore = yield findExerciseScore(gymId, userId, ele.exercise, ele.series);
            let elo = 0;
            if (findLastExerciseSeriesScore) {
                findLastExercisesScoresArray.push(findLastExerciseSeriesScore);
                // Obliczanie ELO dla każdego ćwiczenia
                const lastExerciseScores = {
                    series: findLastExerciseSeriesScore.series,
                    score: {
                        reps: findLastExerciseSeriesScore.reps,
                        weight: findLastExerciseSeriesScore.weight,
                        unit: findLastExerciseSeriesScore.unit,
                        _id: findLastExerciseSeriesScore._id.toString(),
                    },
                };
                elo = yield calculateEloPerExercise(ele, lastExerciseScores);
            }
            // Dodanie wyniku ćwiczenia z obliczonym ELO
            const exerciseScoreId = yield (0, exercisesScoresController_1.addExercisesScores)(ele);
            return { exerciseScoreId, elo };
        })));
        const compareExerciseProgress = (lastExerciseScores, exerciseScoresTrainingForm, exercisesNames) => {
            // Zmienna wynikowa
            const results = {
                bestProgress: { exercise: "", series: 0, repsScore: 0, weightScore: 0 },
                worseRegress: { exercise: "", series: 0, repsScore: 0, weightScore: 0 },
            };
            // Zmienna śledząca maksymalne różnice dla progresu i regresu
            let maxProgressValue = -Infinity;
            let maxRegressValue = Infinity;
            // Funkcja do liczenia sumarycznego progresu/regresu
            const calculateTotalChange = (repsDiff, weightDiff) => {
                return repsDiff + weightDiff;
            };
            // Porównywanie wyników
            lastExerciseScores.forEach((lastExerciseScore) => {
                var _a, _b;
                const currentExerciseScores = exerciseScoresTrainingForm.find((exercise) => exercise.exercise === lastExerciseScore.exercise.toString() &&
                    exercise.series === lastExerciseScore.series);
                if (!currentExerciseScores)
                    return;
                // Porównanie reps
                const repsDiff = currentExerciseScores.reps - lastExerciseScore.reps;
                // Porównanie weight
                const weightDiff = currentExerciseScores.weight - lastExerciseScore.weight;
                // Sprawdzenie najlepszego progresu
                if (repsDiff > 0 || weightDiff > 0) {
                    const totalChange = calculateTotalChange(repsDiff, weightDiff);
                    if (totalChange > maxProgressValue) {
                        maxProgressValue = totalChange;
                        results.bestProgress.exercise =
                            ((_a = exercisesNames.find((e) => e.exerciseId === currentExerciseScores.exercise)) === null || _a === void 0 ? void 0 : _a.exerciseName) || "";
                        results.bestProgress.series = currentExerciseScores.series;
                        results.bestProgress.repsScore = repsDiff;
                        results.bestProgress.weightScore = weightDiff;
                    }
                }
                // Sprawdzenie najgorszego regresu
                if (repsDiff < 0 || weightDiff < 0) {
                    const totalChange = calculateTotalChange(repsDiff, weightDiff);
                    if (totalChange < maxRegressValue) {
                        maxRegressValue = totalChange;
                        results.worseRegress.exercise =
                            ((_b = exercisesNames.find((e) => e.exerciseId === currentExerciseScores.exercise)) === null || _b === void 0 ? void 0 : _b.exerciseName) || "";
                        results.worseRegress.series = currentExerciseScores.series;
                        results.worseRegress.repsScore = repsDiff;
                        results.worseRegress.weightScore = weightDiff;
                    }
                }
            });
            // Zwrócenie wyników
            return results;
        };
        const progressObject = compareExerciseProgress(findLastExercisesScoresArray, req.body.exercises, exercisesNames);
        //// TODO DELETE After ios relase 4.0.7  </end>
        return res.status(200).send({
            comparison,
            gainElo: totalElo,
            userOldElo: oldElo,
            profileRank: rankStatus.currentRank,
            nextRank: rankStatus.nextRank,
            msg: Message_1.Message.Created,
            progress: progressObject,
        });
    }
    catch (error) {
        console.error("Błąd podczas dodawania treningu:", error);
        return res.status(500).send({ msg: Message_1.Message.TryAgain });
    }
});
exports.addTraining = addTraining;
const getLastTraining = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield User_1.default.findById(id);
    if (!user)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const training = yield Training_1.default.aggregate([
        {
            $match: { user: user._id },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $limit: 1,
        },
        {
            $lookup: {
                from: "plandays",
                localField: "type",
                foreignField: "_id",
                as: "planDay",
            },
        },
        {
            $unwind: "$planDay",
        },
        {
            $project: {
                type: 1,
                createdAt: 1,
                "planDay.name": 1,
            },
        },
    ]);
    if (!training)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    return res.status(200).send(training[0]);
});
exports.getLastTraining = getLastTraining;
const getTrainingByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const findUser = yield User_1.default.findById(id);
    if (!findUser || !Object.keys(findUser).length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const { createdAt } = req.body;
    const startOfDay = new Date(createdAt);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(createdAt);
    endOfDay.setHours(23, 59, 59, 999);
    const trainings = yield Training_1.default.aggregate([
        {
            $match: {
                user: findUser._id,
                createdAt: {
                    $gte: startOfDay,
                    $lt: endOfDay,
                },
            },
        },
        {
            $lookup: {
                from: "plandays",
                localField: "type",
                foreignField: "_id",
                as: "planDay",
            },
        },
        {
            $unwind: "$planDay",
        },
        {
            $lookup: {
                from: "gyms",
                localField: "gym",
                foreignField: "_id",
                as: "gymDetails",
            },
        },
        {
            $unwind: {
                path: "$gymDetails",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                type: 1,
                exercises: 1,
                createdAt: 1,
                "planDay.name": 1,
                gym: "$gymDetails.name", // Assuming the gym name is stored in the `name` field
            },
        },
    ]);
    if (!trainings.length) {
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    }
    const enrichedTrainings = yield Promise.all(trainings.map((training) => __awaiter(void 0, void 0, void 0, function* () {
        const enrichedExercises = yield Promise.all(training.exercises.map((exercise) => __awaiter(void 0, void 0, void 0, function* () {
            if (!exercise || !exercise.exerciseScoreId)
                return;
            const scoreDetails = yield ExerciseScores_1.default.findById(exercise.exerciseScoreId, "exercise reps series weight unit");
            if (!scoreDetails)
                return res.status(404).send({ msg: Message_1.Message.DidntFind });
            const exerciseDetails = yield Exercise_1.default.findById(scoreDetails.exercise, "name bodyPart");
            return {
                exerciseScoreId: exercise.exerciseScoreId,
                scoreDetails,
                exerciseDetails,
            };
        })));
        // Grupa scoreDetails po exercise
        const groupedExercises = enrichedExercises.reduce((acc, curr) => {
            if (!curr || !curr.scoreDetails)
                return acc;
            const exerciseId = curr.scoreDetails.exercise;
            if (!acc[exerciseId]) {
                acc[exerciseId] = {
                    exerciseScoreId: curr.exerciseScoreId,
                    exerciseDetails: curr.exerciseDetails,
                    scoresDetails: [],
                };
            }
            acc[exerciseId].scoresDetails.push(curr.scoreDetails);
            return acc;
        }, {});
        const exercisesArray = Object.values(groupedExercises);
        return Object.assign(Object.assign({}, training), { exercises: exercisesArray });
    })));
    return res.status(200).send(enrichedTrainings);
});
exports.getTrainingByDate = getTrainingByDate;
const getTrainingDates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const trainings = yield Training_1.default.find({ user: req.params.id }, "createdAt").sort({ createdAt: 1 });
    if (!trainings || !trainings.length)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const dates = trainings.map((ele) => ele.createdAt);
    return res.status(200).send(dates);
});
exports.getTrainingDates = getTrainingDates;
const calculateEloPerExercise = (currentExerciseScore, lastExerciseScore) => __awaiter(void 0, void 0, void 0, function* () {
    let elo;
    if (!lastExerciseScore || !lastExerciseScore.score)
        elo = 0;
    else
        elo = partElo(lastExerciseScore.score.weight, lastExerciseScore.score.reps, currentExerciseScore.weight, currentExerciseScore.reps);
    return elo;
});
const partElo = (prev_weight, prev_reps, acc_weight, acc_reps) => {
    const K = 32;
    const getWeightedScore = (weight, reps) => {
        if (weight <= 15) {
            return weight * 0.3 + reps * 0.7;
        }
        else if (weight <= 80) {
            return weight * 0.5 + reps * 0.5;
        }
        else {
            return weight * 0.7 + reps * 0.3;
        }
    };
    const prev_score = getWeightedScore(prev_weight, prev_reps);
    const acc_score = getWeightedScore(acc_weight, acc_reps);
    const toleranceThreshold = prev_weight > 80 ? 0.1 * prev_score : 0.05 * prev_score;
    let expectedScore;
    if (Math.abs(acc_score - prev_score) <= toleranceThreshold) {
        expectedScore = 0.5;
    }
    else {
        expectedScore = prev_score / (prev_score + acc_score);
    }
    const actualScore = acc_score >= prev_score ? 1 : 0;
    const scoreDifference = (actualScore - expectedScore) *
        (Math.abs(acc_score - prev_score) < toleranceThreshold ? 0.5 : 1);
    const points = K * scoreDifference;
    return Math.round(points);
};
const fetchExerciseDetails = (exerciseIds) => __awaiter(void 0, void 0, void 0, function* () {
    const exercises = yield Exercise_1.default.find({ _id: { $in: exerciseIds } }).select("name");
    return new Map(exercises.map((e) => [e._id.toString(), e.name]));
});
const fetchPreviousScores = (userId, gymId, exerciseIds) => __awaiter(void 0, void 0, void 0, function* () {
    const scores = yield ExerciseScores_1.default.aggregate([
        {
            $lookup: {
                from: "trainings",
                localField: "training",
                foreignField: "_id",
                as: "trainingDetails",
            },
        },
        {
            $unwind: "$trainingDetails",
        },
        {
            $match: {
                user: new mongoose_1.default.Types.ObjectId(userId),
                "trainingDetails.gym": new mongoose_1.default.Types.ObjectId(gymId),
                exercise: {
                    $in: exerciseIds.map((id) => new mongoose_1.default.Types.ObjectId(id)),
                },
            },
        },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: { exercise: "$exercise", series: "$series" },
                lastScore: { $first: "$$ROOT" },
            },
        },
        {
            $project: {
                "lastScore.trainingDetails": 0,
            },
        },
        { $replaceRoot: { newRoot: "$lastScore" } },
    ]);
    return new Map(scores.map((score) => [
        `${score.exercise.toString()}-${score.series}`,
        score,
    ]));
});
const processAndSaveScores = (exercises, previousScoresMap) => __awaiter(void 0, void 0, void 0, function* () {
    let totalElo = 0;
    const savedScoreIds = [];
    for (const exercise of exercises) {
        const key = `${exercise.exercise}-${exercise.series}`;
        const previousScore = previousScoresMap.get(key);
        if (previousScore) {
            const lastExerciseScores = {
                series: previousScore.series,
                score: {
                    reps: previousScore.reps,
                    weight: previousScore.weight,
                    unit: previousScore.unit,
                    _id: previousScore._id.toString(),
                },
            };
            totalElo += yield calculateEloPerExercise(exercise, lastExerciseScores);
        }
        const savedScore = yield (0, exercisesScoresController_1.addExercisesScores)(exercise);
        savedScoreIds.push(savedScore.exerciseScoreId);
    }
    return { totalElo, savedScoreIds };
});
const buildComparisonReport = (currentExercises, previousScoresMap, exerciseDetailsMap) => {
    const comparisonMap = new Map();
    for (const currentExercise of currentExercises) {
        const exerciseId = currentExercise.exercise;
        if (!comparisonMap.has(exerciseId)) {
            const exerciseName = exerciseDetailsMap.get(exerciseId) || "Nieznane ćwiczenie";
            comparisonMap.set(exerciseId, {
                exerciseId: exerciseId,
                exerciseName: exerciseName,
                seriesComparisons: [],
            });
        }
        const previousScore = previousScoresMap.get(`${exerciseId}-${currentExercise.series}`);
        const seriesComparison = {
            series: currentExercise.series,
            currentResult: {
                reps: currentExercise.reps,
                weight: currentExercise.weight,
                unit: currentExercise.unit,
            },
            previousResult: previousScore
                ? {
                    reps: previousScore.reps,
                    weight: previousScore.weight,
                    unit: previousScore.unit,
                }
                : null,
        };
        comparisonMap.get(exerciseId).seriesComparisons.push(seriesComparison);
    }
    return Array.from(comparisonMap.values());
};
const updateUserRankAndElo = (userId, user, eloGained, trainingId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserElo = yield EloRegistry_1.default.findOne({ user: userId }).sort({
        date: -1,
    });
    if (!currentUserElo)
        throw new Error("Nie znaleziono rekordu ELO użytkownika.");
    const rankStatus = yield (0, userController_1.updateUserElo)(eloGained, currentUserElo.elo, user, trainingId);
    return { rankStatus, oldElo: currentUserElo.elo };
});
