import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { GigsController } from './gigs.controller';
import { GigsRepository } from './gigs.repository';
import { GigsService } from './gigs.service';

@Module({
  imports: [UsersModule],
  controllers: [GigsController],
  providers: [GigsService, GigsRepository],
  exports: [GigsService],
})
export class GigsModule {}
