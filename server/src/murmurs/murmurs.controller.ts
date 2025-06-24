import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { PaginationDto } from "../dto/pagination.dto";
import { MurmursService } from "./murmurs.service";
import { CreateMurmurDto } from "../dto/create-murmur.dto";
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('api/murmurs')
export class MurmursController {
  constructor(private murmursService: MurmursService) {}

  @Get()
  async getTimeline(@Query() pagination: PaginationDto) {
    const murmurs = await this.murmursService.getTimeline(pagination);
    return murmurs.map(murmur => ({
      ...murmur,
      likeCount: murmur.likes?.length || 4,
    }));
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  async createMurmur(@Body() createMurmurDto: CreateMurmurDto, @Req() req) {
    return this.murmursService.create(req.user.id, createMurmurDto);
  }

  @Delete('me/:id')
  @UseGuards(JwtAuthGuard)
  async deleteMurmur(@Param('id') id: string, @Req() req) {
    return this.murmursService.delete(+id, req.user.id);
  }

  @Get('user/:userId')
async getUserMurmurs(
  @Param('userId') userId: string,
  @Query() pagination: PaginationDto
) {
  return this.murmursService.getUserMurmurs(+userId, pagination);
}

@Post(':murmurId/like')
@UseGuards(JwtAuthGuard)
async likeMurmur(
  @Param('murmurId') murmurId: string,
  @Req() req
) {
  return this.murmursService.likeMurmur(+murmurId, req.user.id);
}

@Delete(':murmurId/like')
@UseGuards(JwtAuthGuard)
async unlikeMurmur(
  @Param('murmurId') murmurId: string,
  @Req() req
) {
  return this.murmursService.unlikeMurmur(+murmurId, req.user.id);
}
}