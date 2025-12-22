import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { FirestoreRepository } from '../database/firestore.repository';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, FirestoreRepository],
})
export class GroupsModule {}
