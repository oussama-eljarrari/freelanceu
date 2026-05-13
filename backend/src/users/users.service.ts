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

    findById(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    create({ name, email, password }: { name: string; email: string; password: string }): Omit<User, "password"> {
        const createdAt = new Date()
        const joinedAt = createdAt.toISOString().slice(0, 10)

        const roles = ["client", "freelancer"] as const
        const role = roles[Math.floor(Math.random() * roles.length)]

        const bioOptions = [
            "New on the platform and excited to get started.",
            "Open to new collaborations and projects.",
            "Passionate about delivering great results.",
        ]
        const bio = bioOptions[Math.floor(Math.random() * bioOptions.length)]

        const rating = Number((Math.random() * 2 + 3).toFixed(1)) // 3.0 - 5.0
        const totalReviews = Math.floor(Math.random() * 50)

        const user: User = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            email,
            username: email, // login uses email
            password,
            avatar: generateAvatar(name), // Instead of Random pic - aywali avatar dyal use aka (PFP) houwa abreviation dyla full name dyalo
            role,
            bio,
            joinedAt,
            rating,
            totalReviews,
            createdAt,
        }

        this.users.push(user)
        const { password: _, ...result } = user
        return result;
    }

    findOne(email: string): User | undefined {
        return this.users.find(user => user.email === email);
    }

    update(id: string, updateData: Partial<User>): User | undefined {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) return undefined;

        this.users[userIndex] = {
            ...this.users[userIndex],
            ...updateData,
        };

        const { password, ...result } = this.users[userIndex];
        return this.users[userIndex];
    }
}

// Helpers for Initial avatar pfp exemple : User name (ALI ZOUHDI --> PFP is "AZ")
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[parts.length - 1][0]}`;
}

function pickColor(seed: string): string {
  const colors = ["#6C5CE7", "#00B894", "#0984E3", "#E17055"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return colors[Math.abs(h) % colors.length];
}

function generateAvatar(name: string): string {
  const initials = getInitials(name).toUpperCase();
  const bg = pickColor(name);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>
    <rect width='100%' height='100%' fill='${bg}' rx='12'/>
    <text x='50%' y='50%' dy='.35em' text-anchor='middle'
      fill='#fff' font-family='Arial' font-size='48' font-weight='600'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

