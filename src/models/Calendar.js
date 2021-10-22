import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
    date: {type: Date, default: new Date().toLocaleDateString(), unique:true},
    attendance: [{
        user: {type:mongoose.Schema.Types.ObjectId, require: true, ref: "User"},
        time: {type: String, require: true},
    }]
});

const Calendar = mongoose.model("Calendar", calendarSchema);
export default Calendar;