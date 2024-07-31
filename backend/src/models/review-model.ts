import mongoose, { Document, Schema } from 'mongoose';

interface IReviews extends Document {
    title: string;
    content: string;
    dateTime: Date;
    isDeleted: boolean;
}

const ReviewsSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    dateTime: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
});

const Review = mongoose.model<IReviews>('Reviews', ReviewsSchema);

export { IReviews, Review };
