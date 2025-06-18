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
const addTraining = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const planDay = req.body.type;
    const createdAt = req.body.createdAt;
    const gymId = req.body.gym;
    const user = yield User_1.default.findById(userId);
    if (!user)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const gym = yield Gym_1.default.findById(gymId);
    if (!gym)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    // Tworzenie rekordu treningu
    const response = yield Training_1.default.create({
        user: userId,
        type: planDay,
        createdAt: createdAt,
        gym: req.body.gym,
    });
    if (!response)
        return res.status(404).send({ msg: Message_1.Message.TryAgain });
    // Pobieranie ćwiczeń i dodawanie wyników dla każdego z nich
    const exercises = req.body.exercises.map((ele) => {
        return Object.assign(Object.assign({}, ele), { training: response._id, user: userId, date: createdAt });
    });
    // Tworzymy tablicę na wyniki ćwiczeń wraz z obliczonym ELO
    const result = yield Promise.all(exercises.map((ele) => __awaiter(void 0, void 0, void 0, function* () {
        const findLastExercise = req.body.lastExercisesScores.filter((element) => element.exerciseId === ele.exercise);
        if (!findLastExercise || !findLastExercise.length)
            return;
        const lastExerciseScores = findLastExercise[0].seriesScores[ele.series - 1];
        // Obliczanie ELO dla każdego ćwiczenia
        const elo = yield calculateEloPerExercise(ele, lastExerciseScores);
        // Dodanie wyniku ćwiczenia z obliczonym ELO
        const exerciseScoreId = yield (0, exercisesScoresController_1.addExercisesScores)(ele);
        return { exerciseScoreId, elo };
    })));
    let elo = 0;
    result.forEach((ele) => {
        if (!ele)
            return;
        elo += ele.elo;
    });
    // Porównanie progresu (jeśli to potrzebne do innych funkcjonalności)
    const progressObject = compareExerciseProgress(req.body.lastExercisesScores, req.body.exercises);
    const exercisesScoresArray = result.map((ele) => {
        if (ele && ele.exerciseScoreId !== undefined)
            return ele.exerciseScoreId;
    });
    // Aktualizacja rekordu treningu z wynikami ćwiczeń
    yield response.updateOne({ exercises: exercisesScoresArray });
    const currentUserElo = yield EloRegistry_1.default.findOne({ user: userId })
        .sort({ date: -1 })
        .limit(1);
    if (!currentUserElo)
        return res.status(404).send({ msg: Message_1.Message.DidntFind });
    const userRankStatus = yield (0, userController_1.updateUserElo)(elo, currentUserElo.elo, user, response._id);
    return res
        .status(200)
        .send({
        progress: progressObject,
        gainElo: elo,
        userOldElo: currentUserElo.elo,
        profileRank: userRankStatus.currentRank,
        nextRank: userRankStatus.nextRank,
        msg: Message_1.Message.Created,
    });
});
exports.addTraining = addTraining;
const compareExerciseProgress = (lastExerciseScores, exerciseScoresTrainingForm) => {
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
    lastExerciseScores.forEach((lastExercise) => {
        const currentExercise = exerciseScoresTrainingForm.filter((exercise) => exercise.exercise === lastExercise.exerciseId);
        if (currentExercise.length > 0) {
            lastExercise.seriesScores.forEach((lastSeriesScore) => {
                const currentSeriesScore = currentExercise.find((exercise) => exercise.series === lastSeriesScore.series);
                if (currentSeriesScore && lastSeriesScore.score) {
                    // Porównanie reps
                    const repsDiff = currentSeriesScore.reps - lastSeriesScore.score.reps;
                    // Porównanie weight
                    const weightDiff = currentSeriesScore.weight - lastSeriesScore.score.weight;
                    // Sprawdzenie najlepszego progresu
                    if (repsDiff > 0 || weightDiff > 0) {
                        const totalChange = calculateTotalChange(repsDiff, weightDiff);
                        if (totalChange > maxProgressValue) {
                            maxProgressValue = totalChange;
                            results.bestProgress.exercise = lastExercise.exerciseName;
                            results.bestProgress.series = currentSeriesScore.series;
                            results.bestProgress.repsScore = repsDiff;
                            results.bestProgress.weightScore = weightDiff;
                        }
                    }
                    // Sprawdzenie najgorszego regresu
                    if (repsDiff < 0 || weightDiff < 0) {
                        const totalChange = calculateTotalChange(repsDiff, weightDiff);
                        if (totalChange < maxRegressValue) {
                            maxRegressValue = totalChange;
                            results.worseRegress.exercise = lastExercise.exerciseName;
                            results.worseRegress.series = currentSeriesScore.series;
                            results.worseRegress.repsScore = repsDiff;
                            results.worseRegress.weightScore = weightDiff;
                        }
                    }
                }
            });
        }
    });
    // Zwrócenie wyników
    return results;
};
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
        // Konwersja obiektu na tablicę
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
