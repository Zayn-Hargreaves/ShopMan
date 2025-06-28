// Build sort cho search_after (tất cả API)
const buildSortFields = (sortBy) => {
    const sortArr = [];
    if (sortBy && sortBy.field) {
        sortArr.push({ [sortBy.field]: sortBy.order || "asc" });
        if (sortBy.field !== "createdAt") sortArr.push({ "createdAt": "desc" });
    } else {
        sortArr.push({ "createdAt": "desc" });
    }
    sortArr.push({ "_id": "asc" });
    return sortArr;
}

module.exports = {buildSortFields}