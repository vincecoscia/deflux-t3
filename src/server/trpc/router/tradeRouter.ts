import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

// export const tradeRouter = router({
// })