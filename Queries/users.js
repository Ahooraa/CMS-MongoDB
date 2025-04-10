// 1. لیست کاربران فعال به همراه نقش‌شون
db.users.find({ is_active: true }, { fullname: 1, role: 1 });

// 2. تعداد کاربران بر اساس نقش
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
]);

// 3. کاربرانی که آخرین ورودشون در یک ماه گذشته نبوده
db.users.find({
  last_login: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
});