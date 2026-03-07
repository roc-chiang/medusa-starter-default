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

    const fromEmail = "info@pardpro.ca"


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
