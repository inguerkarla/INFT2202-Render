"use strict";

import mongoose, { Document } from 'mongoose';

// Define interface for Event document
interface IEvent extends Document {
    title: string;
    date: string;
    location?: string;
    time: string;
    description: string;
}

// Define schema for Event
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String },
    time: { type: String, required: true },
    description: { type: String, required: true }
});

// Define model for Event
const EventModel = mongoose.model<IEvent>('Event', eventSchema);

export default EventModel;
