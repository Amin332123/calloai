import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthController } from "./health.controller";
import { NutritionController } from "./nutrition/nutrition.controller";
import { NutritionService } from "./nutrition/nutrition.service";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController, NutritionController],
  providers: [NutritionService],
})
export class AppModule {}
