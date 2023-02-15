import { z } from 'zod';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
})

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const imageRouter = router({
  createPresignedUrl: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .mutation(async ({ctx, input}) => {
      if (!ctx.session.user) {
        throw new Error('User not logged in');
      }
      const userId = ctx.session.user.id;
      const tradeId = input.tradeId;

      const image = await ctx.prisma.image.create({
        data: {
          userId,
          tradeId,
        },
      });

      return new Promise((resolve, reject) => {
        s3.createPresignedPost({
          Fields: {
            key: `${userId}/${tradeId}/${image.id}`,
          },
          Conditions: [
            ["starts-with", "$Content-Type", "image/"],
            ["content-length-range", 0, 1000000],
          ],
          Expires: 600,
          Bucket: process.env.AWS_BUCKET_NAME,
        }, (err, signed) => {
          if (err) return reject(err);
          resolve(signed);
        });
      });
    }
  ),
  getImagesForTrade: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .query(async ({ctx, input}) => {
      if (!ctx.session.user) {
        throw new Error('User not logged in');
      }
      const userId = ctx.session.user.id;
      const tradeId = input.tradeId;

      const images = await ctx.prisma.image.findMany({
        where: {
          userId,
          tradeId,
        },
      });

      const extendedImages = await Promise.all(images.map(async (image) => {
        return {
          ...image,
          url: await s3.getSignedUrlPromise('getObject', {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${userId}/${tradeId}/${image.id}`,
          }),
        };
      }));

      return extendedImages;
    }
  ),
  deleteScreenshotFromTrade: protectedProcedure
    .input(z.object({ tradeId: z.string(), imageId: z.string() }))
    .mutation(async ({ctx, input}) => {
      if (!ctx.session.user) {
        throw new Error('User not logged in');
      }
      const userId = ctx.session.user.id;
      const tradeId = input.tradeId;
      const imageId = input.imageId;

      const image = await ctx.prisma.image.delete({
        where: {
          id: imageId,
        },
      });

      // await s3.deleteObject({
      //   Bucket: process.env.AWS_BUCKET_NAME,
      //   Key: `${userId}/${tradeId}/${imageId}`,
      // }).promise();

      return image;
    }
  ),

});
  