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
    const orderService: IOrderModuleService = container.resolve(
        Modules.ORDER
    )
    const notificationModuleService: INotificationModuleService = container.resolve(
        Modules.NOTIFICATION
    )

    // 查詢完整訂單數據，帶上必要的關聯
    const order = await orderService.retrieveOrder(data.id, {
        relations: [
            "items",
            "shipping_address",
            "shipping_methods",
        ],
    })

    const SALES_CHANNEL_SODIUM = process.env.SALES_CHANNEL_SODIUM
    const brand = order.sales_channel_id === SALES_CHANNEL_SODIUM ? 'sodium' : 'pardpro'
    const fromEmail = "info@pardpro.ca"


    // 發送通知
    await notificationModuleService.createNotifications({
        to: order.email as string,
        channel: "email",
        template: "order-confirmation",
        data: {
            order,
            brand,
            from: fromEmail,
        },
    } as any)
}

export const config: SubscriberConfig = {
    event: "order.placed",
}
