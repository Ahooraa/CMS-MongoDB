// 1. تعداد لایک‌ها برای یک مقاله خاص
db.likes.countDocuments({
    associated_id: ObjectId("ARTICLE_ID_HERE"),
    target_type: "article"
  });
  
  // 2. بررسی اینکه آیا کاربر خاصی یک کامنت رو لایک کرده
  db.likes.findOne({
    associated_id: ObjectId("COMMENT_ID_HERE"),
    target_type: "comment",
    user_id: ObjectId("USER_ID_HERE")
  });
  
  // 3. تعداد لایک‌ها بر اساس نوع هدف
  db.likes.aggregate([
    { $group: { _id: "$target_type", count: { $sum: 1 } } }
  ]);  