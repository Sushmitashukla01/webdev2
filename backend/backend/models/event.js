const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: String,
    description: String,
    semester: {
        id: Number,
        name: String
    },
    subject: String,
    due: Date,
    scheduledBy: mongoose.Schema.Types.ObjectId
}, { collection: 'Events' });

const Event = mongoose.model('Events', eventSchema);
module.exports = Event;