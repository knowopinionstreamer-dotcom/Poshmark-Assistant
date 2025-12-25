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

export async function getRecentItems(limit?: number) {
    try {
        const items = await db.item.findMany({
            orderBy: { createdAt: 'desc' },
            ...(limit ? { take: limit } : {})
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

export async function deleteItem(id: string) {
    try {
        await db.item.delete({ where: { id } });
        revalidatePath('/inventory');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete item:', error);
        throw new Error('Failed to delete item.');
    }
}

export async function updateItemStatus(id: string, status: string) {
    try {
        await db.item.update({
            where: { id },
            data: { status }
        });
        revalidatePath('/inventory');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to update status:', error);
        throw new Error('Failed to update item status.');
    }
}

export async function getItemById(id: string) {
    try {
        const item = await db.item.findUnique({ where: { id } });
        if (!item) return null;
        return {
            ...item,
            images: item.images ? JSON.parse(item.images) : []
        };
    } catch (error) {
        console.error('Failed to fetch item:', error);
        return null;
    }
}
