'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveItemDraft(data: any) {
  try {
    const existingItem = data.id 
      ? await db.item.findUnique({ where: { id: data.id } }) 
      : null;

    if (existingItem) {
      return await db.item.update({
        where: { id: data.id },
        data: {
            ...data,
            images: JSON.stringify(data.images || []),
        }
      });
    } else {
      return await db.item.create({
        data: {
            ...data,
            images: JSON.stringify(data.images || []),
        }
      });
    }
  } catch (error) {
    console.error('Failed to save item:', error);
    throw new Error('Failed to save item draft.');
  }
}

export async function getRecentItems() {
    try {
        const items = await db.item.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        return items.map(item => ({
            ...item,
            images: item.images ? JSON.parse(item.images) : []
        }));
    } catch (error) {
        console.error('Failed to fetch items:', error);
        return [];
    }
}
