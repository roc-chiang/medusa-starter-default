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

    // 根據專家最終建議：relations 必須含 summary，且 select 也必須包含 summary 及其欄位
    const order = await orderService.retrieveOrder(data.id, {
        relations: [
            "items",
            "shipping_address",
            "shipping_methods",
            "summary"
        ],
        select: [
            "id",
            "display_id",
            "email",
            "created_at",
            "total",
            "subtotal",
            "tax_total",
            "shipping_total",
            "summary",
            "currency_code",
            "sales_channel_id"
        ]
    } as any)

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
