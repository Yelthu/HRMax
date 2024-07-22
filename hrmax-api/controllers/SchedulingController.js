import Attendance from "../models/Attendance.js"
import { getCurrentYearAndMonth } from '../utils/utils.js'
import Person from "../models/Person.js"

export const getPeople = async (req, res, next) => {
    try {

        const { month, year } = getCurrentYearAndMonth();

        const searchQuery = {
            month: month,
            year: year
        }

        const people = await Person.find(searchQuery);
        // const attendance = await Attendance.find()

        res.status(200).json(people);
    } catch (error) {
        next(error)
    }
}

export const updatePeople = async (req, res, next) => {
    const { changes } = req.body;

    try {

        const peopleUpdates = changes.reduce((acc, change) => {
            const { personId, taskId, date, value } = change;
            if (!acc[personId]) {
                acc[personId] = [];
            }
            acc[personId].push({ taskId, date, value });
            return acc;
        }, {})

        const updatedPeople = await Promise.all(
            Object.keys(peopleUpdates).map(async personId => {
                const person = await Person.findById(personId);
                if (person) {
                    peopleUpdates[personId].forEach(change => {
                        const task = person.tasks.id(change.taskId);
                        if (task) {
                            task.date = change.date || task.date;
                            task.value = change.value || task.value;
                        }
                    });
                    await person.save();

                    return person;
                }
                return null;
            })
        );

        res.status(200).json(updatedPeople.filter(person => person !== null));

    } catch (error) {
        next(error);
    }
}