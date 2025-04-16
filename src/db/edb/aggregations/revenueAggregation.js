const buildRevenueAggregation = ({ interval= 'month', shopId}) => ({
    [`by_${interval}`]:{
        date_histogram:{
            field:'createAt',
            calender_interval:interval,
            format: interval === 'month' ? 'MMMM yyyy': 'yyyy'
        },
        aggs:{
            total_revenue:{
                sum:{field:'order_TotalPrice'}
            }
        }
    }
})

const buildCombinedRevenueAggregation = ()=>({
    by_year:{
        date_histogram:{
            field:'createAt',
            calender_interval:'year',
            format:'yyyy'
        },
        aggs:{
            total_revenue:{sum:{field:'order_TotalPrice'}},
            by_month:{
                date_histogram:{
                    field:'createAt',
                    calender_interval:'month',
                    format:'MMMM yyyy'
                },
                aggs:{
                    total_revenue:{sum:{field:'order_TotalPrice'}}
                }
            }
        }
    }
})

const buildTopProductsAggregation = ({ metric = 'quantity' })=>({
    by_order_details:{
        nested:{path:'order_details'},
        aggs:{
            by_product:{
                term:{field:'order_details.product_id'},
                aggs:{
                    [metric === 'quantity' ? 'total_quantity' : 'total_revenue']:
                    metric ==='quantity'
                    ? {sum : {field:'order_detail.quantity'}}
                    :{
                        scripted_metric:{
                            init_script:'state.revenue = 0',
                            map_script:'state.revenue += doc[order_details.quantity].value * doc[order_details.price_at_time].value',
                            combine_script:'return state.revenue',
                            reduce_script:'return state.stream().mapToDouble(s -> s).sum()'
                        }
                    },
                    top_products:{
                        bucket_sort:{
                            sort:[{[metric ==='quantity' ? 'total_quantity' : 'total_revenue.value']:{order:'desc'}}],
                            size:10
                        }
                    }
                }
            }
        }
    }
})

module.exports ={buildCombinedRevenueAggregation,buildRevenueAggregation, buildTopProductsAggregation} 

// // doan nay o trong model discount
// const { getClient } = require('../config/elasticsearch');
// const Product = require('../models/sequelize/product'); // Giả định

// const syncDiscountToElasticsearch = async (discountId) => {
//     const client = await getClient();
//     const discount = await Discounts.findByPk(discountId, {
//         include: [{ model: DiscountProduct, include: [Product] }]
//     });

//     const updates = await Promise.all(discount.DiscountProducts.map(async dp => {
//         const product = dp.Product;
//         let discountPercentage = discount.discount_value;
//         if (discount.discount_type === 'fixed') {
//             discountPercentage = (discount.discount_value / product.product_price) * 100; // Chuyển số tiền thành %
//         }

//         return {
//             update: {
//                 _index: 'products',
//                 _id: dp.product_id
//             },
//             doc: {
//                 discount_percentage: discountPercentage,
//                 discount_start_date: discount.discount_StartDate,
//                 discount_end_date: discount.discount_EndDate,
//                 is_on_sale: discount.discount_status === 'active' && discount.discount_UserCounts < discount.discount_MaxUses
//             }
//         };
//     }));

//     await client.bulk({ body: updates.flatMap(update => [{ update }, { doc: update.doc }]) });
// };

// Discounts.afterCreate(async (discount) => await syncDiscountToElasticsearch(discount.id));
// Discounts.afterUpdate(async (discount) => await syncDiscountToElasticsearch(discount.id));

// // xu ly khi discount het han
// const checkExpiredDiscounts = async () => {
//     const client = await getClient();
//     const now = new Date();
//     const expiredDiscounts = await Discounts.findAll({
//         where: {
//             [Op.or]: [
//                 { discount_EndDate: { [Op.lt]: now } },
//                 { discount_UserCounts: { [Op.gte]: Sequelize.col('discount_MaxUses') } }
//             ]
//         },
//         include: [DiscountProduct]
//     });

//     for (const discount of expiredDiscounts) {
//         const updates = discount.DiscountProducts.map(dp => ({
//             update: {
//                 _index: 'products',
//                 _id: dp.product_id
//             },
//             doc: {
//                 discount_percentage: 0,
//                 discount_start_date: null,
//                 discount_end_date: null,
//                 is_on_sale: false
//             }
//         }));
//         await client.bulk({ body: updates.flatMap(update => [{ update }, { doc: update.doc }]) });
//     }
// };

// const cron = require('node-cron');
// cron.schedule('0 0 * * *', checkExpiredDiscounts); // Chạy mỗi ngày

// const { getClient } = require('../config/elasticsearch');
// const Order = require('./sequelize/order'); // Giả định

// const syncOrderToElasticsearch = async (orderId) => {
//     const client = await getClient();
//     const order = await Order.findByPk(orderId);

//     await client.index({
//         index: 'orders',
//         id: order.id,
//         body: {
//             id: order.id,
//             UserId: order.UserId,
//             order_TotalPrice: parseFloat(order.order_TotalPrice), // Chuyển decimal sang float
//             order_Status: order.order_Status,
//             createdAt: order.createdAt,
//             updatedAt: order.updatedAt
//         }
//     });
// };

// Order.afterCreate(async (order) => await syncOrderToElasticsearch(order.id));
// Order.afterUpdate(async (order) => await syncOrderToElasticsearch(order.id));

// const syncOrderToElasticsearch = async (orderId) => {
//     const client = await getClient();
//     const order = await Order.findByPk(orderId, { include: [OrderDetails] });
  
//     await client.index({
//       index: 'orders',
//       id: order.id,
//       body: {
//         id: order.id,
//         UserId: order.UserId,
//         order_TotalPrice: parseFloat(order.order_TotalPrice),
//         order_Status: order.order_Status,
//         ShopId: order.ShopId, // Lấy từ SQL
//         createdAt: order.createdAt,
//         updatedAt: order.updatedAt,
//         order_details: order.OrderDetails.map(detail => ({
//           product_id: detail.product_id,
//           quantity: detail.quantity,
//           price_at_time: parseFloat(detail.price_at_time)
//         }))
//       }
//     });
//   };
  
//   Order.afterCreate(async (order) => await syncOrderToElasticsearch(order.id));