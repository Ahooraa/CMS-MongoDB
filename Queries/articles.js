// 1. لیست مقالات منتشرشده همراه با عنوان و تاریخ انتشار
db.articles.find({ status: "published" }, { title: 1, published_date: 1 });

// 2. تعداد مقاله‌ها در هر دسته (category)
db.articles.aggregate([
  { $group: { _id: "$category_id", count: { $sum: 1 } } }
]);

// 3. مقالاتی که هنوز منتشر نشده‌اند اما برنامه‌ریزی شده‌اند
db.articles.find({
  status: "draft",
  scheduled_date: { $exists: true }
});