// parse csv file and return json
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { parse } from 'papaparse'
import { readFileSync } from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

const upload: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      console.log(req.body)
  }
}

export default upload
