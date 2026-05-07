import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    private users: User[] = [
        {
            id: "u1",
            name: "Sara Malik",
            email: "sara@example.com",
            username: "sara@example.com", // Used as username for auth
            password: "sara123",
            avatar: "https://i.pravatar.cc/150?img=47",
            role: "freelancer",
            bio: "Graphic designer with 5 years of experience in branding and UI.",
            joinedAt: "2024-01-10",
            rating: 4.9,
            totalReviews: 134,
            createdAt: new Date("2024-01-10"),
        },
        {
            id: "u2",
            name: "Karim Benali",
            email: "karim@example.com",
            username: "karim@example.com",
            password: "karim123",
            avatar: "https://i.pravatar.cc/150?img=12",
            role: "freelancer",
            bio: "Full-stack developer specialized in React and NestJS.",
            joinedAt: "2024-03-05",
            rating: 4.7,
            totalReviews: 89,
            createdAt: new Date("2024-03-05"),
        },
        {
            id: "u3",
            name: "Lina Ouhab",
            email: "lina@example.com",
            username: "lina@example.com",
            password: "lina123",
            avatar: "https://i.pravatar.cc/150?img=23",
            role: "client",
            bio: "Startup founder looking for reliable freelancers.",
            joinedAt: "2024-06-01",
            rating: 0,
            totalReviews: 0,
            createdAt: new Date("2024-06-01"),
        }
    ];

    findAll(): User[] {
        return this.users;
    }

    create(username: string, password: string): Omit<User, 'password'> {
        const user: User = {
            id: Math.random().toString(36).substring(2, 9),
            username,
            password,
            createdAt: new Date(),
        };
        this.users.push(user);
        console.log(this.users
        );
        const { password: _, ...result } = user;
        return result;
    }

    findOne(username: string): User | undefined {
        return this.users.find(user => user.username === username);
    }
}
