import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(cat: Cat): Cat[] {
    console.log(cat);
    // this.cats.push(cat);
    return this.cats;
  }
  async findDb(): Promise<Cat[]> {
    const client = new Client({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'postgres',
      //password:'1122'
      port: 5432,
    });
    await client.connect();
    const result = await client.query<Cat>('select * from cat');
    console.log(result.rows);
    const cats = result.rows;
    await client.end();
    return cats;
  }
}
