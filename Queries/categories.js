// 1. تمام دسته‌بندی‌های ریشه‌ای (بدون parent_id)
db.categories.find({ parent_id: { $exists: false } });

// 2. لیست همه دسته‌بندی‌ها با parent_id خودشون
db.categories.find({}, { name: 1, parent_id: 1 });

// 3. پیدا کردن همه زیرمجموعه‌های یک دسته خاص
db.categories.find({ parent_id: ObjectId("CATEGORY_ID_HERE") });