import { UserRepository } from './auth.repository'
import bcrypt from 'bcrypt'

export class AuthService {
    private userRepo = new UserRepository()

    async register(name: string, email: string, password: string) {
        const existingUser = await this.userRepo.findByEmail(email)
        if (existingUser) {
            throw new Error('User already exists')
        }

        const passwordHash = await bcrypt.hash(password, 10)
        return this.userRepo.create({ name, email, passwordHash })
    }

    async authenticate(email: string, password: string) {
        const user = await this.userRepo.findByEmail(email)
        if (!user) {
            throw new Error('Invalid email or password')
        }

        const valid = await bcrypt.compare(password, user.passwordHash)
        console.log('Password valid:', valid);
        if (!valid) {
            throw new Error('Invalid email or password')
        }

        return user
    }
}
