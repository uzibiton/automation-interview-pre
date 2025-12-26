import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { FirestoreRepository } from '../database/firestore.repository';
import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [HttpModule],
  controllers: [GroupsController],
  providers: [GroupsService, FirestoreRepository, AuthGuard],
})
export class GroupsModule {}
