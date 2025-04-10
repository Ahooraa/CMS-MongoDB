// 1. نظرات فعال برای یک مقاله خاص
db.comments.find({
    article_id: ObjectId("ARTICLE_ID_HERE"),
    is_active: true
  });
  
  // 2. تعداد پاسخ‌ها به هر کامنت (nested count)
  db.comments.aggregate([
    { $match: { parent_id: { $exists: true } } },
    { $group: { _id: "$parent_id", reply_count: { $sum: 1 } } }
  ]);
  
  // 3. جدیدترین نظرات یک کاربر خاص
  db.comments.find({ user_id: ObjectId("USER_ID_HERE") })
             .sort({ created_at: -1 })
             .limit(5);  