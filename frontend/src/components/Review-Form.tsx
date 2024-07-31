import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createReview, updateReview, getReview, deleteReview } from '../services/Review-Service';
import '../styles/ReviewForm.scss';

const ReviewForm: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchReview = async () => {
                const review = await getReview(id);
                setTitle(review.title);
                setContent(review.content);
            };
            fetchReview();
        }
    }, [id]);

    const handleSave = async () => {
        if (id) {
            await updateReview(id, title, content);
        } else {
            await createReview(title, content);
        }
        navigate('/');
    };

    const handleReset = () => {
        setTitle('');
        setContent('');
    };

    const handleCancel = () => {
        navigate('/');
    };

    const handleDelete = async () => {
        if (id) {
            await deleteReview(id);
            navigate('/');
        }
    };

    return (
        <div className={"reviewForm"}>
            <h4>
                {
                    !id ? "Add Reveiw" : "Update review"
                }
            </h4>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className={"input"}
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                className={"textarea"}
            ></textarea>
            <div className='btn-area'>
                <button onClick={handleSave} className={"button"}>
                    Save
                </button>
                <button onClick={handleReset} className={"button"}>
                    Reset
                </button>
                <button onClick={handleCancel} className={"button"}>
                    Cancel
                </button>
                {id && (
                    <button onClick={handleDelete} className={"button"}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReviewForm;
