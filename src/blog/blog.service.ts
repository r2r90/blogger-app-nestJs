import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogService {
  async create(){
    return 'This is create a blog service return';
  }

  async getAll() {
    return 'this is service return all blogs';
  }
}
