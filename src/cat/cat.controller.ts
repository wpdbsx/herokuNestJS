import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CatsService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';

@Controller('cats2')
export class CatsController {
  constructor(private catsService: CatsService) {}
  @Get('db')
  findDb(): Promise<Cat[]> {
    return this.catsService.findDb();
  }
  @Get()
  async findAll(@Body() createCatDto: CreateCatDto): Promise<Cat[]> {
    return this.catsService.findAll(createCatDto);
  }
  @Get(':id')
  findOne(@Param() params, @Query() query): string {
    console.log(params.id);
    console.log(query);
    return `This action returns a #${params.id} cat`;
  }
  @Post('add')
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }
}
