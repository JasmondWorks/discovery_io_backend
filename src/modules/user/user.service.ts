import { MongooseRepository } from "../../utils/crud.util";
import User, { IUser } from "../../modules/user/models/user.model";
import { AppError } from "../../utils/app-error.util";

export class UserService {
  private repo: MongooseRepository<IUser>;

  constructor() {
    this.repo = new MongooseRepository(User);
  }

  async getAllUsers(query: Record<string, any>) {
    return await this.repo.findAll(query, {}, ["name", "email"]);
  }

  async getUserById(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new AppError("No user found with that ID", 404);
    return user;
  }

  async createUser(data: any) {
    return await this.repo.create(data);
  }

  async updateUser(id: string, data: any) {
    const user = await this.repo.update(id, data);
    if (!user) throw new AppError("No user found with that ID", 404);
    return user;
  }

  async deleteUser(id: string) {
    const success = await this.repo.delete(id);
    if (!success) throw new AppError("No user found with that ID", 404);
    return true;
  }

  async findByEmail(email: string) {
    return await this.repo.findOne({ email }, "+password");
  }
}
