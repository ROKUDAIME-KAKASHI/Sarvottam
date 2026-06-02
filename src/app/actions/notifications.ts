"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getUserNotifications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    await prisma.notification.update({
      where: { id },
      data: { read: true }
    });
    revalidatePath("/dashboard/notifications");
  } catch (error) {
    console.error("Failed to mark as read:", error);
  }
}

export async function deleteNotification(id: string) {
  try {
    await prisma.notification.delete({
      where: { id }
    });
    revalidatePath("/dashboard/notifications");
  } catch (error) {
    console.error("Failed to delete notification:", error);
  }
}

export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    await prisma.notification.updateMany({
      where: { userId: session.user.id },
      data: { read: true }
    });
    revalidatePath("/dashboard/notifications");
  } catch (error) {
    console.error("Failed to mark all as read:", error);
  }
}
