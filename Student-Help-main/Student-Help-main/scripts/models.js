class EventModel {
    constructor(title, description, semester, subject, due, user) {
        this.title = title;
        this.description = description;
        this.semester = semester;
        this.subject = subject;
        this.due = due;
        this.scheduledBy = user;
    }
}