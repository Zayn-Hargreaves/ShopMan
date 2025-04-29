const router = require("express").Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const categoryController = require("../../../controllers/Category.Controller");
const SearchController = require("../../../controllers/Search.Controller")
/**
 * @swagger
 * /api/v1/category:
 *   get:
 *     summary: Lấy danh sách category không có cha
 *     description: Trả về danh sách các danh mục cấp cao nhất (ParentId = null)
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: get all categories no parent successfully
 *                 metadata:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Thời trang"
 *                       slug:
 *                         type: string
 *                         example: "thoi-trang"
 *                       status:
 *                         type: string
 *                         example: "active"
 */

router.get("/", asyncHandler(categoryController.getAllCategoriesNoParent));
/**
 * @swagger
 * /api/v1/category/{slug}/product:
 *   get:
 *     summary: Lấy sản phẩm theo slug danh mục
 *     description: Trả về danh sách sản phẩm thuộc danh mục (bao gồm cả con/cháu) dựa trên slug
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: Slug của danh mục
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: '{"field":"price","order":"desc"}'
 *         description: Sắp xếp theo trường và thứ tự
 *       - in: query
 *         name: lastSortValues
 *         schema:
 *           type: string
 *           example: '[1190000, "abc123"]'
 *         description: Giá trị để phân trang bằng search_after
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Số lượng sản phẩm trả về
 *       - in: query
 *         name: isAndroid
 *         schema:
 *           type: boolean
 *         description: Có phải client Android không (tối ưu dữ liệu)
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get products by category successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                           slug:
 *                             type: string
 *                           thumb:
 *                             type: string
 *                           rating:
 *                             type: number
 *                           sale_count:
 *                             type: integer
 *                     total:
 *                       type: integer
 *                     suggest:
 *                       type: array
 *                       items:
 *                         type: string
 *                     lastSortValues:
 *                       type: array
 *                       example: [1190000, "abc123"]
 *       404:
 *         description: Không tìm thấy category
 */

router.get('/:slug/product', asyncHandler(SearchController.getProductByCategory));


module.exports = router;