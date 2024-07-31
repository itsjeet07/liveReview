import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWebSocket } from './WebSocketProvider';
import { getReviews, deleteReview, undoDeletedReview } from '../services/Review-Service';
import '../styles/ReviewList.scss';

interface Review {
    _id: string;
    title: string;
    content: string;
    dateTime: string;
}

interface HighlightedReview {
    id: string;
    type: 'created' | 'updated' | 'deleted';
}

const ReviewList: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [highlighted, setHighlighted] = useState<HighlightedReview | null>(null);
    const [deletedReview, setDeletedReview] = useState<Review | null>(null);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const socket = useWebSocket();

    useEffect(() => {
        const fetchReviews = async () => {
            const data = await getReviews(page, 10);
            setReviews(data.reviews);
        };
        fetchReviews();
    }, [page]);

    useEffect(() => {
        if (socket) {

            socket.on('updated', (updatedReview: Review) => {
                setReviews((prevReviews) =>
                    prevReviews.map((review) =>
                        review._id === updatedReview._id ? updatedReview : review
                    )
                );
                setHighlighted({ id: updatedReview._id, type: 'updated' });
            });

            socket.on('deleted', (deletedReview: Review) => {
                setDeletedReview(deletedReview);
                setReviews((prevReviews) =>
                    prevReviews.filter((review) => review._id !== deletedReview._id)
                );
                setHighlighted({ id: deletedReview._id, type: 'deleted' });
                toast((t) => (
                    <div>
                        <span>Review deleted </span>
                        <button onClick={() => handleUndoDelete(deletedReview)}>Undo</button>
                    </div>
                ), {
                    autoClose: 5000,
                    closeButton: false,
                });
            });

            socket.on('created', (newReview: Review) => {
                const newArr = [newReview, ...reviews]
                setReviews(newArr);
                setHighlighted({ id: newReview._id, type: 'created' });
            });
        }
    }, [socket]);

    const handleUndoDelete = async (review: Review) => {
        setReviews((prevReviews) => [review, ...prevReviews]);
        await handleUndoDeleteCall(review._id);
        setDeletedReview(null);
        toast.dismiss();
    };

    const handleUndoDeleteCall = async (id: string) => {
        await undoDeletedReview(id);
    };

    useEffect(() => {
        if (highlighted) {
            const timer = setTimeout(() => setHighlighted(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [highlighted]);

    const handleEdit = (id: string) => {
        navigate(`/${id}`);
    };

    const handleDelete = async (id: string) => {
        await deleteReview(id);
    };

    return (
        <div className={"reviewList"}>
            <button className='create-btn' onClick={() => navigate('/new')}>Create New Review</button>
            <table className={"table"}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Date-time</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review, index) => (
                        <tr key={review._id}
                            className={
                                highlighted && highlighted.id === review._id
                                    ? highlighted.type
                                    : ''
                            }>
                            <td>{index + 1}</td>
                            <td>{review.title}</td>
                            <td>{review.content}</td>
                            <td>{new Date(review.dateTime).toLocaleString()}</td>
                            <td>
                                <button onClick={() => handleEdit(review._id)}>Edit</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(review._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewList;
