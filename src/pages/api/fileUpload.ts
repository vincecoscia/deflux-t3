import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db/client";

const fileUpload = async (req: NextApiRequest, res: NextApiResponse) => {
  // Parse csv file and save to database
  const { file } = req.body;
  const { user } = req;
  const { id } = user;
  const trade = await prisma.trade.create({
    data: {
      file,
      userId: id,
    },
  });
  res.status(200).json(trade);
};