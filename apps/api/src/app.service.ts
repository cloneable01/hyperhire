import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prismaService';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getMenus() {
    return this.prisma.menuItem.findMany({
      where: {
        parentId: null,
        isDeleted: false,
      },
      include: {
        children: {
          where: { isDeleted: false },
          include: {
            children: {
              where: { isDeleted: false },
            },
          },
        },
      },
    });
  }

  async getMenuById(id: string, depth: number = 1) {
    const include: any = {};
    let current = include;

    for (let i = 0; i < depth; i++) {
      current.children = {
        include: {},
        where: { isDeleted: false },
      };
      current = current.children.include;
    }

    return this.prisma.menuItem.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      include,
    });
  }

  async createMenuItem(data: {
    name: string;
    parentId?: string;
    order?: number;
  }) {
    return this.prisma.menuItem.create({
      data: {
        ...data,
        isDeleted: false,
      },
      include: {
        children: {
          where: { isDeleted: false },
        },
      },
    });
  }

  async updateMenuItem(
    id: string,
    data: { name?: string; order?: number; parentId?: string },
  ) {
    return this.prisma.menuItem.update({
      where: {
        id,
        isDeleted: false,
      },
      data,
      include: {
        children: {
          where: { isDeleted: false },
        },
      },
    });
  }

  async deleteMenuItem(id: string) {
    return this.prisma.menuItem.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  // Optional: Add a method to restore deleted items
  async restoreMenuItem(id: string) {
    return this.prisma.menuItem.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
  }

  // Optional: Add a method to get deleted items
  async getDeletedMenus() {
    return this.prisma.menuItem.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });
  }
}
