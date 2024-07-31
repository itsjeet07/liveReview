import { Router } from 'express';
import { getReviews, getReviewById, createReview, updateReview, deleteReview, undoDeletedReview } from '../controllers/review-controller';

const router: Router = Router();

router.get('/reviews', getReviews);
router.get('/reviews/:id', getReviewById);
router.post('/reviews', createReview);
router.put('/reviews/:id', updateReview);
router.get('/reviews/undo-delete/:id', undoDeletedReview);
router.delete('/reviews/:id', deleteReview);

export default router;
