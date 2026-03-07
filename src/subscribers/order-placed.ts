import {
    type SubscriberConfig,
    type SubscriberArgs,
} from "@medusajs/framework/subscribers"
import { IOrderModuleService, INotificationModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    const orderModuleService: IOrderModuleService = container.resolve(
        Modules.ORDER
    )
    const notificationModuleService: INotificationModuleService = container.resolve(
        Modules.NOTIFICATION
    )

    // 獲取訂單詳情，包括 sales_channel_id
    const order = await orderModuleService.retrieveOrder(data.id)

    const SODIUM_SC_ID = "sc_01KJTHYXXAK6P2VXD4NSMC8R2X"
    const PARDPRO_SC_ID = "sc_01KK2T9YB32B1FBK0E3E5FDQBC"

    let providerId = "resend-pardpro" // 默認使用 Pardpro

    if (order.sales_channel_id === SODIUM_SC_ID) {
        providerId = "resend-sodium"
    } else if (order.sales_channel_id === PARDPRO_SC_ID) {
        providerId = "resend-pardpro"
    }

    // 發送通知
    await notificationModuleService.createNotifications({
        to: order.email as string,
        channel: "email",
        template: "order-placed",
        provider_id: providerId, // 保持此字段，但在類型上使用 as any
        data: {
            order,
        },
    } as any)
}

export const config: SubscriberConfig = {
    event: "order.placed",
}
