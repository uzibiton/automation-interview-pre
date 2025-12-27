import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { FirestoreRepository } from '../database/firestore.repository';
import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [HttpModule],
  controllers: [InvitationsController],
  providers: [InvitationsService, FirestoreRepository, AuthGuard],
})
export class InvitationsModule {}
