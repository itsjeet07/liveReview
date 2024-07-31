import { Request, Response } from 'express';
import { Review } from '../models/review-model';
import { broadcast } from '../websocket';

export const getReviews = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ isDeleted: false }).sort({ dateTime: -1 }).skip(skip).limit(limit);
        const totalReviews = await Review.countDocuments();

        res.status(200).json({
            page,
            limit,
            totalPages: Math.ceil(totalReviews / limit),
            totalReviews,
            reviews
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getReviewById = async (req: Request, res: Response) => {
    try {
        const review = await Review.findOne({ _id: req.params.id, isDeleted: false });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
export const createReview = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
        const newReview = new Review({
            title,
            content
        });
        const savedReview = await newReview.save();
        broadcast({ event: 'created', review: savedReview });
        res.status(201).json(savedReview);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateReview = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
        const updatedReview = await Review.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { title, content },
            { new: true }
        );
        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        broadcast({ event: 'updated', review: updatedReview });
        res.status(200).json(updatedReview);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const undoDeletedReview = async (req: Request, res: Response) => {
    try {
        const deletedReview = await Review.findOneAndUpdate(
            { _id: req.params.id, isDeleted: true },
            { isDeleted: false },
            { new: true }
        );
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review Restored' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const deletedReview = await Review.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        broadcast({ event: 'deleted', review: deletedReview });
        res.status(200).json({ message: 'Review deleted' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};