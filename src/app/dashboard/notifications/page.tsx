import { getUserNotifications } from "@/app/actions/notifications";
import NotificationsClient from "./NotificationsClient";

export default async function NotificationsPage() {
  const notifications = await getUserNotifications();
  return <NotificationsClient notifications={notifications} />;
}
