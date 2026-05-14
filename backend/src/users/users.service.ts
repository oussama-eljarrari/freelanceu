import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

export type PublicUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findAll(): User[] {
    return this.usersRepository.findAll();
  }

  findById(id: string): User | undefined {
    return this.usersRepository.findById(id);
  }

  create({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): PublicUser {
    const createdAt = new Date();
    const joinedAt = createdAt.toISOString().slice(0, 10);
    const user = {
      id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      email,
      password,
      avatar: generateAvatar(name),
      role: 'client',
      bio: 'New on the platform and excited to get started.',
      joinedAt,
      rating: 0,
      totalReviews: 0,
    };

    const { password: _, ...result } = this.usersRepository.create(user);

    return result;
  }

  findOne(email: string): User | undefined {
    return this.usersRepository.findOne(email);
  }

  update(id: string, updateData: Partial<User>): User | undefined {
    const current = this.findById(id);
    if (!current) {
      return undefined;
    }

    const data = {
      id,
      name: updateData.name ?? current.name ?? '',
      bio: updateData.bio ?? current.bio ?? '',
      avatar: updateData.avatar ?? current.avatar ?? '',
    };

    this.usersRepository.update(id, data);

    return this.findById(id);
  }

  publicUser(id: string): PublicUser | undefined {
    const user = this.findById(id);
    if (!user) {
      return undefined;
    }

    const { password, ...result } = user;
    return result;
  }

  publicUsers(ids: string[]): PublicUser[] {
    return this.usersRepository.findByIds(ids).map((user) => {
      const { password, ...result } = user;
      return result;
    });
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[parts.length - 1][0]}`;
}

function pickColor(seed: string): string {
  const colors = ['#6C5CE7', '#00B894', '#0984E3', '#E17055'];
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
