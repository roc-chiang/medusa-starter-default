import {
    type SubscriberConfig,
    type SubscriberArgs,
} from "@medusajs/framework"
import { IFulfillmentModuleService, INotificationModuleService, IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function shipmentCreatedHandler({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    const fulfillmentModuleService: IFulfillmentModuleService = container.resolve(
        Modules.FULFILLMENT
    )
    const orderModuleService: IOrderModuleService = container.resolve(
        Modules.ORDER
    )
    const notificationModuleService: INotificationModuleService = container.resolve(
        Modules.NOTIFICATION
    )

    // 獲取發貨詳情
    const fulfillment = await fulfillmentModuleService.retrieveFulfillment(data.id, {
        relations: ["labels", "items"]
    })

    // 獲取追蹤號
    const trackingNumber = fulfillment.labels?.[0]?.tracking_number || "Pending"

    // 獲取訂單詳情以獲取 Email 和 Sales Channel (Brand)
    // 注意：fulfillment.order_id 在 v2 中通常可用
    const orderId = (fulfillment as any).order_id
    if (!orderId) {
        console.error(`[ERROR] Fulfillment ${fulfillment.id} has no order_id`)
        return
    }

    const order = await orderModuleService.retrieveOrder(orderId, {
        relations: ["summary", "shipping_address"],
        select: ["id", "display_id", "email", "currency_code", "sales_channel_id"]
    } as any)

    const SALES_CHANNEL_SODIUM = process.env.SALES_CHANNEL_SODIUM
    const brand = order.sales_channel_id === SALES_CHANNEL_SODIUM ? 'sodium' : 'pardpro'
    const fromEmail = "info@pardpro.ca"

    // 發送通知
    await notificationModuleService.createNotifications({
        to: order.email as string,
        channel: "email",
        template: "shipment-confirmation",
        data: {
            order,
            brand,
            from: fromEmail,
            trackingNumber,
            shippingCompany: "Post Canada", // 預設或從 fulfillment 獲取
        },
    } as any)
}

export const config: SubscriberConfig = {
    event: "fulfillment.created",
}
