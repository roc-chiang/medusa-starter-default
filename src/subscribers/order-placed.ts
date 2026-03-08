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

    // 查詢完整訂單數據，帶上必要的關聯（包含 summary 以獲取結帳總額）
    const order = await orderService.retrieveOrder(data.id, {
        relations: [
            "items",
            "shipping_address",
            "shipping_methods",
            "summary",
        ],
    })

    console.log(`[DEBUG] Order Placed: ${order.id}`)
    console.log(`[DEBUG] Order Totals: total=${order.total}, subtotal=${order.subtotal}, tax=${order.tax_total}, shipping=${order.shipping_total}`)
    console.log(`[DEBUG] Order Summary: ${JSON.stringify(order.summary)}`)

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
