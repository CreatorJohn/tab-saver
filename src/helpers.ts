const hasNotificationPermission = async () => await chrome.notifications.getPermissionLevel() === "granted"

export const sendNotification = (id: string) => async (title: string, message: string, timeout?: number) => {
  const permissions = await hasNotificationPermission()

  if (!permissions) return console.error("Notification not enabled!")

  await chrome.notifications.create(id, {
    iconUrl: "icons/icon128.png",
    type: "basic",
    title,
    message
  })

  if (timeout) setTimeout(() => chrome.notifications.clear(id), timeout)
}

export function sendMessage<In extends Message, Out extends MessageResponse | void = void>(message: In): Promise<Out> {
  return chrome.runtime.sendMessage<In, Out>(message);
}