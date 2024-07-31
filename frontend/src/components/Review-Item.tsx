import React from 'react';
import { deleteReview } from '../services/Review-Service';
import '../styles/ReviewItem.scss';

interface ReviewItemProps {
    review: { id: string; title: string; content: string; dateTime: string };
    onEdit: (review: { id: string; title: string; content: string }) => void;
    onDelete: () => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onEdit, onDelete }) => {
    const handleDelete = async () => {
        await deleteReview(review.id);
        onDelete();
    };

    return (
        <div className={"reviewItem"}>
            <h3 className={"title"}>{review.title}</h3>
            <p className={"content"}>{review.content}</p>
            <p className={"dateTime"}>{new Date(review.dateTime).toLocaleString()}</p>
            <button onClick={() => onEdit(review)} className={"button"}>
                Edit
            </button>
            <button onClick={handleDelete} className={"button"}>
                Delete
            </button>
        </div>
    );
};

export default ReviewItem;
