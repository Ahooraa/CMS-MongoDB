// 1. آخرین ۱۰ فعالیت انجام‌شده در سیستم
db.userLogs.find().sort({ datetime: -1 }).limit(10);

// 2. تعداد فعالیت‌ها به تفکیک نوع (action)
db.userLogs.aggregate([
  { $group: { _id: "$action", count: { $sum: 1 } } }
]);

// 3. لاگ‌های یک کاربر خاص
db.userLogs.find({ user_id: ObjectId("USER_ID_HERE") });