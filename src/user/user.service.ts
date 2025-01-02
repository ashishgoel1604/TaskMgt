import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from '../entities/user.entity';
const INITIAL_USER = 'admin@gmail.com';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async createInitialUser() {
    const alreadyExists = await this.userRepository.findOne({
      where: { email: INITIAL_USER }
    });
    if (alreadyExists) {
      throw new BadRequestException({ message: 'User already initiated!' })
    }
    const user = this.userRepository.create({ email: INITIAL_USER, password: '1234', role: Role.ADMIN });
    return this.userRepository.save(user);
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email }
    });
  }

  createUser(email: string, password: string, is_admin: boolean): Promise<User> {
    const user = this.userRepository.create({ email, password, role: !!is_admin ? Role.ADMIN : Role.USER });
    return this.userRepository.save(user);
  }

  findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async checkIfUserAccessAllowed(id: number, loggedinUser: any) {

    if (loggedinUser.role !== Role.ADMIN && loggedinUser?.id !== id) {
      throw new UnauthorizedException({ message: 'You are not allowed to perform this operation!' });
    }
    return true;
  }

  async getUserDetails(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async findUserById(id: number, loggedinUser: any): Promise<User> {
    //this is for now quick implementaion only
    if (!id) {//this is a case, when a logged in user fetches his info
      id = loggedinUser.id;
    } else {
      await this.checkIfUserAccessAllowed(id, loggedinUser);
    }
    return this.getUserDetails(id);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
