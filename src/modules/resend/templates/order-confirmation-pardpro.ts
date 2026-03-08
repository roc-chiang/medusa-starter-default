export function pardproTemplate(order: any): string {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const itemsHtml = order.items
    .map(
      (item: any) => `
        <div class="item">
          <div class="item-info">
            <span class="item-name">${item.title}</span>
            <span class="item-qty">qty: ${item.quantity}</span>
          </div>
          <span class="item-price">CA$${(item.unit_price ?? 0).toFixed(2)}</span>
        </div>`
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #ffffff; color: #1a1a1a; font-family: 'Inter', sans-serif; padding: 40px 20px; }
    .wrapper { max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; }
    .header { background-color: #000000; color: #ffffff; padding: 40px 36px; text-align: center; }
    .brand { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 15px; display: block; }
    .header h1 { font-size: 24px; font-weight: 500; }
    .content { padding: 36px; }
    .order-info { margin-bottom: 30px; font-size: 14px; color: #666; }
    .section-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .item { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #f9f9f9; }
    .item-name { font-weight: 500; font-size: 15px; }
    .item-qty { font-size: 12px; color: #999; margin-top: 4px; display: block; }
    .totals { margin-top: 30px; }
    .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
    .total-row.grand { margin-top: 20px; padding-top: 20px; border-top: 2px solid #000; font-weight: 600; font-size: 18px; }
    .footer { padding: 40px 36px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #999; }
    .footer a { color: #000; text-decoration: none; margin: 0 10px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <span class="brand">Pardpro</span>
      <h1>Order Confirmation</h1>
    </div>
    <div class="content">
      <div class="order-info">
        Order #${order.display_id} • ${formatDate(order.created_at)}
      </div>
      <div class="section-label">Your Selection</div>
      ${itemsHtml}
      <div class="totals">
        <div class="total-row"><span>Subtotal</span><span>CA$${(order.subtotal ?? 0).toFixed(2)}</span></div>
        <div class="total-row"><span>Shipping</span><span>CA$${(order.shipping_total ?? 0).toFixed(2)}</span></div>
        <div class="total-row"><span>Tax</span><span>CA$${(order.tax_total ?? 0).toFixed(2)}</span></div>
        <div class="total-row grand"><span>Total</span><span>CA$${(order.total ?? 0).toFixed(2)}</span></div>
      </div>
      <div style="margin-top: 40px;">
        <div class="section-label">Shipping To</div>
        <p style="font-size: 14px; line-height: 1.6;">
          ${order.shipping_address?.first_name} ${order.shipping_address?.last_name}<br>
          ${order.shipping_address?.address_1}<br>
          ${order.shipping_address?.city}, ${order.shipping_address?.province} ${order.shipping_address?.postal_code}
        </p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Pardpro. All rights reserved.</p>
      <div style="margin-top: 15px;">
        <a href="https://pardpro.ca">Store</a>
        <a href="mailto:info@pardpro.ca">Contact</a>
      </div>
    </div>
  </div>
</body>
</html>`
}
