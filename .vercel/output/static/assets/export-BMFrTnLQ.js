import{C as e,E as t,d as n,f as r,k as i,l as a,m as o,s}from"./button-CY79z17x.js";function c(e){let t=String(e??``);return/[",\n;]/.test(t)?`"${t.replace(/"/g,`""`)}"`:t}function l(e,t,n=`text/plain;charset=utf-8`){let r=new Blob([t],{type:n}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,document.body.appendChild(a),a.click(),a.remove(),URL.revokeObjectURL(i)}function u(e,t){return`\uFEFF${[e.map(c).join(`,`),...t.map(e=>e.map(c).join(`,`))].join(`
`)}`}function d(e){return new Map(e.map(e=>[e.id,e]))}function f(e,t,n){let r=d(t);return u([`Fecha`,`Factura`,`Proveedor`,`Código`,`Producto`,`Cantidad`,`Costo unitario`,`Total`,`Notas`],e.map(e=>{let t=r.get(e.productId);return[e.date,e.invoiceNumber,e.supplier,t?.code??``,t?.name??`Producto eliminado`,e.quantity,e.unitCost.toFixed(2),s(e).toFixed(2),e.notes]}))}function p(e,n){let r=d(n);return u([`Fecha`,`Ticket`,`Código`,`Producto`,`Cantidad`,`Precio unitario`,`Total venta`,`Costo`,`Ganancia`,`Pago`,`Notas`],e.map(e=>{let n=r.get(e.productId),i=a(e);return[e.date,e.ticketNumber,n?.code??``,n?.name??`Producto eliminado`,e.quantity,e.unitPrice.toFixed(2),i.revenue.toFixed(2),i.cost.toFixed(2),i.profit.toFixed(2),t[e.paymentMethod],e.notes]}))}function m(t){return u([`Código`,`Producto`,`Categoría`,`Unidad`,`Entradas`,`Salidas`,`Stock`,`Mínimo`,`Estado`],t.map(t=>[t.product.code,t.product.name,e[t.product.category],i[t.product.unit],t.entriesQty,t.salesQty,t.stock,t.product.minStock,t.level.toUpperCase()]))}function h(e,t,n){let r=`<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${e}</title>
  <style>
    body { font-family: "Segoe UI", sans-serif; color: #172033; padding: 32px; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    p { margin: 0 0 16px; color: #5c6778; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #d5dce6; padding: 8px 10px; text-align: left; }
    th { background: #1f3864; color: #fff; }
    tfoot td { font-weight: 600; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>${n}</h1>
  <p>${e} · ${new Date().toLocaleString(`es-NI`)}</p>
  ${t}
</body>
</html>`,i=document.createElement(`iframe`);i.setAttribute(`aria-hidden`,`true`),i.style.position=`fixed`,i.style.right=`0`,i.style.bottom=`0`,i.style.width=`0`,i.style.height=`0`,i.style.border=`0`,document.body.appendChild(i);let a=i.contentDocument;a&&(a.open(),a.write(r),a.close(),i.contentWindow?.focus(),i.contentWindow?.print(),window.setTimeout(()=>i.remove(),1500))}function g(e,t){return`<table>
    <thead><tr>${e.map(e=>`<th>${e}</th>`).join(``)}</tr></thead>
    <tbody>${t.map(e=>`<tr>${e.map(e=>`<td>${e}</td>`).join(``)}</tr>`).join(``)}</tbody>
  </table>`}function _(e,t,i){let a=d(t);h(`Entradas / compras`,g([`Fecha`,`Factura`,`Proveedor`,`Producto`,`Cant.`,`Costo u.`,`Total`],e.map(e=>{let t=a.get(e.productId);return[n(e.date),e.invoiceNumber,e.supplier,t?.name??`—`,String(e.quantity),r(e.unitCost,i.currency),r(s(e),i.currency)]})),i.businessName)}function v(e,i,o){let s=d(i);h(`Salidas / ventas`,g([`Fecha`,`Ticket`,`Producto`,`Cant.`,`Total`,`Ganancia`,`Pago`],e.map(e=>{let i=s.get(e.productId),c=a(e);return[n(e.date),e.ticketNumber,i?.name??`—`,String(e.quantity),r(c.revenue,o.currency),r(c.profit,o.currency),t[e.paymentMethod]]})),o.businessName)}function y(t,n){h(`Inventario`,g([`Código`,`Producto`,`Categoría`,`Entradas`,`Salidas`,`Stock`,`Estado`],t.map(t=>[t.product.code,t.product.name,e[t.product.category],String(t.entriesQty),String(t.salesQty),String(t.stock),t.level.toUpperCase()])),n.businessName)}function b(e,t,n){h(`Reporte de ganancias`,`${g([`Indicador`,`Valor`],[[`Total ventas`,r(t.totalSales,e.currency)],[`Total costos`,r(t.totalCost,e.currency)],[`Ganancia bruta`,r(t.grossProfit,e.currency)],[`Margen promedio`,o(t.avgMargin)],[`Transacciones`,String(t.transactions)]])}<br/>${g([`Producto`,`Unidades`,`Ingresos`,`Ganancia`,`Margen`],n.map(t=>[t.name,String(t.units),r(t.revenue,e.currency),r(t.profit,e.currency),o(t.margin)]))}`,e.businessName)}export{y as a,p as c,_ as i,u as l,f as n,b as o,m as r,v as s,l as t};