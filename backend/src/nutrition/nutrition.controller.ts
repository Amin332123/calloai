import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Express } from "express";
import { NutritionService } from "./nutrition.service";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

@Controller("api/nutrition")
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Post("analyze")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor("image", {
      limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: 1 },
      fileFilter: (_request, file, callback) => {
        if (!file.mimetype.startsWith("image/")) {
          callback(new BadRequestException("Please upload an image file."), false);
          return;
        }
        callback(null, true);
      },
    }),
  )
  analyze(@UploadedFile() image?: Express.Multer.File) {
    if (!image) {
      throw new BadRequestException("An image file is required.");
    }

    return this.nutritionService.analyze(image);
  }
}
