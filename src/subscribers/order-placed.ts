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

    // 查詢完整訂單數據，帶上必要的關聯（必須包含 summary 才能獲獲取彙總數據）
    let order = await orderService.retrieveOrder(data.id, {
        relations: [
            "items",
            "shipping_address",
            "shipping_methods",
            "summary", // 👈 Medusa v2 核心：必須加這行才能讀取彙總數據
        ],
    })

    // 如果根路徑金額為 0 且 summary 存在，則嘗試從 summary 補齊（應對同步延遲）
    if (order.total === 0 && order.summary) {
        console.log(`[DEBUG] Root totals are 0, using summary data...`)
    }

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
