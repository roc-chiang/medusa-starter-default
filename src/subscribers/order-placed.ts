import {
    type SubscriberConfig,
    type SubscriberArgs,
} from "@medusajs/framework"
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

    let fromEmail = "info@pardpro.ca" // 默認 Pardpro
    if (order.sales_channel_id === SODIUM_SC_ID) {
        fromEmail = "support@sodiumfrostglow.com"
    }

    // 發送通知
    await notificationModuleService.createNotifications({
        to: order.email as string,
        channel: "email",
        template: "order-placed",
        data: {
            order,
            from: fromEmail,
            subject: "Order Confirmation",
        },
    } as any)
}

export const config: SubscriberConfig = {
    event: "order.placed",
}
