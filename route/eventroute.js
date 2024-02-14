const express = require('express');
const router = express.Router();
const Event = require('../model/event.js');
const auth = require('../middleware/auth');
const moment = require('moment');

// GET all events for the logged-in user
router.get("/events", auth, async (req, res) => {
    try {
        const events = await Event.find({ userId: req.user._id });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST create a new event for the logged-in user


router.post("/event", auth, async (req, res) => {
    const { title, description, startTime, endTime, isPrivate, eventType } = req.body;
    console.log(req.body)
    try {
        // Parse the time strings into Date objects using moment.js
        const startDateTime = moment(startTime, "h:mmA").toDate();
        const endDateTime = moment(endTime, "h:mmA").toDate();

        // Create a new event instance with the parsed Date objects
        const newEvent = new Event({
            title,
            description,
            startTime: startDateTime,
            endTime: endDateTime,
            isPrivate,
            eventType,
            userId: req.body.userId // Assuming you have the userId available in the request
        });

        // Save the new event to the database
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.log(error)
        res.status(500).json({error});
    }
});

// GET retrieve details of a specific event
router.get("/events/:eventId", auth, async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await Event.findOne({ _id: eventId, userId: req.user._id });
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT update details of a specific event
router.put("/events/:eventId", auth, async (req, res) => {
    const { eventId } = req.params;
    const { title, description, startTime, endTime,  isPrivate, eventType } = req.body;
    try {
        let event = await Event.findOne({ _id: eventId, userId: req.user._id });
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        event.title = title;
        event.description = description;
        event.startTime = startTime;
        event.endTime = endTime;
        // event.allDay = allDay;
        event.isPrivate = isPrivate;
        event.eventType = eventType;
        await event.save();
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE delete a specific event
router.delete("/events/:eventId", auth, async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await Event.findOneAndDelete({ _id: eventId, userId: req.user._id });
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
