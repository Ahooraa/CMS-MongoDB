// 1. تمام تگ‌ها بر اساس حروف الفبا
db.tags.find().sort({ name: 1 });

// 2. تگی خاص رو پیدا کن
db.tags.find({ name: /machine/i });

// 3. تعداد کل تگ‌ها
db.tags.countDocuments();