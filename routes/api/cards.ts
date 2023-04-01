import { NextFunction, Request, Response, Router } from "express";
import * as fs from "fs";
import createHttpError from "http-errors";
//@ts-ignore
import { compress } from "compress-images/promise";
//@ts-ignore
import convert from "image-file-resize";
import Jimp from "jimp";

import path from "path";

const router = Router();

router.get(
  "/api/cards/get/:name",
  async (req: Request, res: Response, next: NextFunction) => {
    let width = Number(req.query.width);
    let height = Number(req.query.height);
    let name = req.params.name;

    let directoryToOriginal = path.join(
      __dirname,
      `../../Cards/Original/${name}`
    );

    if (!fs.existsSync(directoryToOriginal))
      return next(new createHttpError.NotFound());

    if (!width && !height) return res.sendFile(directoryToOriginal);

    let directoryToCompressed = path.join(
      __dirname,
      `../../Cards/Compressed/${width}x${height}/${name}`
    );

    if (fs.existsSync(directoryToCompressed))
      return res.sendFile(directoryToCompressed);

    let ImagePath = `Cards/Original/${name}`;

    const compressImage = async () => {
      const image = await Jimp.read(ImagePath);
      await image.resize(width, height).writeAsync(directoryToCompressed);

      return;
    };

    await compressImage();

    return res.sendFile(directoryToCompressed);
  }
);

export default router;
